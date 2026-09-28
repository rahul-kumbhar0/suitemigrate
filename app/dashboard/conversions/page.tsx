"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Chrome, ArrowRight, Download, FileCode, Clock, Award } from "lucide-react"
import ConversionDetailModal from "@/components/dashboard/conversion-detail-modal"
import { createClient } from "@/lib/supabase/client"

interface Conversion {
  id: string
  script_name: string
  original_version: string
  script_type: string
  original_code: string
  converted_code: string
  confidence_score: number
  changes_log: string[]
  manual_review_lines: number[]
  created_at: string
}

export default function ConversionsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadConversions() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("conversions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (!error && data) {
        setConversions(data as Conversion[])
      }
      setLoading(false)
    }

    loadConversions()
  }, [])

  const confidenceColor = (score: number) =>
    score >= 90 ? "text-emerald-400" :
    score >= 70 ? "text-amber-400" : "text-red-400"

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (conversions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Conversion History</h1>
            <p className="text-slate-400 text-sm mt-1">
              All your converted scripts — download anytime.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
              <History className="h-8 w-8 text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No conversions yet</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Your converted scripts will appear here once you start using the Chrome extension
              to migrate scripts from your NetSuite account.
            </p>
            <a href="#">
              <Button variant="gradient" className="gap-2">
                <Chrome className="h-4 w-4" />
                Install Extension
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Conversion History</h1>
            <p className="text-slate-400 text-sm mt-1">
              {conversions.length} script{conversions.length === 1 ? '' : 's'} converted
            </p>
          </div>
        </div>

        {/* Conversions grid */}
        <div className="grid gap-4">
          {conversions.map((conversion) => (
            <Card 
              key={conversion.id}
              className="hover:border-emerald-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedConversion(conversion)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Script info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCode className="h-4 w-4 text-emerald-400 shrink-0" />
                      <h3 className="text-base font-semibold text-white truncate">
                        {conversion.script_name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>SS {conversion.original_version} → 2.1</span>
                      <span>·</span>
                      <span>{conversion.script_type}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(conversion.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${confidenceColor(conversion.confidence_score)}`}>
                        {conversion.confidence_score}%
                      </div>
                      <div className="text-xs text-slate-500">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {conversion.changes_log.length}
                      </div>
                      <div className="text-xs text-slate-500">Changes</div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Manual review indicator */}
                {conversion.manual_review_lines.length > 0 && (
                  <div className="mt-4 p-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400">
                    ⚠️ {conversion.manual_review_lines.length} line{conversion.manual_review_lines.length === 1 ? '' : 's'} need manual review
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selectedConversion && (
        <ConversionDetailModal
          conversion={selectedConversion}
          onClose={() => setSelectedConversion(null)}
        />
      )}
    </>
  )
}
