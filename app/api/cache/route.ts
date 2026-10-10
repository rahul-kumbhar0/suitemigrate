import { NextResponse } from "next/server"
import { conversionCache } from "@/lib/conversion-engine/engine"
import { getCorsHeaders, corsOptions } from "@/lib/cors"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptions(request)
}

/**
 * GET /api/cache - Get cache statistics
 */
export async function GET(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)
  
  try {
    const size = conversionCache.size()
    
    return NextResponse.json({
      size,
      message: `Conversion cache contains ${size} entries`
    }, { headers })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get cache stats" },
      { status: 500, headers }
    )
  }
}

/**
 * DELETE /api/cache - Clear the conversion cache
 */
export async function DELETE(request: Request) {
  const origin = request.headers.get("origin")
  const headers = getCorsHeaders(origin)
  
  try {
    conversionCache.clear()
    
    return NextResponse.json({
      success: true,
      message: "Conversion cache cleared"
    }, { headers })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500, headers }
    )
  }
}
