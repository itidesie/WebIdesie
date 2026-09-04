-- Agregar restriccion UNIQUE al campo code si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'coupons_code_unique'
  ) THEN
    ALTER TABLE coupons ADD CONSTRAINT coupons_code_unique UNIQUE (code);
  END IF;
END $$;

-- Verificar la restriccion
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'coupons';
