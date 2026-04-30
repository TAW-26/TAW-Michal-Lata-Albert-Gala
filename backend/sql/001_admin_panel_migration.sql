-- ============================================
-- Migration: Admin Panel Support
-- Execute in Supabase SQL Editor
-- ============================================

-- 1. Add rejected_reason column to reservations
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- 2. Grant admin role to your user (replace with your email):
-- UPDATE users SET role = 'admin' WHERE email = 'TWOJ_EMAIL_TUTAJ';
