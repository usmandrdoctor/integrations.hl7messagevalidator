interface PageShellProps {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {children}
    </div>
  )
}
