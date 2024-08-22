const Input = ({containerClassName, className, children, register, ...props}) => {
  return (
    <div className={`border-white border-2 rounded-lg text-xl flex gap-x-2 items-center justify-bewteen ${containerClassName}`}>
      <input className={`bg-transparent focus:outline-none p-2 px-4 duration-300 focus:bg-white/10 ${className}`} {...register} {...props} />
      {children}
    </div>
  )
}

export default Input