-- Crear tabla de cupones de descuento
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP NOT NULL,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar cupon IDESTIE10 (10% de descuento)
INSERT INTO coupons (code, discount_type, discount_value, is_active, valid_from, valid_until, max_uses, current_uses)
VALUES (
  'IDESTIE10',
  'percentage',
  10,
  true,
  NOW(),
  '2027-12-31 23:59:59',
  1000,
  0
)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  is_active = EXCLUDED.is_active,
  valid_until = EXCLUDED.valid_until,
  updated_at = NOW();

-- Insertar cupon IDESIE2026 (precio fijo 1100 EUR para Master BIM Full Time)
INSERT INTO coupons (code, discount_type, discount_value, is_active, valid_from, valid_until, max_uses, current_uses)
VALUES (
  'IDESIE2026',
  'fixed',
  1100,
  true,
  NOW(),
  '2026-12-31 23:59:59',
  500,
  0
)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  is_active = EXCLUDED.is_active,
  valid_until = EXCLUDED.valid_until,
  updated_at = NOW();

-- Verificar que se insertaron
SELECT id, code, discount_type, discount_value, is_active, valid_until FROM coupons;
