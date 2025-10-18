import logo from "@/assets/inua360-logo.png";

const Header = () => {
  return (
    <header className="relative w-full py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background border-b border-border/60 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Inua360 Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-md"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Inua<span className="text-primary">360</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-lg sm:text-xl font-medium text-primary">
          Smart Business Agent
        </p>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
          Empowering Kenyan SMEs with intelligent tools for growth and opportunity.
        </p>
      </div>
    </header>
  );
};

export default Header;
