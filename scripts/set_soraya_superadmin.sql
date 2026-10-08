-- Actualiza el rol de SORAYA a superadmin
UPDATE authorized_users
SET role = 'superadmin'
WHERE phone = '456123456' OR name = 'SORAYA' OR email = 'soraya' ;

-- Verificación simple
SELECT id, phone, name, email, role, barrio_asignado, created_at
FROM authorized_users
WHERE phone = '456123456' OR name = 'SORAYA' OR email = 'soraya';
