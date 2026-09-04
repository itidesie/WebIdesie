-- Create applications table for IDESIE application form submissions
CREATE TABLE IF NOT EXISTS public.applications (
    id SERIAL PRIMARY KEY,
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    address VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    nationality VARCHAR(100),
    id_passport VARCHAR(50),
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    
    -- Academic Data
    university_history TEXT,
    degree VARCHAR(255),
    year_of_study VARCHAR(4),
    average_grade VARCHAR(10),
    additional_education TEXT,
    
    -- Languages
    certifications TEXT,
    work_usage_languages TEXT,
    language_spoken VARCHAR(100),
    language_spoken_level VARCHAR(50),
    language_written_level VARCHAR(50),
    
    -- Professional Experience
    professional_experience TEXT,
    
    -- Declaration & Signature
    declaration_agreed BOOLEAN NOT NULL DEFAULT false,
    signature_name VARCHAR(255),
    signature_place VARCHAR(255),
    signature_date DATE,
    
    -- GDPR
    gdpr_agreed BOOLEAN NOT NULL DEFAULT false,
    
    -- System fields
    full_form_json JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_first_name ON public.applications(first_name);
CREATE INDEX IF NOT EXISTS idx_applications_last_name ON public.applications(last_name);

-- Add comment to table
COMMENT ON TABLE public.applications IS 'Stores IDESIE Business School application form submissions';
