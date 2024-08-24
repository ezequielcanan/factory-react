import Input from "../components/Input"
import Label from "../components/Label"
import Main from "../containers/Main"
import InputContainer from "../containers/InputContainer"
import { useForm } from "react-hook-form"
import SelectInput from "../components/SelectInput"
import { useState } from "react"
import { FaFileUpload } from "react-icons/fa"
import Button from "../components/Button"

const NewArticle = () => {
  const { register, handleSubmit } = useForm()
  const [file, setFile] = useState(null)
  const colors = [
    { value: "Rojo", bg: "bg-red-600", transparent: true },
    { value: "Verde", bg: "bg-green-600", transparent: true },
    { value: "Azul", bg: "bg-blue-600", transparent: true },
    { value: "Amarillo", bg: "bg-yellow-400", transparent: true },
    { value: "Rosa", bg: "bg-pink-600", transparent: true },
    { value: "Violeta", bg: "bg-purple-600", transparent: true },
    { value: "Celeste", bg: "bg-sky-600", transparent: true },
    { value: "Marron", bg: "bg-pink-950", transparent: true },
    { value: "Negro", bg: "bg-black", transparent: true },
    { value: "Blanco", bg: "bg-white", transparent: true },
  ]

  const sizes = [{value: "XL"}, {value: "LG"}, {value: "M"}, {value: "SM"}, {value: "XS"}]
  
  const categories = [
    {value: "Remeras"},
    {value: "Pantalones"},
    {value: "Camperas"},
    {value: "Zapatillas"},
    {value: "Fajas"},
    {value: "Rascadores"},
    {value: "Juguetes"},
    {value: "Otros"}
  ]

  const [color, setColor] = useState(colors[0])
  const [category, setCategory] = useState(categories[0])
  const [size, setSize] = useState(sizes[0])

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([uploadedFile, e.target.result])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const onSubmit = handleSubmit(data => {
    data.category = category.value
    data.size = size.value
    data.color = color.value


  })

  return (
    <Main className={"grid grid-cols-2 justify-items-center max-h-screen overflow-hidden"}>
      <form action="" className={`grid grid-cols-2 items-start gap-y-8 h-max`} onSubmit={onSubmit}>
        <Label>Descripcion</Label>
        <Input register={register("description", {required: true})} className={"!py-2"} />

        <Label>Talle</Label>
        <SelectInput selectedOption={size} setSelectedOption={setSize} options={sizes} className={"!py-2"} />

        <Label>Color</Label>
        <SelectInput selectedOption={color} setSelectedOption={setColor} options={colors} className={"!py-2"} />

        <Label>Categoria</Label>
        <SelectInput selectedOption={category} setSelectedOption={setCategory} options={categories} className={"!py-2"} />

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