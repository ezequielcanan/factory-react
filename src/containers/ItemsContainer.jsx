const ItemsContainer = ({children, className}) => {
  return (
    <section className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 bg-third rounded-xl p-8 ${className}`}>
      {children}
    </section>
  )
}

export default ItemsContainer