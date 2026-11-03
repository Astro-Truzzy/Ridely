import { useCallback, useEffect, useState } from "react";
import { Users as UsersIcon, Wallet, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchAppUsers,
  deleteAppUser,
  type AppUser,
  type AppMetrics,
  type WaitlistSignup,
} from "../../../Lib/admin";
import StatCard from "../components/StatCard";
import Section from "../components/Section";
import ConfirmDialog from "../components/ConfirmDialog";
import { PanelUnavailable } from "../components/PanelState";
import { formatDate, formatNaira } from "../format";

const PAGE_SIZE = 25;

function RolePill({ role }: { role: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        role === "rider"
          ? "bg-[#175aff]/20 text-[#4d7dff]"
          : "bg-purple-500/20 text-purple-300"
      }`}
    >
      {role}
    </span>
  );
}

export default function Users({
  metrics,
  signups,
  onAuthError,
}: {
  metrics: AppMetrics | null;
  signups: WaitlistSignup[];
  onAuthError: () => void;
}) {
  const overview = metrics?.overview;
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState(true);
  const [role, setRole] = useState<"" | "customer" | "rider">("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [purgeLedger, setPurgeLedger] = useState(false);
  const [purgeConfirm, setPurgeConfirm] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(0), [role, debounced]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAppUsers({
        role: role || undefined,
        search: debounced,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setUsers(res.rows);
      setTotal(res.total);
      setAvailable(res.available);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") onAuthError();
    } finally {
      setLoading(false);
    }
  }, [role, debounced, page, onAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  const openDelete = useCallback((u: AppUser) => {
    setPendingDelete(u);
    setPurgeLedger(false);
    setPurgeConfirm("");
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await deleteAppUser({
        id: pendingDelete.id,
        role: pendingDelete.role,
        purgeLedger,
      });
      toast.success(
        `${pendingDelete.name || "Account"} deleted${
          purgeLedger ? " (incl. ledger history)" : ""
        }${res.authRemoved ? "" : " (login could not be removed)"}`,
      );
      setPendingDelete(null);
      setPurgeLedger(false);
      setPurgeConfirm("");
      // Drop the row locally, then refresh totals in the background.
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
      setTotal((t) => Math.max(t - 1, 0));
      load();
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        onAuthError();
        return;
      }
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, purgeLedger, load, onAuthError]);

  const maxPage = Math.max(Math.ceil(total / PAGE_SIZE) - 1, 0);

  return (
    <div className="space-y-8">
      <Section
        title="Users"
        subtitle="Everyone on the Ridely platform"
        icon={<UsersIcon className="w-5 h-5" />}
      >
        {overview?.available ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total users" value={overview.data.users.total} />
            <StatCard label="Customers" value={overview.data.users.customers} />
            <StatCard label="Riders" value={overview.data.users.riders} />
            <StatCard
              label="Wallet float"
              value={overview.data.revenue.walletFloat}
              format="naira"
              icon={<Wallet className="w-6 h-6" />}
            />
          </div>
        ) : (
          <PanelUnavailable label="User metrics aren’t connected yet." />
        )}
      </Section>

      {/* App users table */}
      <Section
        title="App accounts"
        subtitle={`${total} account${total === 1 ? "" : "s"} with wallet balances`}
        actions={
          <div className="flex gap-2">
            <input
              type="search"
              placeholder="Search name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1a1a2e] border border-white/[0.08] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff] w-full sm:w-56"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "" | "customer" | "rider")}
              className="bg-[#1a1a2e] border border-white/[0.08] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff]"
            >
              <option value="">All roles</option>
              <option value="customer">Customers</option>
              <option value="rider">Riders</option>
            </select>
          </div>
        }
      >
        {!available ? (
          <PanelUnavailable label="App accounts aren’t connected yet." />
        ) : (
          <>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[#a0a0b0] text-left">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium text-right">Wallet</th>
                      <th className="px-4 py-3 font-medium">Joined</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#a0a0b0]">
                          Loading…
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#a0a0b0]">
                          No accounts found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={`${u.role}-${u.id}`}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3 text-white">{u.name}</td>
                          <td className="px-4 py-3 text-[#a0a0b0]">
                            <div className="truncate max-w-[220px]">{u.email}</div>
                            {u.phone && (
                              <div className="text-xs text-[#a0a0b0]/70">{u.phone}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <RolePill role={u.role} />
                          </td>
                          <td className="px-4 py-3 text-right text-white font-medium">
                            {u.role === "customer" ? formatNaira(u.wallet_balance) : "—"}
                          </td>
                          <td className="px-4 py-3 text-[#a0a0b0] whitespace-nowrap">
                            {u.created_at ? formatDate(u.created_at) : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => openDelete(u)}
                              title={`Delete ${u.name}`}
                              aria-label={`Delete ${u.name}`}
                              className="inline-flex items-center justify-center p-1.5 rounded-lg text-[#a0a0b0] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {/* Waitlist signups (pre-launch) */}
      <Section
        title="Waitlist signups"
        subtitle={`${signups.length} shown · marketing-site waitlist`}
      >
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#a0a0b0] text-left">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {signups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#a0a0b0]">
                      No signups yet
                    </td>
                  </tr>
                ) : (
                  signups.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 text-white">{s.name}</td>
                      <td className="px-4 py-3 text-[#a0a0b0]">{s.email}</td>
                      <td className="px-4 py-3">
                        <RolePill role={s.role} />
                      </td>
                      <td className="px-4 py-3 text-[#a0a0b0]">{s.city}</td>
                      <td className="px-4 py-3 text-[#a0a0b0] whitespace-nowrap">
                        {formatDate(s.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete ${pendingDelete?.role ?? "user"}?`}
        message={
          <>
            <span className="text-white">{pendingDelete?.name}</span>
            {pendingDelete?.email ? ` (${pendingDelete.email})` : ""} will be
            permanently removed — profile
            {pendingDelete?.role === "customer" ? ", wallet" : ""} and login
            access. Money history (ledger) is kept unless you opt in below;
            without the opt-in the delete is refused while ledger rows exist.
            This cannot be undone.
          </>
        }
        loading={deleting}
        purgeOption={{
          label:
            "Also delete ledger history. Destroys this account's money trail permanently. Type PURGE below to arm, then tick this box.",
          checked: purgeLedger,
          onChange: setPurgeLedger,
          purgeConfirmText: {
            expected: "PURGE",
            value: purgeConfirm,
            onChange: setPurgeConfirm,
          },
        }}
        onConfirm={confirmDelete}
        onCancel={() => {
          setPendingDelete(null);
          setPurgeLedger(false);
          setPurgeConfirm("");
        }}
      />
    </div>
  );
}
