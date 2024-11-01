import Label from "./Label"
import Input from "./Input"
import Button from "./Button"
import moment from "moment"

const ActivityForm = ({register, onSubmit, activity, error, buttonClassName = "", date = true}) => {
  return (
    <form className={`grid grid-cols-2 items-start gap-y-10`} onSubmit={onSubmit}>
      <Label>Titulo</Label>
      <Input register={register("title")} defaultValue={activity?.title || ""} className={"!py-2 "} />

      <Label>Descripcion</Label>
      <Input register={register("description")} defaultValue={activity?.description || ""} className={"!py-2 w-full resize-none !text-lg"} textarea/>

      {date && (
        <>
          <Label>Fecha</Label>
          <Input register={register("date")} defaultValue={activity?.date ? moment(activity?.date).format("YYYY-MM-DD") : ""} className={"!py-2 w-full resize-none !text-lg"} type="date"/>
        </>
      )}

      {error && <p className="text-red-600">Un campo esta mal ingresado</p>}
      <Button className={"col-span-2 " + buttonClassName} type="submit">Confirmar</Button>
    </form>
  )
}

export default ActivityForm