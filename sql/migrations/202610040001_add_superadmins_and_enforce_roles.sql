-- Asegura que solo existan los 3 roles válidos del proyecto y deja a Julio y Ainhoa como superadmins.
-- Ejecuta este SQL en el editor SQL de Supabase, o en la base de datos del proyecto.

INSERT INTO public.authorized_users (phone, name, email, role)
VALUES
    ('+34605676002', 'Julio', NULL, 'superadmin'),
    ('+34663366786', 'Ainhoa', NULL, 'superadmin')
ON CONFLICT (phone) DO UPDATE
SET name = EXCLUDED.name,
    role = 'superadmin',
    email = COALESCE(public.authorized_users.email, EXCLUDED.email);

-- Normaliza cualquier rol inesperado a la categoría por defecto del proyecto.
UPDATE public.authorized_users
SET role = 'jugador'
WHERE role IS NULL
   OR role NOT IN ('jugador', 'tronista', 'superadmin');

-- Comprobación final del conjunto de roles permitidos.
SELECT role, COUNT(*) AS total
FROM public.authorized_users
GROUP BY role
ORDER BY role;
