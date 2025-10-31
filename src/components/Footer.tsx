const Footer = () => {
  return (
    <footer className="w-full mt-10 border-t border-border/50 bg-background relative z-50">
      {/* Kenyan flag stripe */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      {/* Footer content */}
      <div className="w-full py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-2">
          <div className="text-xl">🇰🇪</div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Inua360</span> · Empowering Kenyan SMEs with AI
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            &copy; {new Date().getFullYear()} Inua360. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
