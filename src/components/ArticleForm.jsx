import Label from "./Label"
import Input from "./Input"
import Button from "./Button"
import { FaFileUpload } from "react-icons/fa"
import { colors, sizes, categories, societies } from "../utils/utils"
import SelectInput from "./SelectInput"

const ArticleForm = ({onSubmit, register, file, article, handleFileChange, color, setColor, size, setSize, category, setCategory, society, setSociety}) => {
  return (
    <>
      <form action="" className={`grid grid-cols-2 items-start gap-y-8 h-max`} onSubmit={onSubmit}>
        <Label>Descripcion</Label>
        <Input register={register("description", { required: true })} defaultValue={article?.description || ""} className={"!py-2"} />

        <Label>Negocio</Label>
        <SelectInput selectedOption={society} setSelectedOption={setSociety} options={societies} className={"!py-2"} />

        <Label>Categoria</Label>
        <SelectInput selectedOption={category} setSelectedOption={setCategory} options={categories} className={"!py-2"} />

        <Label>Color</Label>
        <SelectInput selectedOption={color} setSelectedOption={setColor} options={colors} className={"!py-2"} />

        <Label>Talle</Label>
        <SelectInput selectedOption={size} setSelectedOption={setSize} options={sizes} className={"!py-2"} />

        <Label>Stock</Label>
        <Input register={register("stock", { required: true })} defaultValue={article?.stock || ""} type="number" step="1" className={"!py-2"} />

        <Button className={"col-span-2"} type="submit">Confirmar</Button>
      </form>

      <Label htmlFor="file" className={`${file ? "w-full h-[650px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4"} flex items-center overflow-hidden justify-center `}>
        {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[1]} className="w-full h-full object-cover" />}
        <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"} />
      </Label>
    </>
  )
}

export default ArticleForm