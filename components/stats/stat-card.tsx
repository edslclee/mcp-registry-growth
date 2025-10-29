import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  valueColor?: string
  compact?: boolean
}

export function StatCard({ title, value, subtitle, valueColor = "text-blue-400", compact = false }: StatCardProps) {
  return (
    <Card className={`bg-slate-900/50 border-slate-700 ${compact ? 'p-3' : 'p-6'}`}>
      <div className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-slate-400`}>{title}</div>
      <div className={`${compact ? 'text-xl' : 'text-3xl'} font-bold ${valueColor} ${compact ? 'mt-1' : 'mt-2'}`}>{value}</div>
      <p className={`text-xs text-slate-500 ${compact ? 'mt-0.5' : 'mt-1'}`}>{subtitle}</p>
    </Card>
  )
}
