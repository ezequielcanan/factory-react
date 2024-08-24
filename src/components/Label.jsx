const Label = ({children, className, ...props}) => {
  return (
    <label className={`text-white text-xl ${className}`} {...props}>{children}</label>
  )
}

export default Label