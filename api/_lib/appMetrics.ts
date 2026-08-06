import type { SupabaseClient } from "@supabase/supabase-js";

export interface AvailableResult<T> {
  available: true;
  data: T;
}

export interface UnavailableResult {
  available: false;
  error?: string;
}

export type MetricResult<T> = AvailableResult<T> | UnavailableResult;

/**
 * Call a Supabase RPC function, returning {available, data} on success or
 * {available: false, error} on any error. The dashboard degrades gracefully:
 * a missing RPC (not yet applied from admin-dashboard-setup.sql) shows a
 * "connect this panel" state instead of crashing the page.
 */
export async function callRpc<T>(
  supabase: SupabaseClient,
  rpcName: string,
  args?: Record<string, unknown>,
): Promise<MetricResult<T>> {
  try {
    const { data, error } = await supabase.rpc(rpcName, args ?? {});

    if (error) {
      console.warn(`RPC ${rpcName} error:`, error);
      return { available: false, error: error.message };
    }

    return { available: true, data: data as T };
  } catch (err) {
    console.warn(`RPC ${rpcName} failed:`, err);
    return {
      available: false,
      error: err instanceof Error ? err.message : "Call failed",
    };
  }
}
