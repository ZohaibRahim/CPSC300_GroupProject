CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'To Apply',
  notes TEXT,
  job_description TEXT NOT NULL,
  ai_analysis TEXT,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX idx_jobs_user_id ON jobs(user_id);