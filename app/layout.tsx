import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation/nav"

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
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
