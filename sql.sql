CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,

  name TEXT,

  title TEXT,

  email TEXT,

  phone TEXT,

  linkedin TEXT,

  github TEXT,

  score INTEGER,

  skills TEXT,

  missing_skills TEXT,

  summary TEXT,

  job_context TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);