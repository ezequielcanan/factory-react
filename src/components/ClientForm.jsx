import Label from "./Label"
import Input from "./Input"
import Button from "./Button"

const ClientForm = ({register, onSubmit, client, error, newClient = true}) => {
  return (
    <form className={`grid grid-cols-2 items-start gap-y-10`} onSubmit={onSubmit}>
      <Label>Nombre</Label>
      <Input register={register("name")} defaultValue={client?.name || ""} className={"!py-2 "} />

      <Label>Telefono</Label>
      <Input register={register("phone")} defaultValue={client?.phone || ""} className={"!py-2 "} />

      <Label>Email</Label>
      <Input register={register("email")} defaultValue={client?.email || ""} className={"!py-2 "} />

      <Label>CUIT</Label>
      <Input register={register("cuit")} defaultValue={client?.cuit || ""} className={"!py-2 "} />

      <Label>Direccion</Label>
      <Input register={register("address")} defaultValue={client?.address || ""} className={"!py-2 "} />

      <Label>Referencia</Label>
      <Input register={register("detail")} defaultValue={client?.detail || ""} className={"!py-2 w-full resize-none !text-lg"} textarea/>
      
      <Label>Expreso</Label>
      <Input register={register("expreso")} defaultValue={client?.expreso || ""} className={"!py-2 "} />

      <Label>Direccion de expreso</Label>
      <Input register={register("expresoAddress")} defaultValue={client?.expresoAddress || ""} className={"!py-2 "} />

      {error && <p className="text-red-600">Un campo esta mal ingresado</p>}
      <Button className={"col-span-2"} type="submit">{newClient ? "Agregar" : "Editar"}</Button>
    </form>
  )
}

export default ClientForm