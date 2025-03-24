import type React from "react"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { Providers } from "@/providers/providers"
import { ThemeProvider } from "@/providers/theme-provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const theme = cookieStore.get("theme")?.value || "light"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider defaultTheme={theme as "light" | "dark" | "system"}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
