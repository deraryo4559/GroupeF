import { useNavigate } from 'react-router-dom'

function Button1({ children, className = "", navigateTo = "/page2" }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(navigateTo)
  }

  return (
    <button 
      onClick={handleClick}
      className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium ${className}`}
    >
      {children || "Page2に移動"}
    </button>
  )
}

export default Button1
