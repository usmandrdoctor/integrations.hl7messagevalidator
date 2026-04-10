export function Header() {
  return (
    <header className="bg-brand-primary shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
        {/* DrDoctor wordmark */}
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-xl tracking-tight select-none text-white">
            DrDoctor
          </span>
        </div>

        <div className="h-6 w-px bg-white/40" />

        <div>
          <h1 className="font-heading text-white font-semibold text-lg leading-tight">
            HL7 Validator
          </h1>
          <p className="text-white/80 text-xs font-body">ADT · SIU · ORU · MFN · REF</p>
        </div>
      </div>
    </header>
  )
}
