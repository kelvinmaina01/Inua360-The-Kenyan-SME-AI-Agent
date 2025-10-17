const Footer = () => {
  return (
    <footer className="w-full mt-16">
      {/* Kenyan flag colors stripe */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-black"></div>
        <div className="flex-1 bg-red-600"></div>
        <div className="flex-1 bg-emerald-600"></div>
      </div>
      
      <div className="w-full py-6 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-xl">🇰🇪</span>
            <span className="font-semibold text-foreground">Inua360</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Innovation for Kenyan SMEs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
