-- Migration: Add master user Julio (idempotent)
INSERT INTO authorized_users (phone, name, email, role, pin_code, barrio_asignado, barrio_representado)
VALUES ('605676002', 'Julio', NULL, 'master', '123456', NULL, NULL)
ON CONFLICT (phone) DO UPDATE SET
  name = EXCLUDED.name,
  role = 'master',
  pin_code = COALESCE(EXCLUDED.pin_code, authorized_users.pin_code),
  barrio_asignado = COALESCE(EXCLUDED.barrio_asignado, authorized_users.barrio_asignado),
  barrio_representado = COALESCE(EXCLUDED.barrio_representado, authorized_users.barrio_representado);
