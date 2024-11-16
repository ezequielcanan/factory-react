import Label from "./Label"
import Input from "./Input"
import Button from "./Button"
import { FaFileUpload } from "react-icons/fa"
import { colors, sizes, categories, societies } from "../utils/utils"
import SelectInput from "./SelectInput"
import customAxios from "../config/axios.config"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const ArticleForm = ({materials=false, onSubmit, register, file, article, handleFileChange, color, setColor, size, setSize, category, setCategory, society, setSociety}) => {
  const navigate = useNavigate()
  const deleteArticle = async () => {
    Swal.fire({
      title: "<strong>CUIDADO: Vas a borrar el articulo</strong>",
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        Confirmar
      `,
      cancelButtonText: `
        Cancelar
      `,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await customAxios.delete(`/articles/${article?._id}`)
        if (result) navigate(!materials ? "/articles" : "/materials")
      }
    });
  }

  return (
    <>
      <form action="" className={`grid grid-cols-2 items-start gap-y-8 h-max`} onSubmit={onSubmit}>
        <Label>Descripcion</Label>
        <Input register={register("description", { required: true })} defaultValue={article?.description || ""} className={"!py-2 w-full"} />

        {!materials && <>
          <Label>Negocio</Label>
          <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />

          <Label>Categoria</Label>
          <SelectInput selectedOption={category} setSelectedOption={setCategory} options={categories} className={"!py-2"} />

          <Label>Color</Label>
          <SelectInput selectedOption={color} setSelectedOption={setColor} options={colors} className={"!py-2"} />

          <Label>Talle</Label>
          <SelectInput selectedOption={size} setSelectedOption={setSize} text options={sizes} className={"!py-2"} />
        </>}

        <Label>Stock</Label>
        <Input register={register("stock")} defaultValue={article?.stock || ""} type="number" step="1" className={"!py-2 w-full"} />

        <Label>Precio</Label>
        <Input register={register("price")} defaultValue={article?.price || ""} type="number" step="1" className={"!py-2 w-full"} />

        <Button className={"col-span-2"} type="submit">Confirmar</Button>
        {article && <Button className={"col-span-2 bg-red-600 hover:bg-red-700"} type="button" onClick={deleteArticle}>Borrar</Button>}
      </form>

      <Label htmlFor="file" className={`${file ? "w-full h-[650px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4"} flex items-center overflow-hidden justify-center `}>
        {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
        <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"} />
      </Label>
    </>
  )
}

export default ArticleForm