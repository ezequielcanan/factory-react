import { useState } from "react"
import Main from "../containers/Main"
import Label from "../components/Label"
import ClientsContainer from "../containers/ClientsContainer"
import Button from "../components/Button"
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { FaFileUpload } from "react-icons/fa"
import Input from "../components/Input"
import ArticlesContainer from "../containers/ArticlesContainer"

const NewOrder = () => {
  const [client, setClient] = useState(null)
  const [selectClients, setSelectClients] = useState(true)
  const [file, setFile] = useState(null)
  const [step, setStep] = useState(1)

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile([uploadedFile, e.target.result])
    };
    reader.readAsDataURL(uploadedFile)
  }

  const onClickArticle = (article, setArticle) => {
    article.quantity ? (article.quantity += 1) : (article.quantity = 1)
    setArticle({...article})
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <Main className={"grid gap-8"}>
      <div className="flex justify-between items-center text-white text-3xl">
        {step > 1 ? <FaChevronLeft onClick={prevStep} className="cursor-pointer"/> : <p className="text-transparent">.</p>}
        <p className="text-4xl font-bold">Paso {step}</p>
        {step < 3 ? <FaChevronRight onClick={nextStep} className="cursor-pointer"/> : <p className="text-transparent">.</p>}
      </div>
      <form action="" className="grid">
        {step == 1 ? (
          <div className="grid grid-cols-2 justify-start gap-8 items-start sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 justify-start content-start gap-8 items-center col-span-2">
              <Label>Cliente</Label>
              <Button className={"px-4 sm:justify-self-end min-w-[150px]"} onClick={(e) => (e.preventDefault(), setSelectClients(s => !s))}>{client?.name || <FaChevronDown />}</Button>
              {selectClients && <ClientsContainer containerClassName={"max-h-[20rem] overflow-y-auto mb-10 sm:col-span-2"} onClickClient={(c) => (setClient(c), setSelectClients(false))} />}

              <Label>Fecha</Label>
              <Input type="date" className={"w-full"} containerClassName={"sm:justify-self-end"} />
            </div>

            <Label htmlFor="file" className={`${file ? "border-4 border-nav" : "w-full h-full border-dashed rounded-lg border-nav border-4 py-8"} col-span-2 flex items-center overflow-hidden self-center justify-center `}>
              {!file ? <FaFileUpload className="text-7xl" /> : <img src={file[1]} alt="Seleccionar imagen" className="w-full h-full object-cover" />}
              <Input type="file" className="hidden" id="file" accept="image/*" name="file" onChange={handleFileChange} containerClassName={"hidden"} />
            </Label>
          </div>
        ) : (
          <div className="grid gap-16 sm:p-8">
            <div className="flex flex-col gap-4">
              <p className="text-2xl text-white">Articulos</p>
              <ArticlesContainer containerClassName={"max-h-[600px] overflow-y-auto"} stockControl={false} onClickArticle={onClickArticle} stockNoControl/>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-2xl text-white">Articulos personalizados</p>
            </div>
          </div>
        )}
      </form>
    </Main>
  )
}

export default NewOrder