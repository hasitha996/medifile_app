const Footer = () => (
  <footer className="bg-white border-t border-gray-100 py-4 px-6">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
      <span>© {new Date().getFullYear()} MediFile. Secure Medical File Portal.</span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
        All systems operational
      </span>
    </div>
  </footer>
);

export default Footer;

