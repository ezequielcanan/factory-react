const Screen = ({children, className}) => {
  return <div className={"absolute top-0 left-0 w-full h-full bg-[#000]/70 flex justify-center items-center px-8 "+className}>{children}</div>
}

export default Screen