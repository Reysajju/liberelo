-- Create custom types (enums)
CREATE TYPE user_type AS ENUM ('AUTHOR', 'REVIEWER', 'BOTH');
CREATE TYPE book_status AS ENUM ('DRAFT', 'PRE_LAUNCH', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE campaign_type AS ENUM ('PRE_LAUNCH', 'POST_LAUNCH');
CREATE TYPE campaign_status AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE claim_status AS ENUM ('CLAIMED', 'DOWNLOADED', 'READING', 'REVIEWED', 'GHOSTED');

-- Profiles Table
CREATE TABLE profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  user_type user_type DEFAULT 'REVIEWER',
  bio TEXT,
  amazon_profile_url TEXT,
  goodreads_profile_url TEXT,
  preferred_genres TEXT, -- Store as JSON array string
  reviewer_rating FLOAT DEFAULT 0,
  total_reviews_given INTEGER DEFAULT 0,
  author_bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books Table
CREATE TABLE books (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blurb TEXT,
  cover_image TEXT,
  genre TEXT,
  isbn TEXT,
  manuscript_file TEXT,
  manuscript_type TEXT,
  release_date TIMESTAMP WITH TIME ZONE,
  amazon_url TEXT,
  apple_books_url TEXT,
  kindle_unlimited BOOLEAN DEFAULT FALSE,
  status book_status DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  target_review_count INTEGER DEFAULT 50,
  campaign_type campaign_type NOT NULL,
  price_per_review FLOAT DEFAULT 0.98,
  total_amount FLOAT DEFAULT 0,
  paypal_order_id TEXT,
  paypal_capture_id TEXT,
  status campaign_status DEFAULT 'DRAFT',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims Table
CREATE TABLE claims (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status claim_status DEFAULT 'CLAIMED',
  review_url TEXT,
  review_posted_at TIMESTAMP WITH TIME ZONE,
  reminders_sent INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, reviewer_id)
);

-- NextAuth Support (if still using external NextAuth, otherwise Supabase Auth handles these)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(identifier, token)
);

-- Automate updated_at (Postgres function)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
