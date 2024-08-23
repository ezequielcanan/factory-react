const Main = ({children, className}) => {
  return (
    <main className={`p-4 min-h-screen bg-fourth ${className}`}>
      {children}
    </main>
  )
}

export default Main