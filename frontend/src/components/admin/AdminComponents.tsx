"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                               ADMIN HEADER                                 */
/* -------------------------------------------------------------------------- */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function AdminHeader({
  breadcrumbs,
  title,
  description,
  actions,
  badge,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1 border-b border-slate-200/70">
      <div className="space-y-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-slate-900 transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-700 font-semibold truncate">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ADMIN STAT CARD                               */
/* -------------------------------------------------------------------------- */

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: "blue" | "purple" | "emerald" | "amber" | "slate" | "indigo";
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  href?: string;
}

const iconColorMap = {
  blue: "bg-blue-50 text-[#0071e3] border-blue-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "blue",
  trend,
  onClick,
  href,
}: AdminStatCardProps) {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition-all",
        href || onClick ? "hover:border-slate-300 hover:shadow-md cursor-pointer group" : ""
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
          {title}
        </span>
        <div
          className={cn(
            "w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            iconColorMap[iconColor]
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              trend.isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium truncate">
          {subtitle}
        </p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}

/* -------------------------------------------------------------------------- */
/*                               ADMIN BADGES                                 */
/* -------------------------------------------------------------------------- */

export type AdminBadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: AdminBadgeVariant;
  icon?: LucideIcon;
  className?: string;
}

const badgeVariants: Record<AdminBadgeVariant, string> = {
  primary: "bg-blue-50 text-[#0071e3] border-blue-200/60",
  secondary: "bg-purple-50 text-purple-700 border-purple-200/60",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  warning: "bg-amber-50 text-amber-700 border-amber-200/60",
  danger: "bg-red-50 text-red-700 border-red-200/60",
  info: "bg-sky-50 text-sky-700 border-sky-200/60",
  neutral: "bg-slate-100 text-slate-700 border-slate-200/70",
};

export function AdminBadge({
  children,
  variant = "neutral",
  icon: Icon,
  className,
}: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        badgeVariants[variant],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                           ADMIN TABLE CONTAINER                            */
/* -------------------------------------------------------------------------- */

interface AdminTableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminTableContainer({ children, className }: AdminTableContainerProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(16,24,40,0.04)] overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto min-w-full divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ADMIN EMPTY STATE                             */
/* -------------------------------------------------------------------------- */

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3.5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             ADMIN CONFIRM DIALOG                           */
/* -------------------------------------------------------------------------- */

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
  icon?: LucideIcon;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  isLoading = false,
  icon: Icon,
}: AdminConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        {Icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4",
              confirmVariant === "danger"
                ? "bg-red-50 text-red-600"
                : confirmVariant === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-[#0071e3]"
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
        <h3 className="text-base font-bold text-slate-900 text-center">{title}</h3>
        <div className="text-xs sm:text-sm text-slate-500 text-center mt-2 leading-relaxed">
          {description}
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50",
              confirmVariant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : confirmVariant === "warning"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-[#0071e3] hover:bg-[#0058b8]"
            )}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
