/*
  # Add soft delete functionality

  1. Changes
    - Add deleted_at timestamp column for soft deletes
    - Update status check constraint to include 'deleted'

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Add deleted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE products 
      ADD COLUMN deleted_at timestamptz DEFAULT NULL;
  END IF;

  -- Update status check constraint to include 'deleted'
  ALTER TABLE products 
    DROP CONSTRAINT IF EXISTS products_status_check;
    
  ALTER TABLE products 
    ADD CONSTRAINT products_status_check 
    CHECK (status IN ('on_time', 'upcoming', 'delayed', 'delivered', 'deleted'));
END $$;