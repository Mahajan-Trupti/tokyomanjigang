const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-slate-900"></div>

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Floating light orbs */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-40 right-1/3 w-40 h-40 bg-secondary/8 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/6 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Scanning lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/25 to-transparent
                        animate-pulse"
          style={{ top: "30%", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-secondary/15 to-transparent
                        animate-pulse"
          style={{ top: "70%", animationDuration: "4s", animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default Background;
