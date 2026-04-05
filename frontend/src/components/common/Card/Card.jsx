const Card = ({ children, title, className = "", noPad = false }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${noPad ? "" : "p-5"} ${className}`}>
    {title && (
      <h3 className="text-base font-semibold text-gray-800 mb-3 pb-3 border-b border-gray-100">{title}</h3>
    )}
    {children}
  </div>
);

export default Card;

