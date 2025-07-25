const Button = ({className, style = "action", children, ...props}) => {
  const styles = {
    action: "bg-action p-2 rounded-lg text-2xl duration-300 text-white hover:bg-primary"
  }
  return <button className={`${styles[style]} ${className}`} {...props}>{children}</button>
}

export default Button