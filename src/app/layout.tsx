import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "habits.sh",
  description: "Rastreador de hábitos para desenvolvedores com estética de terminal",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${jetbrainsMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-zinc-950 font-mono text-green-400">
        {children}
      </body>
    </html>
  )
}
