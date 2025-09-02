import { useNavigate } from 'react-router-dom'

function Button1({ 
  children, 
  className = "", 
  navigateTo,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button"
}) {
  const navigate = useNavigate()

  // カラーバリエーション
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
  }

  // サイズ
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  }

  const handleClick = () => {
    if (disabled) return
    
    if (onClick) {
      onClick()
    } else if (navigateTo) {
      navigate(navigateTo)
    }
  }

  const baseClasses = "font-medium rounded-lg transition-colors duration-200 focus:outline-none"
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.medium
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  return (
    <button 
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
    >
      {children || "ボタン"}
    </button>
  )
}

export default Button1
