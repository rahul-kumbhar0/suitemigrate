import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SuiteMigrate — SuiteScript 2.1 Migration Tool",
  description:
    "Scan your NetSuite account and automatically convert SuiteScript 1.0/2.0 scripts to SuiteScript 2.1 before the 2028 deadline.",
  keywords: ["NetSuite", "SuiteScript", "SuiteScript 2.1", "migration", "Chrome extension", "NetSuite developer"],
  openGraph: {
    title: "SuiteMigrate — SuiteScript 2.1 Migration Tool",
    description: "Automatically convert your NetSuite scripts to SuiteScript 2.1 before the 2028 deadline.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  )
}
