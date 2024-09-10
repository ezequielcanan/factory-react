import Label from "./Label"
import Button from "./Button"
import Input from "./Input"

const WorkshopForm = ({ register, onSubmit, error, workshop, newWorkshop = true }) => {
  return (
    <form className={`grid grid-cols-2 items-start gap-y-10`} onSubmit={onSubmit}>
      <Label>Nombre</Label>
      <Input register={register("name")} defaultValue={workshop?.name} className={"!py-2 "} />

      <Label>Numero</Label>
      <Input register={register("phone")} defaultValue={workshop?.phone} className={"!py-2 "} />

      <Label>Direccion</Label>
      <Input register={register("address")} defaultValue={workshop?.address} className={"!py-2 "} />

      {error && <p className="text-red-600">Un campo esta mal ingresado</p>}
      <Button className={"col-span-2"} type="submit">Agregar</Button>
    </form>
  )
}

export default WorkshopForm