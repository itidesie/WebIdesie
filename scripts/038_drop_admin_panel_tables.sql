-- Elimina por completo las tablas del panel de administración (/admin/*),
-- retirado del todo del código en esta misma sesión: rutas, componentes,
-- Server Actions, middleware.ts, lib/admin-auth.ts, lib/admin-secret.ts,
-- lib/admin-session.ts, lib/verify-origin.ts, ADMIN_SESSION_SECRET.
--
-- Decisión explícita del cliente, confirmada antes de escribir este script:
-- borrar también la base de datos, incluida la única cuenta de admin real
-- que existía. Hay un pg_dump completo de la base tomado antes de esta
-- sesión (Fase 1 de la auditoría) que incluye estas dos tablas con sus
-- datos, por si algún día hiciera falta recuperar algo.
--
-- Orden: admin_sessions antes que admin_users (admin_sessions.admin_id
-- referencia a admin_users.id).
--
-- Cómo ejecutar: pégalo en Supabase → SQL Editor → Run.

drop table if exists public.admin_sessions;
drop table if exists public.admin_users;

-- El rate limiting seguía usando el mismo public.rate_limit_hit() genérico
-- (lib/rate-limit.ts) para el resto de formularios — nada que tocar ahí, ya
-- no tiene ningún bucket de login de admin desde que se quitó el código.
