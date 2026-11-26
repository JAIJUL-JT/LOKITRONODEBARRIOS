-- =============================================================================
-- 🏆 TABLA DE PUNTUACIONES: BOTXOTETRIX (TETRIS DEL BOTXO)
-- Aplicar manualmente con psql (no se despliega con Vercel; sql/ va en .vercelignore):
--   psql "$POSTGRES_URL_NON_POOLING" -f sql/botxotetrix_scores.sql
-- ==============================================================================

create table if not exists public.botxotetrix_scores (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    player_name text not null,
    score integer not null default 0,
    lines integer not null default 0,
    level integer not null default 1
);

-- Índices de rendimiento para la clasificación
create index if not exists idx_botxotetrix_scores_top
    on public.botxotetrix_scores (score desc, created_at desc);

-- Seguridad a nivel de fila (RLS)
alter table public.botxotetrix_scores enable row level security;

-- Lectura pública de puntuaciones
create policy "Lectura pública de puntuaciones de BotxoTetrix"
    on public.botxotetrix_scores
    for select
    using (true);

-- Inserción pública con validaciones
create policy "Inserción pública de puntuaciones de BotxoTetrix"
    on public.botxotetrix_scores
    for insert
    with check (
        length(trim(player_name)) > 0 and
        score >= 0 and
        lines >= 0 and
        level >= 1
    );

-- Publicación realtime (patrón botxitrono_scores)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'botxotetrix_scores'
  ) then
    alter publication supabase_realtime add table public.botxotetrix_scores;
  end if;
end;
$$;
