import logo from "@/assets/inua360-logo.png";

const Header = () => {
  return (
    <header className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={logo} alt="Inua360 Logo" className="h-16 w-16 sm:h-20 sm:w-20" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Inua360
          </h1>
        </div>
        <p className="text-xl sm:text-2xl font-semibold text-primary mb-2">
          Smart Business Agent
        </p>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering SMEs with intelligent tools for growth
        </p>
      </div>
    </header>
  );
};

export default Header;
