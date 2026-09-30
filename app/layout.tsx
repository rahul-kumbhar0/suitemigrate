import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "SuiteMigrate — SuiteScript 2.1 Migration Tool",
  description: "Scan your NetSuite account, risk-score every script, and convert SuiteScript 1.0/2.0 to 2.1 automatically — with inline comments on every change.",
  keywords: ["NetSuite", "SuiteScript", "SuiteScript 2.1", "migration", "Chrome extension", "NetSuite developer"],
  openGraph: {
    title: "SuiteMigrate — SuiteScript 2.1 Migration Tool",
    description: "Automatically convert your NetSuite scripts to SuiteScript 2.1 before the 2028 deadline.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
