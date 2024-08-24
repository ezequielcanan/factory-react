const Article = ({article}) => {
  return (
    <div className="flex flex-col text-white rounded-lg bg-secondary justify-items-center overflow-hidden">
      <img src={`${import.meta.env.VITE_REACT_API_URL}/files/articles/${article?._id}/thumbnail.${"png" || "jpg" || "jpeg" || "gif"}`} alt="No hay imagen" className="font-bold h-80 object-cover object-center"/>
      <div className={`flex flex-col gap-y-4 w-full p-4 text-xl`}>
        <h3 className="text-2xl">{article.description}</h3>
        <p>Stock: {article.stock}</p>
      </div>
    </div>
  )
}

export default Article