-- ============================================================================
-- Ridely Admin Dashboard — operational metrics RPCs
-- Run this ONCE in the MOBILE APP's Supabase project (SQL Editor).
--
-- Purpose: the web admin dashboard needs read-only aggregates over the app's
-- operational tables (users, riders, deliveries, wallets, earnings, locations).
-- Rather than hard-code column names the web repo can't see, these functions
-- RESOLVE real column names at runtime from information_schema and use dynamic
-- SQL. That means:
--   * every function CREATES successfully even if a table/column is missing;
--   * at call time a missing table/column degrades to 0 / [] instead of error;
--   * you normally DO NOT need to edit anything — but if your column names are
--     unusual, add them to the candidate arrays marked `-- ADJUST:` below.
--
-- Safe to run more than once (create or replace). Only ADDS functions; never
-- touches your data. All functions are SECURITY DEFINER and execute-granted to
-- service_role only (the key the web API uses; it bypasses RLS anyway).
--
-- VERIFY after running:
--   select public.admin_overview();
--   select public.admin_earnings_series('day');
--   select public.admin_delivery_funnel();
--   select public.admin_hotzones('delivery');
--   select public.admin_hotzones('rider');
--   select public.admin_leaderboards();
--   select public.admin_recent_activity();
--   select public.admin_users(null, null, 25, 0);
-- ============================================================================

-- ── Introspection helpers ───────────────────────────────────────────────────

create or replace function public._admin_has_table(p_table text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = p_table
  );
$$;

-- Returns the first candidate column that actually exists on p_table (NULL if none).
create or replace function public._admin_col(p_table text, p_candidates text[])
returns text language sql stable security definer set search_path = public as $$
  select c.column_name
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = p_table
    and c.column_name = any(p_candidates)
  order by array_position(p_candidates, c.column_name)
  limit 1;
$$;

-- Count rows in a table (0 if the table is missing or anything errors).
create or replace function public._admin_count(p_table text)
returns bigint language plpgsql stable security definer set search_path = public as $$
declare v bigint := 0;
begin
  if not public._admin_has_table(p_table) then return 0; end if;
  execute format('select count(*) from public.%I', p_table) into v;
  return v;
exception when others then return 0;
end; $$;

-- Count rows where a timestamp column is >= a cutoff (0 if col missing).
create or replace function public._admin_count_since(p_table text, p_col text, p_since timestamptz)
returns bigint language plpgsql stable security definer set search_path = public as $$
declare v bigint := 0;
begin
  if p_col is null or not public._admin_has_table(p_table) then return 0; end if;
  execute format('select count(*) from public.%I where %I >= $1', p_table, p_col)
    using p_since into v;
  return v;
exception when others then return 0;
end; $$;

-- Sum a numeric column across a table (0 if col/table missing).
create or replace function public._admin_sum(p_table text, p_col text)
returns numeric language plpgsql stable security definer set search_path = public as $$
declare v numeric := 0;
begin
  if p_col is null or not public._admin_has_table(p_table) then return 0; end if;
  execute format('select coalesce(sum(%I), 0) from public.%I', p_col, p_table) into v;
  return v;
exception when others then return 0;
end; $$;

-- ── Shared status classification ────────────────────────────────────────────
-- Buckets a raw delivery status string into completed / cancelled / active.
create or replace function public._admin_status_bucket(p_status text)
returns text language sql immutable as $$
  select case
    when lower(coalesce(p_status,'')) = any (array['delivered','completed','complete','done','finished','fulfilled'])  -- ADJUST: completed statuses
      then 'completed'
    when lower(coalesce(p_status,'')) = any (array['cancelled','canceled','rejected','failed','refunded','declined'])  -- ADJUST: cancelled statuses
      then 'cancelled'
    else 'active'
  end;
$$;

-- ── admin_overview ──────────────────────────────────────────────────────────
create or replace function public.admin_overview()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_today       timestamptz := date_trunc('day', now());
  v_week        timestamptz := now() - interval '7 days';
  v_customers   bigint := 0;
  v_riders      bigint := 0;
  v_new_today   bigint := 0;
  v_new_week    bigint := 0;
  v_deliv_total bigint := 0;
  v_deliv_today bigint := 0;
  v_deliv_week  bigint := 0;
  v_active      bigint := 0;
  v_completed   bigint := 0;
  v_cancelled   bigint := 0;
  v_gross       numeric := 0;
  v_commission  numeric := 0;
  v_earnings    numeric := 0;
  v_wallet      numeric := 0;
  c_u_created   text := public._admin_col('users',   array['created_at','inserted_at','createdat','created']); -- ADJUST
  c_r_created   text := public._admin_col('riders',  array['created_at','inserted_at','createdat','created']); -- ADJUST
  c_d_created   text := public._admin_col('deliveries', array['created_at','inserted_at','requested_at','ordered_at']); -- ADJUST
  c_d_status    text := public._admin_col('deliveries', array['status','delivery_status','state','order_status']);      -- ADJUST
  c_d_fare      text := public._admin_col('deliveries', array['fare','amount','price','total','total_amount','cost','delivery_fee']); -- ADJUST
  c_d_comm      text := public._admin_col('deliveries', array['commission','platform_fee','service_fee','company_commission']);       -- ADJUST
  c_e_amount    text := public._admin_col('earnings',  array['amount','net_amount','rider_amount','earning','total','net']); -- ADJUST
  c_e_comm      text := public._admin_col('earnings',  array['commission','platform_fee','service_fee']); -- ADJUST
  c_w_balance   text := public._admin_col('users_wallet', array['balance','wallet_balance','amount','available_balance','current_balance']); -- ADJUST
begin
  v_customers := public._admin_count('users');
  v_riders    := public._admin_count('riders');
  v_new_today := public._admin_count_since('users', c_u_created, v_today)
               + public._admin_count_since('riders', c_r_created, v_today);
  v_new_week  := public._admin_count_since('users', c_u_created, v_week)
               + public._admin_count_since('riders', c_r_created, v_week);

  v_deliv_total := public._admin_count('deliveries');
  v_deliv_today := public._admin_count_since('deliveries', c_d_created, v_today);
  v_deliv_week  := public._admin_count_since('deliveries', c_d_created, v_week);

  if c_d_status is not null and public._admin_has_table('deliveries') then
    begin
      execute format($q$
        select
          count(*) filter (where public._admin_status_bucket(%1$I::text) = 'active'),
          count(*) filter (where public._admin_status_bucket(%1$I::text) = 'completed'),
          count(*) filter (where public._admin_status_bucket(%1$I::text) = 'cancelled')
        from public.deliveries
      $q$, c_d_status) into v_active, v_completed, v_cancelled;
    exception when others then null;
    end;
  end if;

  v_gross      := coalesce(public._admin_sum('deliveries', c_d_fare), 0);
  v_earnings   := coalesce(public._admin_sum('earnings', c_e_amount), 0);
  v_commission := coalesce(public._admin_sum('earnings', c_e_comm), 0);
  if v_commission = 0 then
    v_commission := coalesce(public._admin_sum('deliveries', c_d_comm), 0);
  end if;
  if v_gross = 0 then
    v_gross := v_earnings + v_commission;
  end if;
  v_wallet := coalesce(public._admin_sum('users_wallet', c_w_balance), 0);

  return jsonb_build_object(
    'users', jsonb_build_object(
      'customers', v_customers, 'riders', v_riders,
      'total', v_customers + v_riders,
      'newToday', v_new_today, 'newThisWeek', v_new_week),
    'deliveries', jsonb_build_object(
      'total', v_deliv_total, 'today', v_deliv_today, 'thisWeek', v_deliv_week,
      'active', v_active, 'completed', v_completed, 'cancelled', v_cancelled),
    'revenue', jsonb_build_object(
      'gross', round(v_gross, 2), 'commission', round(v_commission, 2),
      'riderEarnings', round(v_earnings, 2), 'walletFloat', round(v_wallet, 2))
  );
exception when others then
  return jsonb_build_object('error', SQLERRM);
end; $$;

-- ── admin_earnings_series(bucket) ───────────────────────────────────────────
-- p_bucket in ('day','week','month'). Windows: 30 days / 12 weeks / 12 months.
create or replace function public.admin_earnings_series(p_bucket text default 'day')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_bucket   text := lower(coalesce(p_bucket, 'day'));
  v_interval interval;
  v_src      text;   -- source table: earnings preferred, else deliveries
  c_created  text;
  c_amount   text;
  c_comm     text;
  result     jsonb := '[]'::jsonb;
begin
  if v_bucket not in ('day','week','month') then v_bucket := 'day'; end if;
  v_interval := case v_bucket
                  when 'day' then interval '30 days'
                  when 'week' then interval '84 days'
                  else interval '365 days' end;

  if public._admin_has_table('earnings') then
    v_src     := 'earnings';
    c_created := public._admin_col('earnings', array['created_at','inserted_at','earned_at','paid_at']); -- ADJUST
    c_amount  := public._admin_col('earnings', array['amount','net_amount','rider_amount','earning','total','net']); -- ADJUST
    c_comm    := public._admin_col('earnings', array['commission','platform_fee','service_fee']); -- ADJUST
  end if;
  if c_created is null or c_amount is null then
    -- fall back to deliveries as the money source
    v_src     := 'deliveries';
    c_created := public._admin_col('deliveries', array['created_at','inserted_at','requested_at','ordered_at']); -- ADJUST
    c_amount  := public._admin_col('deliveries', array['fare','amount','price','total','total_amount','cost']); -- ADJUST
    c_comm    := public._admin_col('deliveries', array['commission','platform_fee','service_fee']); -- ADJUST
  end if;
  if c_created is null or c_amount is null or not public._admin_has_table(v_src) then
    return '[]'::jsonb;
  end if;

  execute format($q$
    select coalesce(jsonb_agg(to_jsonb(t) order by t.period), '[]'::jsonb)
    from (
      select to_char(date_trunc(%L, %I), 'YYYY-MM-DD') as period,
             round(sum(%I)::numeric, 2)                as gross,
             round(coalesce(%s, 0)::numeric, 2)        as commission,
             count(*)::bigint                          as deliveries
      from public.%I
      where %I >= now() - %L::interval
      group by date_trunc(%L, %I)
      order by date_trunc(%L, %I)
    ) t
  $q$,
    v_bucket, c_created,
    c_amount,
    case when c_comm is not null then format('sum(%I)', c_comm) else '0' end,
    v_src,
    c_created, v_interval,
    v_bucket, c_created,
    v_bucket, c_created
  ) into result;

  return coalesce(result, '[]'::jsonb);
exception when others then
  return '[]'::jsonb;
end; $$;

-- ── admin_delivery_funnel ───────────────────────────────────────────────────
create or replace function public.admin_delivery_funnel()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  c_status text := public._admin_col('deliveries', array['status','delivery_status','state','order_status']); -- ADJUST
  stages   jsonb := '[]'::jsonb;
  v_total  bigint := 0;
  v_done   bigint := 0;
begin
  if c_status is null or not public._admin_has_table('deliveries') then
    return jsonb_build_object('stages', '[]'::jsonb, 'total', 0, 'completionRate', 0);
  end if;

  execute format($q$
    select coalesce(jsonb_agg(to_jsonb(t) order by t.count desc), '[]'::jsonb),
           coalesce(sum(t.count), 0)
    from (
      select coalesce(%1$I::text, 'unknown') as status,
             public._admin_status_bucket(%1$I::text) as bucket,
             count(*)::bigint as count
      from public.deliveries
      group by 1, 2
    ) t
  $q$, c_status) into stages, v_total;

  execute format($q$
    select count(*) from public.deliveries
    where public._admin_status_bucket(%1$I::text) = 'completed'
  $q$, c_status) into v_done;

  return jsonb_build_object(
    'stages', stages,
    'total', v_total,
    'completionRate', case when v_total > 0 then round((v_done::numeric / v_total) * 100, 1) else 0 end
  );
exception when others then
  return jsonb_build_object('stages', '[]'::jsonb, 'total', 0, 'completionRate', 0);
end; $$;

-- ── admin_hotzones(kind) ────────────────────────────────────────────────────
-- p_kind = 'delivery' → delivery pickup coords; 'rider' → rider_locations.
-- Works with either lat/lng numeric columns OR a PostGIS geometry/geography col.
create or replace function public.admin_hotzones(p_kind text default 'delivery')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_kind  text := lower(coalesce(p_kind, 'delivery'));
  v_table text;
  c_lat   text;
  c_lng   text;
  c_geom  text;
  lat_expr text;
  lng_expr text;
  result  jsonb := '[]'::jsonb;
begin
  if v_kind = 'rider' then
    v_table := 'rider_locations';
    c_lat  := public._admin_col(v_table, array['lat','latitude','current_lat','y']); -- ADJUST
    c_lng  := public._admin_col(v_table, array['lng','long','longitude','current_lng','x']); -- ADJUST
    c_geom := public._admin_col(v_table, array['location','geom','geometry','point','current_location','coordinates']); -- ADJUST
  else
    v_table := 'deliveries';
    c_lat  := public._admin_col(v_table, array['pickup_lat','pickup_latitude','origin_lat','from_lat','start_lat']); -- ADJUST
    c_lng  := public._admin_col(v_table, array['pickup_lng','pickup_long','pickup_longitude','origin_lng','from_lng','start_lng']); -- ADJUST
    c_geom := public._admin_col(v_table, array['pickup_location','pickup_geom','pickup_point','origin_location','pickup_coordinates']); -- ADJUST
  end if;

  if not public._admin_has_table(v_table) then return '[]'::jsonb; end if;

  if c_lat is not null and c_lng is not null then
    lat_expr := format('%I::double precision', c_lat);
    lng_expr := format('%I::double precision', c_lng);
  elsif c_geom is not null then
    -- PostGIS: ST_Y = latitude, ST_X = longitude (cast geography→geometry if needed)
    lat_expr := format('st_y(%I::geometry)', c_geom);
    lng_expr := format('st_x(%I::geometry)', c_geom);
  else
    return '[]'::jsonb;
  end if;

  execute format($q$
    with pts as (
      select round((%1$s)::numeric, 2) as glat,
             round((%2$s)::numeric, 2) as glng
      from public.%3$I
      where (%1$s) is not null and (%2$s) is not null
        and (%1$s) between -90 and 90 and (%2$s) between -180 and 180
    ), cells as (
      select glat, glng, count(*)::bigint as cnt
      from pts group by glat, glng
      order by cnt desc limit 30
    )
    select coalesce(jsonb_agg(jsonb_build_object(
             'lat', glat, 'lng', glng,
             'label', glat::text || ', ' || glng::text,
             'count', cnt,
             'intensity', round(cnt::numeric / nullif(max(cnt) over (), 0), 3)
           ) order by cnt desc), '[]'::jsonb)
    from cells
  $q$, lat_expr, lng_expr, v_table) into result;

  return coalesce(result, '[]'::jsonb);
exception when others then
  return '[]'::jsonb;
end; $$;

-- ── admin_leaderboards ──────────────────────────────────────────────────────
create or replace function public.admin_leaderboards()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  top_riders    jsonb := '[]'::jsonb;
  top_customers jsonb := '[]'::jsonb;
  -- riders
  c_r_name  text := public._admin_col('riders', array['full_name','name','display_name']); -- ADJUST
  c_e_rider text := public._admin_col('earnings', array['rider_id','rider','user_id']); -- ADJUST
  c_e_amt   text := public._admin_col('earnings', array['amount','net_amount','rider_amount','earning','total','net']); -- ADJUST
  c_d_rider text := public._admin_col('deliveries', array['rider_id','rider','driver_id']); -- ADJUST
  -- customers
  c_u_name  text := public._admin_col('users', array['full_name','name','display_name']); -- ADJUST
  c_d_cust  text := public._admin_col('deliveries', array['user_id','customer_id','sender_id']); -- ADJUST
  c_d_fare  text := public._admin_col('deliveries', array['fare','amount','price','total','total_amount','cost']); -- ADJUST
begin
  -- Top riders by earnings (falls back to delivery count if earnings unusable)
  if c_e_rider is not null and c_e_amt is not null and public._admin_has_table('earnings')
     and c_r_name is not null then
    begin
      execute format($q$
        select coalesce(jsonb_agg(to_jsonb(t) order by t.earnings desc), '[]'::jsonb)
        from (
          select r.id,
                 coalesce(r.%1$I, 'Rider') as name,
                 round(coalesce(sum(e.%2$I), 0)::numeric, 2) as earnings,
                 count(e.*)::bigint as deliveries
          from public.riders r
          join public.earnings e on e.%3$I = r.id
          group by r.id, r.%1$I
          order by earnings desc
          limit 10
        ) t
      $q$, c_r_name, c_e_amt, c_e_rider) into top_riders;
    exception when others then top_riders := '[]'::jsonb;
    end;
  end if;

  -- Top customers by spend
  if c_d_cust is not null and c_d_fare is not null and c_u_name is not null
     and public._admin_has_table('deliveries') and public._admin_has_table('users') then
    begin
      execute format($q$
        select coalesce(jsonb_agg(to_jsonb(t) order by t.spend desc), '[]'::jsonb)
        from (
          select u.id,
                 coalesce(u.%1$I, 'Customer') as name,
                 round(coalesce(sum(d.%2$I), 0)::numeric, 2) as spend,
                 count(d.*)::bigint as orders
          from public.users u
          join public.deliveries d on d.%3$I = u.id
          group by u.id, u.%1$I
          order by spend desc
          limit 10
        ) t
      $q$, c_u_name, c_d_fare, c_d_cust) into top_customers;
    exception when others then top_customers := '[]'::jsonb;
    end;
  end if;

  return jsonb_build_object('topRiders', top_riders, 'topCustomers', top_customers);
exception when others then
  return jsonb_build_object('topRiders', '[]'::jsonb, 'topCustomers', '[]'::jsonb);
end; $$;

-- ── admin_recent_activity ───────────────────────────────────────────────────
create or replace function public.admin_recent_activity()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  items jsonb := '[]'::jsonb;
  c_d_created text := public._admin_col('deliveries', array['created_at','inserted_at','requested_at']); -- ADJUST
  c_d_status  text := public._admin_col('deliveries', array['status','delivery_status','state']); -- ADJUST
  c_r_created text := public._admin_col('riders', array['created_at','inserted_at']); -- ADJUST
  c_r_name    text := public._admin_col('riders', array['full_name','name']); -- ADJUST
  c_u_created text := public._admin_col('users', array['created_at','inserted_at']); -- ADJUST
  c_u_name    text := public._admin_col('users', array['full_name','name']); -- ADJUST
begin
  execute format($q$
    with ev as (
      %s
      %s
      %s
    )
    select coalesce(jsonb_agg(to_jsonb(ev) order by ev.at desc), '[]'::jsonb)
    from (select * from ev order by at desc limit 25) ev
  $q$,
    case when c_d_created is not null and public._admin_has_table('deliveries') then
      format($d$ select 'delivery' as type,
                       coalesce(%s::text,'Delivery') as label,
                       'New delivery' as sub, %I as at
              from public.deliveries $d$,
              case when c_d_status is not null then format('%I', c_d_status) else '''Delivery''' end,
              c_d_created)
    else 'select null::text as type, null::text as label, null::text as sub, null::timestamptz as at where false' end,
    case when c_r_created is not null and public._admin_has_table('riders') then
      format($r$ union all select 'rider', coalesce(%s::text,'Rider'), 'New rider', %I
              from public.riders $r$,
              case when c_r_name is not null then format('%I', c_r_name) else '''Rider''' end,
              c_r_created)
    else '' end,
    case when c_u_created is not null and public._admin_has_table('users') then
      format($u$ union all select 'user', coalesce(%s::text,'Customer'), 'New customer', %I
              from public.users $u$,
              case when c_u_name is not null then format('%I', c_u_name) else '''Customer''' end,
              c_u_created)
    else '' end
  ) into items;

  return coalesce(items, '[]'::jsonb);
exception when others then
  return '[]'::jsonb;
end; $$;

-- ── admin_users(role, search, limit, offset) ────────────────────────────────
-- Unions app customers (users [+ users_wallet]) and riders into one list with
-- wallet balance and delivery counts. Paginated + searchable.
create or replace function public.admin_users(
  p_role text default null, p_search text default null,
  p_limit int default 25, p_offset int default 0)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_role   text := lower(nullif(p_role, ''));
  v_limit  int  := least(greatest(coalesce(p_limit, 25), 1), 100);
  v_offset int  := greatest(coalesce(p_offset, 0), 0);
  v_search text := nullif(trim(coalesce(p_search, '')), '');
  parts    text[] := array[]::text[];
  sql      text;
  rows     jsonb := '[]'::jsonb;
  v_total  bigint := 0;
  -- users
  c_u_name  text := public._admin_col('users', array['full_name','name','display_name']); -- ADJUST
  c_u_email text := public._admin_col('users', array['email','email_address']); -- ADJUST
  c_u_phone text := public._admin_col('users', array['phone','phone_number','mobile']); -- ADJUST
  c_u_created text := public._admin_col('users', array['created_at','inserted_at']); -- ADJUST
  c_w_user  text := public._admin_col('users_wallet', array['user_id','users_id','owner_id','customer_id']); -- ADJUST
  c_w_bal   text := public._admin_col('users_wallet', array['balance','wallet_balance','amount','available_balance']); -- ADJUST
  -- riders
  c_r_name  text := public._admin_col('riders', array['full_name','name','display_name']); -- ADJUST
  c_r_email text := public._admin_col('riders', array['email','email_address']); -- ADJUST
  c_r_phone text := public._admin_col('riders', array['phone','phone_number','mobile']); -- ADJUST
  c_r_created text := public._admin_col('riders', array['created_at','inserted_at']); -- ADJUST
begin
  -- customers branch
  if (v_role is null or v_role = 'customer') and public._admin_has_table('users') then
    parts := parts || format($u$
      select u.id::text as id,
             coalesce(%s, 'Customer') as name,
             coalesce(%s, '') as email,
             coalesce(%s, '') as phone,
             'customer' as role,
             coalesce(%s, 0)::numeric as wallet_balance,
             %s as created_at
      from public.users u
      %s
    $u$,
      case when c_u_name is not null then format('u.%I', c_u_name) else '''Customer''' end,
      case when c_u_email is not null then format('u.%I', c_u_email) else 'null' end,
      case when c_u_phone is not null then format('u.%I', c_u_phone) else 'null' end,
      case when c_w_bal is not null and c_w_user is not null and public._admin_has_table('users_wallet')
           then format('w.%I', c_w_bal) else '0' end,
      case when c_u_created is not null then format('u.%I', c_u_created) else 'null::timestamptz' end,
      case when c_w_bal is not null and c_w_user is not null and public._admin_has_table('users_wallet')
           then format('left join public.users_wallet w on w.%I = u.id', c_w_user) else '' end
    );
  end if;

  -- riders branch
  if (v_role is null or v_role = 'rider') and public._admin_has_table('riders') then
    parts := parts || format($r$
      select r.id::text as id,
             coalesce(%s, 'Rider') as name,
             coalesce(%s, '') as email,
             coalesce(%s, '') as phone,
             'rider' as role,
             0::numeric as wallet_balance,
             %s as created_at
      from public.riders r
    $r$,
      case when c_r_name is not null then format('r.%I', c_r_name) else '''Rider''' end,
      case when c_r_email is not null then format('r.%I', c_r_email) else 'null' end,
      case when c_r_phone is not null then format('r.%I', c_r_phone) else 'null' end,
      case when c_r_created is not null then format('r.%I', c_r_created) else 'null::timestamptz' end
    );
  end if;

  if array_length(parts, 1) is null then
    return jsonb_build_object('rows', '[]'::jsonb, 'total', 0);
  end if;

  sql := '(' || array_to_string(parts, ') union all (') || ')';
  sql := format('select * from (%s) all_users', sql);

  if v_search is not null then
    sql := sql || format(' where (name ilike %L or email ilike %L or phone ilike %L)',
                         '%'||v_search||'%', '%'||v_search||'%', '%'||v_search||'%');
  end if;

  execute format('select count(*) from (%s) c', sql) into v_total;

  execute format($q$
    select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    from (%s order by created_at desc nulls last limit %s offset %s) t
  $q$, sql, v_limit, v_offset) into rows;

  return jsonb_build_object('rows', coalesce(rows, '[]'::jsonb), 'total', v_total);
exception when others then
  return jsonb_build_object('rows', '[]'::jsonb, 'total', 0, 'error', SQLERRM);
end; $$;

-- ── Grants: service_role only (the web API key) ─────────────────────────────
do $$
declare fn text;
begin
  foreach fn in array array[
    'public.admin_overview()',
    'public.admin_earnings_series(text)',
    'public.admin_delivery_funnel()',
    'public.admin_hotzones(text)',
    'public.admin_leaderboards()',
    'public.admin_recent_activity()',
    'public.admin_users(text, text, int, int)'
  ] loop
    execute format('revoke all on function %s from public, anon, authenticated', fn);
    execute format('grant execute on function %s to service_role', fn);
  end loop;
end $$;
