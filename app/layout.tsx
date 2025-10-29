import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation/nav"
import { loadSnapshots } from "@/lib/data-loader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCP Registry Analytics",
  description: "Track the growth and distribution of Model Context Protocol servers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const timeSeries = loadSnapshots()
  const lastUpdated = timeSeries.snapshots.length > 0
    ? new Date(timeSeries.snapshots[timeSeries.snapshots.length - 1].date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : undefined

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation lastUpdated={lastUpdated} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
