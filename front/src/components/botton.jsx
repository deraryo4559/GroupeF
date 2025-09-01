const Botton2 = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-80 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md 
      transition-colors duration-150 font-medium focus:outline-none focus:ring-2 
      focus:ring-amber-500 focus:ring-offset-1"
    >
      {children}
    </button>
  );
};

export default Botton2;