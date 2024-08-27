import { useState } from "react"
import Main from "../containers/Main"
import Label from "../components/Label"
import ClientsContainer from "../containers/ClientsContainer"
import Button from "../components/Button"
import { FaChevronDown } from "react-icons/fa6"
import { FaFileUpload } from "react-icons/fa"
import Input from "../components/Input"

const NewOrder = () => {
  const [client, setClient] = useState(null)
  const [selectClients, setSelectClients] = useState(true)
  const [file, setFile] = useState(null)

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([uploadedFile, e.target.result])
    };
    reader.readAsDataURL(uploadedFile)
  }

  return (
    <Main className={"grid"}>
      <form action="" className="grid lg:grid-cols-2">
        <div className="grid grid-cols-2 justify-start gap-8 items-start">
          <div className="grid grid-cols-2 justify-start content-start gap-8 items-start col-span-2">
            <Label>Cliente</Label>
            <Button className={"px-4"} onClick={(e) => (e.preventDefault(), setSelectClients(s => !s))}>{client?.name || <FaChevronDown/>}</Button>
            {selectClients && <ClientsContainer containerClassName={"xl:!grid-cols-3 mb-10 col-span-2"} onClickClient={(c) => (setClient(c), setSelectClients(false))}/>}

            <Label>Fecha</Label>
            <Input type="date" className={"w-full"} containerClassName={"justify-self-end"}/>
          </div>

          <Label htmlFor="file" className={`${file ? "w-full h-[650px] border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} !h-full col-span-2 flex items-center overflow-hidden justify-center `}>
            {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
            <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"} />
          </Label>
        </div>
      </form>
    </Main>
  )
}

export default NewOrder