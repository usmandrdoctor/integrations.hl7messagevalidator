import drDoctorLogo from '../../assets/drdoctor-logo.svg'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        {/* DrDoctor logo */}
        <img
          src={drDoctorLogo}
          alt="DrDoctor"
          className="h-9 w-auto select-none"
        />

        <div className="h-7 w-px bg-gray-300" />

        <div>
          <h1 className="font-heading text-brand-primaryDark font-semibold text-lg leading-tight">
            HL7 Validator
          </h1>
          <p className="text-gray-400 text-xs font-body">ADT · SIU · ORU · MFN · REF</p>
        </div>
      </div>
    </header>
  )
}
