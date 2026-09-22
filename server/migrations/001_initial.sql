CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('ADMIN','EDITOR')), status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','DISABLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), section TEXT NOT NULL, slug TEXT, title TEXT NOT NULL, is_published BOOLEAN NOT NULL DEFAULT true, status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','REVIEW','PUBLISHED','DISABLED','ARCHIVED')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb, version INTEGER NOT NULL DEFAULT 1, created_by UUID REFERENCES admin_users(id), updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS content_records_section_idx ON content_records(section);
CREATE INDEX IF NOT EXISTS content_records_public_idx ON content_records(section, status);

CREATE TABLE IF NOT EXISTS parent_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), parent_account_id UUID NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE, display_name TEXT NOT NULL,
  age_group TEXT, grade TEXT, avatar TEXT, status TEXT NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, category TEXT NOT NULL, difficulty TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', enabled BOOLEAN NOT NULL DEFAULT true,
  points INTEGER NOT NULL DEFAULT 0, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE, question JSONB NOT NULL DEFAULT '{}'::jsonb, sort_order INTEGER NOT NULL DEFAULT 0, enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vocabulary (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), word TEXT NOT NULL, definition TEXT NOT NULL, example TEXT NOT NULL DEFAULT '', difficulty TEXT, payload JSONB NOT NULL DEFAULT '{}'::jsonb, status TEXT NOT NULL DEFAULT 'DRAFT', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS etymology (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), word TEXT NOT NULL, origin TEXT NOT NULL, related_information TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'DRAFT', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS writing_submissions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), child_profile_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE, prompt_id TEXT NOT NULL, content TEXT NOT NULL, word_count INTEGER NOT NULL, assessment_status TEXT NOT NULL DEFAULT 'SUBMITTED', submitted_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS writing_assessments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), submission_id UUID NOT NULL UNIQUE REFERENCES writing_submissions(id) ON DELETE CASCADE, provider TEXT NOT NULL, model TEXT NOT NULL, score NUMERIC(4,1) NOT NULL, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS points_transactions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), child_profile_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE, source_type TEXT NOT NULL, source_id TEXT NOT NULL, points INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(child_profile_id, source_type, source_id));

CREATE TABLE IF NOT EXISTS levels (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), level_number INTEGER NOT NULL UNIQUE, name TEXT NOT NULL, required_points INTEGER NOT NULL, enabled BOOLEAN NOT NULL DEFAULT true, payload JSONB NOT NULL DEFAULT '{}'::jsonb);

CREATE TABLE IF NOT EXISTS badges (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, description TEXT NOT NULL, unlock_condition JSONB NOT NULL, enabled BOOLEAN NOT NULL DEFAULT true);

CREATE TABLE IF NOT EXISTS rewards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, points_required INTEGER NOT NULL, enabled BOOLEAN NOT NULL DEFAULT true, redemption_enabled BOOLEAN NOT NULL DEFAULT false, redemption_instructions TEXT);

CREATE TABLE IF NOT EXISTS child_badges (child_profile_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE, badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE, awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(child_profile_id, badge_id));

CREATE TABLE IF NOT EXISTS admin_audit_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), admin_user_id UUID NOT NULL REFERENCES admin_users(id), action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());