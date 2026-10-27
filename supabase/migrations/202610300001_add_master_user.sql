-- Migration: Add master user Julio
INSERT INTO authorized_users (phone, name, email, role, pin_code, barrio_asignado, barrio_representado)
VALUES ('605676002', 'Julio', NULL, 'master', '123456', NULL, NULL);
