-- ==============================================================================
-- 🏆 TABLA DE PUNTUACIONES GLOBALES: BOTXITRONO (LOKITRONO RUNNER)
-- ==============================================================================

create table if not exists public.botxitrono_scores (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    player_name text not null,
    hero_id text not null default 'aritza',
    score integer not null default 0,
    level integer not null default 1,
    coins integer not null default 0
);

-- Índices de rendimiento para tabla de clasificación
create index if not exists idx_botxitrono_scores_top on public.botxitrono_scores (score desc, created_at desc);
create index if not exists idx_botxitrono_scores_hero on public.botxitrono_scores (hero_id, score desc);

-- Seguridad a nivel de fila (RLS)
alter table public.botxitrono_scores enable row level security;

-- Permitir lectura pública de las puntuaciones
create policy "Lectura pública de puntuaciones de Botxitrono"
    on public.botxitrono_scores
    for select
    using (true);

-- Permitir inserción anónima/pública de nuevas puntuaciones
create policy "Inserción pública de puntuaciones de Botxitrono"
    on public.botxitrono_scores
    for insert
    with check (
        length(trim(player_name)) > 0 and
        score >= 0 and
        level >= 1
    );

-- Habilitar publicación en tiempo real con Supabase Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'botxitrono_scores'
  ) then
    alter publication supabase_realtime add table public.botxitrono_scores;
  end if;
end;
$$;
