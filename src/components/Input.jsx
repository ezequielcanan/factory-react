import React from "react"

const Input = React.forwardRef(({containerClassName, className, children, register, textarea=false, ...props}, ref) => {
  return (
    <div className={`border-white border-2 overflow-hidden rounded-lg text-xl flex gap-x-2 items-center justify-bewteen text-white ${containerClassName}`}>
      {!textarea ? <input className={`bg-transparent focus:outline-none p-2 px-4 duration-300 focus:bg-white/10 ${className}`} ref={ref} {...register} {...props} /> : <textarea className={`bg-transparent focus:outline-none p-2 px-4 duration-300 focus:bg-white/10 ${className}`} {...register} {...props} />}
      {children}
    </div>
  )
})

export default Input