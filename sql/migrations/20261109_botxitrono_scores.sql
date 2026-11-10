-- ==============================================================================
-- MIGRACIÓN SUPABASE: TABLA DE PUNTUACIONES BOTXITRONO
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

create index if not exists idx_botxitrono_scores_top on public.botxitrono_scores (score desc, created_at desc);

alter table public.botxitrono_scores enable row level security;

do $$
begin
    if not exists (
        select 1 from pg_policies where schemaname = 'public' and tablename = 'botxitrono_scores' and policyname = 'Lectura pública de puntuaciones de Botxitrono'
    ) then
        create policy "Lectura pública de puntuaciones de Botxitrono"
            on public.botxitrono_scores for select using (true);
    end if;

    if not exists (
        select 1 from pg_policies where schemaname = 'public' and tablename = 'botxitrono_scores' and policyname = 'Inserción pública de puntuaciones de Botxitrono'
    ) then
        create policy "Inserción pública de puntuaciones de Botxitrono"
            on public.botxitrono_scores for insert with check (length(trim(player_name)) > 0 and score >= 0);
    end if;
end;
$$;

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
