-- Insert para crear el usuario SORAYA
INSERT INTO authorized_users (phone, name, email, role, pin_code, barrio_asignado) VALUES
('456123456', 'SORAYA', NULL, 'jugador', '1234', 'Deusto')
ON CONFLICT (phone) DO NOTHING;
