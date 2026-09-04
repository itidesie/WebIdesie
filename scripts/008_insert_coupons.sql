-- Insertar cupones de descuento

-- Limpiar cupones existentes (opcional, comentar si no se quiere)
-- DELETE FROM coupons;

-- Insertar cupon IDESTIE10 (10% de descuento)
INSERT INTO coupons (code, discount_type, discount_value, is_active, valid_from, valid_until, max_uses, current_uses, created_at, updated_at)
VALUES (
  'IDESTIE10',
  'percentage',
  10,
  true,
  NOW(),
  '2027-12-31 23:59:59',
  1000,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  is_active = EXCLUDED.is_active,
  valid_until = EXCLUDED.valid_until,
  updated_at = NOW();

-- Insertar cupon IDESIE2026 (precio fijo 1100 EUR)
INSERT INTO coupons (code, discount_type, discount_value, is_active, valid_from, valid_until, max_uses, current_uses, created_at, updated_at)
VALUES (
  'IDESIE2026',
  'fixed',
  1100,
  true,
  NOW(),
  '2026-12-31 23:59:59',
  500,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  is_active = EXCLUDED.is_active,
  valid_until = EXCLUDED.valid_until,
  updated_at = NOW();

-- Insertar cupon IDESBIM26 (precio fijo 550 EUR)
INSERT INTO coupons (code, discount_type, discount_value, is_active, valid_from, valid_until, max_uses, current_uses, created_at, updated_at)
VALUES (
  'IDESBIM26',
  'fixed',
  550,
  true,
  NOW(),
  '2026-12-31 23:59:59',
  500,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  is_active = EXCLUDED.is_active,
  valid_until = EXCLUDED.valid_until,
  updated_at = NOW();

-- Mostrar cupones insertados
SELECT * FROM coupons ORDER BY created_at DESC;
