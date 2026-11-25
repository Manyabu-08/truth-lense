import { AlertTriangle, HelpCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { CredibilityStatus } from '../types/truthlens';

interface StatusIndicatorProps {
  status: CredibilityStatus;
  compact?: boolean;
}

export function getStatusMeta(status: CredibilityStatus) {
  switch (status) {
    case 'reliable':
      return {
        label: 'Verified Signals',
        shortLabel: 'Reliable',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/25',
        surfaceColor: 'bg-emerald-500/8',
        Icon: ShieldCheck,
      };
    case 'caution':
      return {
        label: 'Mixed Signals · Verify',
        shortLabel: 'Caution',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-400/30',
        surfaceColor: 'bg-amber-400/8',
        Icon: AlertTriangle,
      };
    case 'flagged':
      return {
        label: 'Flagged · Check Evidence',
        shortLabel: 'Flagged',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        surfaceColor: 'bg-rose-500/10',
        Icon: ShieldAlert,
      };
    case 'insufficient_evidence':
      return {
        label: 'Insufficient Evidence',
        shortLabel: 'Uncertain',
        textColor: 'text-sky-300',
        borderColor: 'border-sky-400/30',
        surfaceColor: 'bg-sky-400/10',
        Icon: HelpCircle,
      };
  }
}

export function StatusIndicator({ status, compact = false }: StatusIndicatorProps) {
  const meta = getStatusMeta(status);
  const Icon = meta.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-wide ${meta.textColor}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{compact ? meta.shortLabel : meta.label}</span>
    </span>
  );
}
