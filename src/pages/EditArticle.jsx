import Main from "../containers/Main"
import ArticleForm from "../components/ArticleForm"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { colors, sizes, categories, societies, getArticleImg, measurements } from "../utils/utils"
import { uploadFile } from "../utils/utils.js"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import { Oval } from "react-loader-spinner"

const EditArticle = ({materials=false}) => {
  const { register, handleSubmit } = useForm()
  const {aid} = useParams()
  const [file, setFile] = useState(null)
  const navigate = useNavigate()
  const [color, setColor] = useState(null)
  const [category, setCategory] = useState(null)
  const [size, setSize] = useState(null)
  const [society, setSociety] = useState(null)
  const [article, setArticle] = useState(null)
  const [measurement, setMeasurement] = useState(null)

  useEffect(() => {
    customAxios.get(`/articles/${aid}`).then(res => {
      const result = res?.data
      setArticle(result)
      setColor(colors.find(c => c.value == result?.color))
      setCategory(categories.find(c => c.value == result?.category))
      setSize(sizes.find(s => s.value == result?.size) || {value: res?.data?.size})
      setSociety(societies.find(s => s.value == result?.society))
      setMeasurement(measurements.find(s => s.value == result?.measurement))
      setFile([null, getArticleImg(result?._id)])
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

  const onSubmit = handleSubmit(async data => {
    if (!materials) {
      data.category = category.value
      data.size = size.value
      data.color = color.value
      data.society = society.value
    } else {
      data.measurement = measurement.value
    }

    data.material = materials
    data.stock = Number(data.stock)
    data.price = Number(data?.price)
    const result = await customAxios.put(`/articles/${aid}`, data)
    const id = result?.data?._id

    if (file) {
      if (file[0]) {
        const formData = new FormData();
        const filePath = `/articles/${id}`
        const sendFile = file[0]
        let ext = sendFile.name?.split(".")
        ext = ext[ext.length - 1]
        formData.append('file', sendFile);
        
        await uploadFile(sendFile, filePath, "thumbnail.png")
      }
    }
      
    navigate(!materials ? "/articles" : "/materials")
  })

  return (
    <Main className={"grid lg:grid-cols-2 gap-8 justify-items-center"}>
      {article ? <ArticleForm
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
        measurement={measurement}
        setMeasurement={setMeasurement}
        materials={materials}
      /> : (
        <Oval/>
      )}
    </Main>
  )
}

export default EditArticle