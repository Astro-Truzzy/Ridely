import { useCallback, useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { fetchWalletBalances, type WalletHolder } from "../../../Lib/admin";
import Section from "./Section";
import { PanelUnavailable } from "./PanelState";
import { formatNaira } from "../format";

const PAGE_SIZE = 10;

/**
 * Customer wallet balances, ordered by balance descending. Self-fetches (like
 * the Users table) so the Finance panel stays lean. Riders have no wallet, so
 * this is customers only.
 */
export default function WalletBalances({
  onAuthError,
}: {
  onAuthError: () => void;
}) {
  const [rows, setRows] = useState<WalletHolder[]>([]);
  const [total, setTotal] = useState(0);
  const [sum, setSum] = useState(0);
  const [available, setAvailable] = useState(true);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(0), [debounced]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWalletBalances({
        search: debounced,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setRows(res.rows);
      setTotal(res.total);
      setSum(res.sum);
      setAvailable(res.available);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") onAuthError();
    } finally {
      setLoading(false);
    }
  }, [debounced, page, onAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  const maxPage = Math.max(Math.ceil(total / PAGE_SIZE) - 1, 0);

  return (
    <Section
      title="Customer wallets"
      subtitle={
        available
          ? `${total} wallet${total === 1 ? "" : "s"} · ${formatNaira(
              sum,
            )} total float`
          : "Wallet balances by customer"
      }
      icon={<Wallet className="w-5 h-5" />}
      actions={
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a1a2e] border border-white/[0.08] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff] w-full sm:w-56"
        />
      }
    >
      {!available ? (
        <PanelUnavailable label="Wallet balances aren’t connected yet." />
      ) : (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#a0a0b0] text-left">
                    <th className="px-4 py-3 font-medium w-10">#</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#a0a0b0]">
                        Loading…
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#a0a0b0]">
                        No wallets found
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr
                        key={r.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-[#a0a0b0]">
                          {page * PAGE_SIZE + i + 1}
                        </td>
                        <td className="px-4 py-3 text-white">{r.name}</td>
                        <td className="px-4 py-3 text-[#a0a0b0]">
                          <div className="truncate max-w-[240px]">{r.email}</div>
                        </td>
                        <td className="px-4 py-3 text-right text-white font-medium">
                          {formatNaira(r.wallet_balance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {maxPage > 0 && (
            <div className="flex items-center justify-between mt-3">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="px-3 py-1.5 rounded-lg text-sm text-[#a0a0b0] hover:text-white disabled:opacity-40 bg-white/[0.03] hover:bg-white/[0.06]"
              >
                Previous
              </button>
              <span className="text-xs text-[#a0a0b0]">
                Page {page + 1} of {maxPage + 1}
              </span>
              <button
                disabled={page >= maxPage}
                onClick={() => setPage((p) => Math.min(p + 1, maxPage))}
                className="px-3 py-1.5 rounded-lg text-sm text-[#a0a0b0] hover:text-white disabled:opacity-40 bg-white/[0.03] hover:bg-white/[0.06]"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
