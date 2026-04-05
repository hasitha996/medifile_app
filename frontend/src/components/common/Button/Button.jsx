const variants = {
  primary:   "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
  danger:    "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  ghost:     "bg-transparent hover:bg-indigo-50 text-indigo-600",
  success:   "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

const Button = ({ children, onClick, type = "button", variant = "primary", size = "md", disabled = false, className = "", fullWidth = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={[
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer",
      variants[variant] || variants.primary,
      sizes[size] || sizes.md,
      disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      fullWidth ? "w-full" : "",
      className,
    ].join(" ")}
  >
    {children}
  </button>
);

export default Button;

