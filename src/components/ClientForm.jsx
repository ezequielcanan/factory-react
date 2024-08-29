import Label from "./Label"
import Input from "./Input"
import Button from "./Button"

const ClientForm = ({register, onSubmit, client, error}) => {
  return (
    <form className={`grid grid-cols-2 items-start gap-y-10`} onSubmit={onSubmit}>
      <Label>Nombre</Label>
      <Input register={register("name", { required: true })} defaultValue={client?.name || ""} className={"!py-2 "} />

      <Label>Telefono</Label>
      <Input register={register("phone", { required: true })} defaultValue={client?.phone || ""} className={"!py-2 "} />

      <Label>Email</Label>
      <Input register={register("email", { required: true })} defaultValue={client?.email || ""} className={"!py-2 "} />

      <Label>CUIT</Label>
      <Input register={register("cuit", { required: true })} defaultValue={client?.cuit || ""} className={"!py-2 "} />

      <Label>Direccion</Label>
      <Input register={register("address", { required: true })} defaultValue={client?.address || ""} className={"!py-2 "} />

      <Label>Instrucciones</Label>
      <Input register={register("detail", { required: true })} defaultValue={client?.detail || ""} className={"!py-2 w-full resize-none !text-lg"} textarea/>
      {error && <p className="text-red-600">Un campo esta mal ingresado</p>}
      <Button className={"col-span-2"} type="submit">Agregar</Button>
    </form>
  )
}

export default ClientForm