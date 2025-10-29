"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-lg font-semibold text-gray-100">
              MCP Registry Analytics
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/" ? "text-primary" : "text-gray-400"
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/about" ? "text-primary" : "text-gray-400"
                )}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
