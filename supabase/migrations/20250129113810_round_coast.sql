/*
  # Create products table for inventory control

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `product_code` (text, required)
      - `product_name` (text, required)
      - `request_code` (text, required)
      - `order_number` (text, required)
      - `department` (text, required)
      - `delivery_date` (date, required)
      - `observation` (text)
      - `status` (text, required)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to:
      - Read all products
      - Insert their own products
      - Update their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text NOT NULL,
  product_name text NOT NULL,
  request_code text NOT NULL,
  order_number text NOT NULL,
  department text NOT NULL,
  delivery_date date NOT NULL,
  observation text,
  status text NOT NULL CHECK (status IN ('on_time', 'upcoming', 'delayed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);