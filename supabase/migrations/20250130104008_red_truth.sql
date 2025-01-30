/*
  # Add delivered status and is_delivered column

  1. Changes
    - Add 'delivered' as a valid status value
    - Add is_delivered boolean column with default false
    - Update status check constraint to include 'delivered'

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Add 'delivered' to status check constraint
  ALTER TABLE products 
    DROP CONSTRAINT IF EXISTS products_status_check;
    
  ALTER TABLE products 
    ADD CONSTRAINT products_status_check 
    CHECK (status IN ('on_time', 'upcoming', 'delayed', 'delivered'));

  -- Add is_delivered column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_delivered'
  ) THEN
    ALTER TABLE products 
      ADD COLUMN is_delivered boolean NOT NULL DEFAULT false;
  END IF;
END $$;