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
  UserPlus,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react";

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
    loadData();
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
      // Refresh stats
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">User & Role Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View registered customer accounts, grant or revoke administrator roles, and control system access.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#0071e3]" : ""}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Registered</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0071e3] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {stats?.totalUsers ?? users.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Total active platform accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Administrators</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {stats?.totalAdmins ?? users.filter((u) => u.role === "admin").length}
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Full console & catalog permissions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customers</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {stats?.totalCustomers ?? users.filter((u) => u.role !== "admin").length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Standard buyers & shoppers</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Users", count: users.length },
            { id: "admin", label: "Administrators", count: users.filter((u) => u.role === "admin").length },
            { id: "customer", label: "Customers", count: users.filter((u) => u.role !== "admin").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                roleFilter === tab.id
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  roleFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:bg-white focus:border-[#0071e3] transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Loading users list...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-800">No users found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">User / Contact</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Joined Date</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Saved Addresses</th>
                  <th className="py-3.5 px-5 text-right">Actions & Role Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === "admin";
                  const isCurrentSessionUser = currentUser?._id === user._id || currentUser?.email === user.email;
                  const isActionLoading = actionLoadingId === user._id;

                  return (
                    <tr key={user._id || user.email} className="hover:bg-gray-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAdmin
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-[#0071e3] border border-blue-100"
                            }`}
                          >
                            {user.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 truncate">
                                {user.name || user.email.split("@")[0]}
                              </span>
                              {isCurrentSessionUser && (
                                <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-[#0071e3] text-[10px] font-extrabold uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200/80 text-[11px] font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Administrator</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-AU", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recently"}
                          </span>
                        </div>
                      </td>

                      {/* Addresses */}
                      <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.addresses?.length || 0} saved</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
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
                                  : "Revoke Administrator privileges"
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                isCurrentSessionUser
                                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-white hover:bg-amber-50 text-amber-700 border-amber-200 active:scale-95"
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all active:scale-95 shadow-2xs"
                            >
                              <Crown className="w-3.5 h-3.5" />
                              <span>Make Admin</span>
                            </button>
                          )}

                          {/* Delete Account */}
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
                                : "Permanently delete account"
                            }
                            className={`p-1.5 rounded-xl border transition-all ${
                              isCurrentSessionUser
                                ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                                : "bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 active:scale-95"
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
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.user && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gray-100">
              {confirmModal.type === "promote" && <Crown className="w-6 h-6 text-purple-600" />}
              {confirmModal.type === "demote" && <ShieldAlert className="w-6 h-6 text-amber-600" />}
              {confirmModal.type === "delete" && <Trash2 className="w-6 h-6 text-red-600" />}
            </div>

            <h3 className="text-lg font-black text-gray-900 text-center">
              {confirmModal.type === "promote" && "Grant Administrator Role?"}
              {confirmModal.type === "demote" && "Revoke Administrator Role?"}
              {confirmModal.type === "delete" && "Permanently Delete User?"}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 leading-relaxed">
              {confirmModal.type === "promote" && (
                <>
                  Are you sure you want to promote <span className="font-bold text-gray-800">{confirmModal.user.email}</span> to Administrator? They will have full access to manage products, categories, orders, and system settings.
                </>
              )}
              {confirmModal.type === "demote" && (
                <>
                  Are you sure you want to demote <span className="font-bold text-gray-800">{confirmModal.user.email}</span> to a regular Customer? They will lose access to the D1 Store Admin Console immediately.
                </>
              )}
              {confirmModal.type === "delete" && (
                <>
                  Are you sure you want to permanently delete the account for <span className="font-bold text-gray-800">{confirmModal.user.email}</span>? This action cannot be undone.
                </>
              )}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: "promote", user: null })}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmModal.type === "promote") {
                    handleRoleToggle(confirmModal.user!, "admin");
                  } else if (confirmModal.type === "demote") {
                    handleRoleToggle(confirmModal.user!, "customer");
                  } else {
                    handleDeleteUser(confirmModal.user!);
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition-all shadow-md ${
                  confirmModal.type === "promote"
                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                    : confirmModal.type === "demote"
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                }`}
              >
                {confirmModal.type === "promote" && "Confirm Promote"}
                {confirmModal.type === "demote" && "Confirm Revoke"}
                {confirmModal.type === "delete" && "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
