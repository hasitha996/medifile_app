const Input = ({ value, onChange, placeholder, type = "text", label, name, required = false, className = "" }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
        placeholder-gray-400 transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        hover:border-gray-400 ${className}`}
    />
  </div>
);

export default Input;

