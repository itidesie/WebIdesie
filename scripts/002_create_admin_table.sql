-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Insert default admin user with the password: Idesieadministracionblog2025
-- Using a simple hash for demonstration (in production, use bcrypt or similar)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'Idesieadministracionblog2025')
ON CONFLICT (username) DO NOTHING;

-- Add a comment to the table
COMMENT ON TABLE admin_users IS 'Stores admin user credentials for blog administration';
