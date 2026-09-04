-- Script to remove MDEE (Máster en Dirección Estratégica de la Energía) from database
-- Version 3: Fixed RAISE syntax errors
-- Created: 2025-01-04

DO $$
DECLARE
    mdee_product_id INTEGER;
    affected_rows INTEGER := 0;
BEGIN
    -- Find MDEE product ID
    SELECT id INTO mdee_product_id 
    FROM public.productos 
    WHERE LOWER(nombre) LIKE '%dirección%energía%'
       OR LOWER(nombre) LIKE '%direccion%energia%'
       OR LOWER(nombre) LIKE '%mdee%'
       OR slug LIKE '%mdee%'
    LIMIT 1;
    
    IF mdee_product_id IS NOT NULL THEN
        -- Delete related data in order (due to foreign key constraints)
        DELETE FROM public.producto_testimonios WHERE producto_id = mdee_product_id;
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        
        DELETE FROM public.producto_requisitos WHERE producto_id = mdee_product_id;
        DELETE FROM public.producto_objetivos WHERE producto_id = mdee_product_id;
        DELETE FROM public.modulo_temas WHERE modulo_id IN (SELECT id FROM public.producto_modulos WHERE producto_id = mdee_product_id);
        DELETE FROM public.producto_modulos WHERE producto_id = mdee_product_id;
        DELETE FROM public.producto_faqs WHERE producto_id = mdee_product_id;
        DELETE FROM public.producto_dirigido WHERE producto_id = mdee_product_id;
        DELETE FROM public.producto_beneficios WHERE producto_id = mdee_product_id;
        
        -- Finally delete the product itself
        DELETE FROM public.productos WHERE id = mdee_product_id;
        
        RAISE NOTICE 'MDEE program removed successfully (ID: %)', mdee_product_id;
    ELSE
        RAISE NOTICE 'No MDEE program found in database';
    END IF;
    
    -- Clean up any orphaned order items for MDEE products
    DELETE FROM public.order_items 
    WHERE product_name LIKE '%Dirección%Energía%' 
       OR product_name LIKE '%MDEE%';
    
    -- Update blog posts that mention MDEE
    UPDATE public.blog_posts
    SET content = REPLACE(content, 'El Máster en Dirección y Gestión de Empresas de Edificación (MDEE) te prepara para liderar proyectos complejos.', 'Nuestros programas de IDESIE te preparan para liderar proyectos complejos de construcción.')
    WHERE content LIKE '%MDEE%';
    
    RAISE NOTICE 'MDEE removal completed successfully';
END $$;
