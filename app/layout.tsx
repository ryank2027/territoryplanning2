import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cvent Territory Design Workspace',
  description:
    'An interactive workspace for Cvent territory planning and performance monitoring.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#17201c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <TooltipProvider>
          <WorkspaceShell>{children}</WorkspaceShell>
        </TooltipProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
