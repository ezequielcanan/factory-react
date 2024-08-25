const Title = ({text, className}) => {
  return (
    <h2 className={`font-bold text-5xl text-white ${className}`}>{text}</h2>
  )
}

export default Title