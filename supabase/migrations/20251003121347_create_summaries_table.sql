/*
  # Create summaries table for AI Notes Summarizer

  1. New Tables
    - `summaries`
      - `id` (uuid, primary key) - Unique identifier for each summary
      - `original_text` (text) - The original note text submitted by user
      - `summary` (text) - The AI-generated summary of the note
      - `created_at` (timestamptz) - Timestamp when the summary was created
      - `user_id` (uuid) - Reference to the user who created the summary
  
  2. Security
    - Enable RLS on `summaries` table
    - Add policy for authenticated users to read their own summaries
    - Add policy for authenticated users to insert their own summaries
    - Add policy for authenticated users to delete their own summaries
  
  3. Notes
    - The table stores both original text and generated summaries
    - Each summary is associated with a user for multi-user support
    - Timestamps help track when summaries were created
*/

CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text text NOT NULL,
  summary text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own summaries"
  ON summaries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries"
  ON summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own summaries"
  ON summaries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);