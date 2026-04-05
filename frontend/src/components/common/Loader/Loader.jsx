const SIZE_CLASSES = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

const Loader = ({ size = "md", label = "Loading..." }) => {
  const ring = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${ring} border-indigo-200 border-t-indigo-600 rounded-full animate-spin`} />
      {label && <p className="text-sm text-gray-400 tracking-wide">{label}</p>}
    </div>
  );
};

export default Loader;

