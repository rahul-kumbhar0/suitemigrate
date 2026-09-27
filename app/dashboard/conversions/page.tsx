import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Chrome, ArrowRight, Download } from "lucide-react"

export default function ConversionsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Conversion History</h1>
          <p className="text-slate-400 text-sm mt-1">
            All your converted scripts — download anytime.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" disabled>
          <Download className="h-4 w-4" />
          Export All
        </Button>
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
