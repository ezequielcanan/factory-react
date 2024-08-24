const Main = ({children, className}) => {
  return (
    <main className={`p-4 min-h-screen px-8 pt-[150px] pb-[50px] bg-fourth ${className}`}>
      {children}
    </main>
  )
}

export default Main