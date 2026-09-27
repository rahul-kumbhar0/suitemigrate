import { Sparkles } from "lucide-react"
import { useStore } from "../../lib/store"

export default function ConvertingView() {
  const { selectedScript } = useStore()

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center gap-5">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#050d1a] flex items-center justify-center">
          <div className="spinner !h-4 !w-4" />
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-white mb-1">Converting Script</h2>
        {selectedScript && (
          <p className="text-xs text-emerald-400 font-medium mb-2 truncate max-w-[280px]">
            {selectedScript.name}
          </p>
        )}
        <p className="text-xs text-slate-400 leading-relaxed max-w-[250px]">
          Gemini AI is analyzing and converting your script to SuiteScript 2.1...
        </p>
      </div>

      <div className="w-full max-w-[240px] space-y-2">
        {["Analyzing script structure", "Mapping deprecated APIs", "Applying 2.1 patterns", "Calculating confidence score"].map(
          (step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold
                ${i === 0 ? "bg-emerald-500 text-white" : "bg-[#1e3a5f] text-slate-500"}`}>
                {i === 0 ? "✓" : i + 1}
              </div>
              <span className={`text-[11px] ${i === 0 ? "text-emerald-400" : "text-slate-600"}`}>{step}</span>
            </div>
          )
        )}
      </div>

      <p className="text-[10px] text-slate-600">Usually takes 5–15 seconds</p>
    </div>
  )
}
