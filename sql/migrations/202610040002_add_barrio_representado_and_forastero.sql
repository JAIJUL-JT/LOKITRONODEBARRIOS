-- Añade el campo barrio_representado para reflejar el barrio de cada usuario y
-- crea el barrio especial Forastero como categoría no competitiva.

ALTER TABLE public.authorized_users
    ADD COLUMN IF NOT EXISTS barrio_representado TEXT;

INSERT INTO public.casas (nombre, lema, emblema, color_heraldo, participa)
VALUES
    ('Forastero', 'Casa de origen para quienes vienen de fuera de los barrios representados', '🌍', '#64748b', false)
ON CONFLICT (nombre) DO UPDATE
SET participa = false;

UPDATE public.authorized_users
SET barrio_representado = COALESCE(barrio_representado, barrio_asignado, 'Forastero')
WHERE barrio_representado IS NULL;
