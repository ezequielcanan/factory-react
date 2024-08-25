import Input from "../components/Input"
import Label from "../components/Label"
import Main from "../containers/Main"
import { colors, sizes, categories, societies } from "../utils/utils"
import { useForm } from "react-hook-form"
import SelectInput from "../components/SelectInput"
import { useState } from "react"
import { FaFileUpload } from "react-icons/fa"
import Button from "../components/Button"
import customAxios from "../config/axios.config"
import { useNavigate } from "react-router-dom"

const NewArticle = () => {
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
    data.category = category.value
    data.size = size.value
    data.color = color.value
    console.log(data.category, category)
    data.society = society.value
    data.stock = Number(data.stock)
    const result = await customAxios.post("/articles", data)
    const id = result?.data?._id

    if (file) {
      const formData = new FormData();
      const filePath = `/articles/${id}`
      const sendFile = file[0]
      let ext = sendFile.name?.split(".")
      ext = ext[ext.length - 1]
      formData.append('file', sendFile);
      
      const uploadFile = await customAxios.post(`/upload/single?path=${filePath}&name=${"thumbnail."+"png"}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
      
    navigate("/articles")
  })

  return (
    <Main className={"grid grid-cols-2 justify-items-center max-h-screen overflow-hidden"}>
      <form action="" className={`grid grid-cols-2 items-start gap-y-8 h-max`} onSubmit={onSubmit}>
        <Label>Descripcion</Label>
        <Input register={register("description", {required: true})} className={"!py-2"} />

        <Label>Negocio</Label>
        <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />

        <Label>Categoria</Label>
        <SelectInput selectedOption={category} setSelectedOption={setCategory} options={categories} className={"!py-2"} />

        <Label>Color</Label>
        <SelectInput selectedOption={color} setSelectedOption={setColor} options={colors} className={"!py-2"} />
        
        <Label>Talle</Label>
        <SelectInput selectedOption={size} setSelectedOption={setSize} options={sizes} className={"!py-2"} />

        <Label>Stock</Label>
        <Input register={register("stock", {required: true})} type="number" step="1" className={"!py-2"} />

        <Button className={"col-span-2"} type="submit">Confirmar</Button>
      </form>

      <Label htmlFor="file" className={`${file ? "w-full h-[650px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4"} flex items-center overflow-hidden justify-center `}>
        {!file ? <FaFileUpload className="text-7xl"/> : <img src={file[1]} className="w-full h-full object-cover"/>}
        <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"}/>
      </Label>
    </Main>
  )
}

export default NewArticle