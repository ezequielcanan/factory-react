import Input from "../components/Input"
import Label from "../components/Label"
import Main from "../containers/Main"
import { colors, sizes, categories, societies } from "../utils/utils"
import { useForm } from "react-hook-form"
import SelectInput from "../components/SelectInput"
import { useState } from "react"
import { FaFileUpload } from "react-icons/fa"
import { uploadFile } from "../utils/utils.js"
import Button from "../components/Button"
import customAxios from "../config/axios.config"
import { useNavigate } from "react-router-dom"
import ArticleForm from "../components/ArticleForm"

const NewArticle = ({materials = false}) => {
  const { register, handleSubmit } = useForm()
  const [file, setFile] = useState(null)
  const navigate = useNavigate()
  const [color, setColor] = useState(colors[0])
  const [category, setCategory] = useState(categories[0])
  const [size, setSize] = useState(sizes[0])
  const [society, setSociety] = useState(societies[0])

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
    }

    data.material = materials
    data.stock = Number(data.stock)
    data.price = Number(data?.price)
    const result = await customAxios.post("/articles", data)
    const id = result?.data?._id

    if (file) {
      const filePath = `/articles/${id}`
      const sendFile = file[0]
      let ext = sendFile.name?.split(".")
      ext = ext[ext.length - 1]
      
      await uploadFile(sendFile, filePath, "thumbnail.png")
    }
      
    navigate(!materials ? "/articles" : "/materials")
  })

  return (
    <Main className={"grid lg:grid-cols-2 gap-8 justify-items-center"}>
      <ArticleForm
        onSubmit={onSubmit}
        register={register}
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
        materials={materials}
      />
    </Main>
  )
}

export default NewArticle