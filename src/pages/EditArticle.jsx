import Main from "../containers/Main"
import ArticleForm from "../components/ArticleForm"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { colors, sizes, categories, societies } from "../utils/utils"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"

const EditArticle = () => {
  const { register, handleSubmit } = useForm()
  const {aid} = useParams()
  const [file, setFile] = useState(null)
  const navigate = useNavigate()
  const [color, setColor] = useState(null)
  const [category, setCategory] = useState(null)
  const [size, setSize] = useState(null)
  const [society, setSociety] = useState(null)
  const [article, setArticle] = useState(null)

  useEffect(() => {
    customAxios.get(`/articles/${aid}`).then(res => {
      const result = res?.data
      setArticle(result)
      setColor(colors.find(c => c.value == result?.color))
      setCategory(categories.find(c => c.value == result?.category))
      setSize(sizes.find(s => s.value == result?.size))
      setSociety(societies.find(s => s.value == result?.society))
      setFile([null, `${import.meta.env.VITE_REACT_API_URL}/files/articles/${result?._id}/thumbnail.${"png" || "jpg" || "jpeg" || "gif"}`])
    })
  }, [])
  
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([uploadedFile, e.target.result])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const onSubmit = () => {

  }

  return (
    <Main className={"grid lg:grid-cols-2 gap-8 justify-items-center"}>
      {article && <ArticleForm
        onSubmit={onSubmit}
        register={register}
        article={article}
        file={file}
        handleFileChange={handleFileChange}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        category={category}
        setCategory={setCategory}
        society={society}
        setSociety={setSociety}
      />}
    </Main>
  )
}

export default EditArticle