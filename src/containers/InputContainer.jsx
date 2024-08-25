const InputContainer = ({children, className, ...props}) => {
  return (
    <div className={`flex gap-4 items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  )
}

export default InputContainer