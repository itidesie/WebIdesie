-- Create applications table for IDESIE scholarship applications
CREATE TABLE IF NOT EXISTS public.applications (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  mobile_phone VARCHAR(20),
  address TEXT,
  postal_code VARCHAR(10),
  city VARCHAR(100),
  nationality VARCHAR(100),
  id_passport VARCHAR(50),
  date_of_birth DATE,
  place_of_birth VARCHAR(255),
  university_history TEXT,
  degree VARCHAR(255),
  year_of_study VARCHAR(50),
  average_grade VARCHAR(10),
  additional_education TEXT,
  certifications TEXT,
  work_usage_languages TEXT,
  language_spoken VARCHAR(100),
  language_spoken_level VARCHAR(50),
  language_written_level VARCHAR(50),
  professional_experience TEXT NOT NULL,
  declaration_agreed BOOLEAN NOT NULL DEFAULT false,
  signature_name VARCHAR(255) NOT NULL,
  signature_place VARCHAR(255),
  signature_date DATE,
  gdpr_agreed BOOLEAN NOT NULL DEFAULT false,
  full_form_json JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);

-- Create index on first_name and last_name for searching
CREATE INDEX IF NOT EXISTS idx_applications_name ON public.applications(last_name, first_name);
