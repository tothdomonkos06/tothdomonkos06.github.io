export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant py-md mt-auto relative z-10 bg-surface-container-lowest/50 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-margin md:px-gutter flex flex-col md:flex-row justify-between items-center gap-sm">
        <div className="font-code-md text-[12px] text-on-surface-variant">
          &copy; {new Date().getFullYear()} Tóth Domonkos. All rights reserved.
        </div>
        <div className="font-code-md text-[12px] text-on-surface-variant flex gap-sm">
          <span>Budapest, HU</span>
          <span className="text-outline-variant">|</span>
          <span className="text-primary flex items-center gap-[4px]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" /> 
            System Online
          </span>
        </div>
      </div>
    </footer>
  );
}
