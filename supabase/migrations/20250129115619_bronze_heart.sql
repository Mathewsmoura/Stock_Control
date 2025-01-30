/*
  # Fix RLS policies for products table

  1. Changes
    - Update RLS policies to allow public access for now
    - Later we can add proper authentication and user-specific policies

  2. Security
    - Enable RLS on products table
    - Add policies for public access to read and write data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read all products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update their own products" ON products;

-- Create new policies for public access
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON products
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON products
  FOR UPDATE
  TO public
  USING (true);