"use client";

import React, { useEffect, useState } from "react";
import {
  fetchUsersApi,
  fetchUserStatsApi,
  updateUserRoleApi,
  deleteUserApi,
  fetchAuthMeApi,
} from "@/lib/api";
import { IUser } from "@/types";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Crown,
  UserMinus,
  Mail,
  Calendar,
  MapPin,
  X,
} from "lucide-react";
import {
  AdminHeader,
  AdminStatCard,
  AdminBadge,
  AdminTableContainer,
  AdminEmptyState,
  AdminConfirmDialog,
} from "@/components/admin/AdminComponents";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [stats, setStats] = useState<{ totalUsers: number; totalAdmins: number; totalCustomers: number } | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");

  // Action status state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "promote" | "demote" | "delete";
    user: IUser | null;
  }>({
    isOpen: false,
    type: "promote",
    user: null,
  });

  const loadData = async () => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const [usersRes, statsRes, meRes] = await Promise.all([
        fetchUsersApi({ limit: 100 }),
        fetchUserStatsApi(),
        fetchAuthMeApi(),
      ]);
      setUsers(usersRes.users);
      setStats(statsRes);
      if (meRes) setCurrentUser(meRes);
    } catch (err) {
      console.error("Failed to load users:", err);
      setFeedbackMessage({ type: "error", text: "Failed to load users list." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [usersRes, statsRes, meRes] = await Promise.all([
          fetchUsersApi({ limit: 100 }),
          fetchUserStatsApi(),
          fetchAuthMeApi(),
        ]);
        if (!active) return;
        setUsers(usersRes.users);
        setStats(statsRes);
        if (meRes) setCurrentUser(meRes);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load users:", err);
        setFeedbackMessage({ type: "error", text: "Failed to load users list." });
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleRoleToggle = async (user: IUser, targetRole: "admin" | "customer") => {
    if (!user._id) return;
    setActionLoadingId(user._id);
    setFeedbackMessage(null);

    const res = await updateUserRoleApi(user._id, targetRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: targetRole } : u))
      );
      setFeedbackMessage({
        type: "success",
        text: `Successfully ${targetRole === "admin" ? "promoted" : "demoted"} ${user.email} to ${targetRole}.`,
      });
      fetchUserStatsApi().then((s) => s && setStats(s));
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.message || "Failed to update user role.",
      });
    }
    setActionLoadingId(null);
    setConfirmModal({ isOpen: false, type: "promote", user: null });
  };

  const handleDeleteUser = async (user: IUser) => {
    if (!user._id) return;
    setActionLoadingId(user._id);
    setFeedbackMessage(null);

    const res = await deleteUserApi(user._id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setFeedbackMessage({
        type: "success",
        text: `User ${user.email} removed successfully.`,
      });
      fetchUserStatsApi().then((s) => s && setStats(s));
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.message || "Failed to delete user.",
      });
    }
    setActionLoadingId(null);
    setConfirmModal({ isOpen: false, type: "delete", user: null });
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || (u.role || "customer") === roleFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query));

    return matchesRole && matchesSearch;
  });

  const totalRegisteredCount = stats?.totalUsers ?? users.length;
  const adminCount = stats?.totalAdmins ?? users.filter((u) => u.role === "admin").length;
  const customerCount = stats?.totalCustomers ?? users.filter((u) => u.role !== "admin").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users & Roles" },
        ]}
        title="Users & Role Management"
        description="View registered platform accounts, grant administrator privileges, manage security roles, and monitor user activity."
        actions={
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin text-[#0071e3]" : ""}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl flex items-center justify-between border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
              : "bg-red-50/80 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          title="Total Registered"
          value={totalRegisteredCount}
          subtitle="All platform user accounts"
          icon={Users}
          iconColor="blue"
        />
        <AdminStatCard
          title="Administrators"
          value={adminCount}
          subtitle="Full management & console permissions"
          icon={ShieldCheck}
          iconColor="purple"
        />
        <AdminStatCard
          title="Customers"
          value={customerCount}
          subtitle="Standard store shoppers & buyers"
          icon={User}
          iconColor="slate"
        />
      </div>

      {/* Controls Bar: Segmented Tabs & Search */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Role Segmented Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Users", count: totalRegisteredCount },
            { id: "admin", label: "Administrators", count: adminCount },
            { id: "customer", label: "Customers", count: customerCount },
          ].map((tab) => {
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id as "all" | "admin" | "customer")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white font-bold" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Users Data Table */}
      <AdminTableContainer>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <AdminEmptyState
            icon={Users}
            title={searchQuery ? "No matching accounts found" : "No users registered yet"}
            description={
              searchQuery
                ? `No accounts matched "${searchQuery}". Clear your search query or switch role filter tabs.`
                : "Customer registrations will appear here once users sign up on the storefront."
            }
            action={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Clear search
                </button>
              ) : undefined
            }
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">User &amp; Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Joined Date</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Addresses</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Actions &amp; Privileges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredUsers.map((user) => {
                const isAdmin = user.role === "admin";
                const isCurrentSessionUser =
                  currentUser?._id === user._id || currentUser?.email === user.email;
                const isActionLoading = actionLoadingId === user._id;

                return (
                  <tr key={user._id || user.email} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Identity Column */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                            isAdmin
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-[#0071e3] border-blue-200"
                          }`}
                        >
                          {user.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 truncate">
                              {user.name || user.email.split("@")[0]}
                            </span>
                            {isCurrentSessionUser && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#0071e3] text-xs font-bold uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5 max-w-[240px] sm:max-w-xs truncate">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isAdmin ? (
                        <AdminBadge variant="secondary" icon={ShieldCheck}>
                          Administrator
                        </AdminBadge>
                      ) : (
                        <AdminBadge variant="neutral" icon={User}>
                          Customer
                        </AdminBadge>
                      )}
                    </td>

                    {/* Registration Date Column */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-AU", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </td>

                    {/* Saved Addresses Column */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.addresses?.length || 0} saved</span>
                      </div>
                    </td>

                    {/* Role Control & Actions Column */}
                    <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {isAdmin ? (
                          <button
                            type="button"
                            disabled={isCurrentSessionUser || isActionLoading}
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: "demote",
                                user,
                              })
                            }
                            title={
                              isCurrentSessionUser
                                ? "You cannot demote your own account"
                                : "Revoke administrator privileges"
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                              isCurrentSessionUser
                                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white hover:bg-amber-50 text-amber-700 border-amber-200 cursor-pointer"
                            }`}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Revoke Admin</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: "promote",
                                user,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>Make Admin</span>
                          </button>
                        )}

                        {/* Delete User */}
                        <button
                          type="button"
                          disabled={isCurrentSessionUser || isActionLoading}
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: "delete",
                              user,
                            })
                          }
                          title={
                            isCurrentSessionUser
                              ? "You cannot delete your own account"
                              : "Permanently delete user"
                          }
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isCurrentSessionUser
                              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 cursor-pointer"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </AdminTableContainer>

      {/* Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: "promote", user: null })}
        onConfirm={() => {
          if (!confirmModal.user) return;
          if (confirmModal.type === "promote") {
            handleRoleToggle(confirmModal.user, "admin");
          } else if (confirmModal.type === "demote") {
            handleRoleToggle(confirmModal.user, "customer");
          } else {
            handleDeleteUser(confirmModal.user);
          }
        }}
        title={
          confirmModal.type === "promote"
            ? "Grant Administrator Privileges?"
            : confirmModal.type === "demote"
            ? "Revoke Administrator Role?"
            : "Permanently Delete Account?"
        }
        description={
          confirmModal.user ? (
            confirmModal.type === "promote" ? (
              <>
                Promote <span className="font-semibold text-slate-900">{confirmModal.user.email}</span> to Administrator? This grants full access to manage products, categories, orders, and system settings.
              </>
            ) : confirmModal.type === "demote" ? (
              <>
                Demote <span className="font-semibold text-slate-900">{confirmModal.user.email}</span> to Customer? They will immediately lose access to the D1 Store Admin Console.
              </>
            ) : (
              <>
                Are you sure you want to delete <span className="font-semibold text-slate-900">{confirmModal.user.email}</span>? This action cannot be reversed.
              </>
            )
          ) : null
        }
        confirmLabel={
          confirmModal.type === "promote"
            ? "Grant Admin Role"
            : confirmModal.type === "demote"
            ? "Revoke Admin Role"
            : "Delete User"
        }
        confirmVariant={
          confirmModal.type === "delete"
            ? "danger"
            : confirmModal.type === "demote"
            ? "warning"
            : "primary"
        }
        icon={
          confirmModal.type === "promote"
            ? Crown
            : confirmModal.type === "demote"
            ? ShieldAlert
            : Trash2
        }
      />
    </div>
  );
}
