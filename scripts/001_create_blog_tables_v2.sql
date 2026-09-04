-- Create blog posts table - Version 2 (Fixed)
-- Matches actual database schema exactly
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Using 'published' boolean instead of 'published_date' timestamp
  published BOOLEAN DEFAULT false,
  tags JSONB,
  featured_image_url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Insert sample blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, author, created_at, published, tags, featured_image_url)
VALUES 
  (
    'introduccion-bim',
    'Introducción a BIM: Transformando la Industria de la Construcción',
    'Descubre cómo Building Information Modeling está revolucionando la forma en que diseñamos y construimos proyectos.',
    '<h2>¿Qué es BIM?</h2><p>Building Information Modeling (BIM) es una metodología de trabajo colaborativa que permite crear y gestionar información de un proyecto de construcción durante todo su ciclo de vida.</p><h2>Beneficios de BIM</h2><ul><li>Mejora la coordinación entre equipos</li><li>Reduce errores y retrabajos</li><li>Optimiza costos y tiempos</li><li>Facilita la toma de decisiones</li></ul><p>En IDESIE, formamos profesionales capacitados en las últimas tecnologías BIM para liderar proyectos de construcción del futuro.</p>',
    'IDESIE',
    CURRENT_TIMESTAMP,
    true,
    '["BIM", "Construcción", "Tecnología"]'::jsonb,
    '/images/3d-building-monitor.jpg'
  ),
  (
    'revit-para-arquitectos',
    'Autodesk Revit: La Herramienta Esencial para Arquitectos',
    'Aprende por qué Revit se ha convertido en el software líder para diseño arquitectónico y modelado BIM.',
    '<h2>¿Por qué Revit?</h2><p>Autodesk Revit es la plataforma BIM más utilizada en el mundo para diseño arquitectónico, estructural y MEP.</p><h2>Características principales</h2><ul><li>Modelado paramétrico inteligente</li><li>Documentación automática</li><li>Colaboración en tiempo real</li><li>Análisis energético integrado</li></ul><p>Nuestros programas MBIM y MBIM Online te preparan para dominar Revit y otras herramientas BIM esenciales.</p>',
    'IDESIE',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    true,
    '["Revit", "Arquitectura", "Software"]'::jsonb,
    '/images/autodesk-revit.png'
  ),
  (
    'gestion-proyectos-construccion',
    'Gestión Eficiente de Proyectos de Construcción',
    'Estrategias y mejores prácticas para gestionar proyectos de construcción con éxito.',
    '<h2>La importancia de la gestión</h2><p>Una gestión eficiente es clave para el éxito de cualquier proyecto de construcción, desde la planificación hasta la entrega.</p><h2>Metodologías modernas</h2><ul><li>Lean Construction</li><li>Gestión integrada con BIM</li><li>Planificación 4D y 5D</li><li>Control de costos en tiempo real</li></ul><p>Nuestros programas de IDESIE te preparan para liderar proyectos complejos de construcción.</p>',
    'IDESIE',
    CURRENT_TIMESTAMP - INTERVAL '14 days',
    true,
    '["Gestión", "Proyectos", "Construcción"]'::jsonb,
    '/images/team-analyzing-plans.jpg'
  )
ON CONFLICT (slug) DO NOTHING;
