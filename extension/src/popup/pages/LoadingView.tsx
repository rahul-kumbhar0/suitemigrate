import { Zap } from "lucide-react"

export default function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
        <Zap className="h-6 w-6 text-white" />
      </div>
      <div className="spinner" />
      <p className="text-xs text-slate-500">Loading SuiteMigrate...</p>
    </div>
  )
}
