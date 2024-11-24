import customAxios from "../config/axios.config.js"

export const colors = [
  { value: "Rojo", bg: "bg-red-600", transparent: true },
  { value: "Verde", bg: "bg-green-600", transparent: true },
  { value: "Azul", bg: "bg-blue-600", transparent: true },
  { value: "Amarillo", bg: "bg-yellow-400", transparent: true },
  { value: "Rosa", bg: "bg-pink-600", transparent: true },
  { value: "Violeta", bg: "bg-purple-600", transparent: true },
  { value: "Marron", bg: "bg-pink-950", transparent: true },
  { value: "Negro", bg: "bg-black", transparent: true },
  { value: "Gris", bg: "bg-slate-500", transparent: true },
  { value: "Blanco", bg: "bg-white", transparent: true },
]

export const sizes = [
  { value: "5XL" },
  { value: "4XL" },
  { value: "XXXL" },
  { value: "XXL" },
  { value: "XL" },
  { value: "L" },
  { value: "M" },
  { value: "S" },
  { value: "XS" }]

export const societies = [
  { value: "Arcan" },
  { value: "Cattown" },
  { value: "Cattown Home" }
]

export const categories = [
  { value: "Remeras" },
  { value: "Pantalones" },
  { value: "Camperas" },
  { value: "Zapatillas" },
  { value: "Fajas" },
  { value: "Rascadores" },
  { value: "Juguetes" },
  { value: "Otros" }
]

export const measurements = [
  { value: "Unidades" },
  { value: "kg" },
  { value: "cm2" },
  { value: "mt2" }
]

export const roles = [
  { value: "prices", text: "Facturacion" },
  { value: "articles", text: "Stock" },
  { value: "orders", text: "Pedidos" },
  { value: "cattown", text: "Cattown" },
  { value: "clients", text: "Clientes" },
  { value: "cuts", text: "Cortes" },
  { value: "workshops", text: "Talleres" },
  { value: "logistics", text: "Logistica" },
  { value: "budgets", text: "Presupuestos" },
  { value: "materials", text: "Insumos" },
  { value: "suppliers", text: "Proveedores" },
  { value: "buys", text: "Compras" },
  { value: "admin", text: "Administrador" },
]

export const getArticleImg = (id, custom = false, bordado = false) => {
  return `${import.meta.env.VITE_REACT_API_URL}/files/articles/${custom ? "custom/" + id : id}/${!bordado ? "thumbnail" : "bordado"}.png`
}

export const uploadFile = async (sendFile, path, name) => {
  const formData = new FormData();
  formData.append('file', sendFile);

  return await customAxios.post(`/upload/single?path=${path}&name=${name}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const userIncludesRoles = (userData, ...roles) => {
  let verified = false
  const user = userData
  if (roles.includes("cattown") && user?.roles?.includes("admin")) return false
  if (user?.roles?.includes("admin")) return true

  roles.forEach(role => {
    if (user?.roles?.includes(role)) {
      verified = true
    }
  })

  return verified
}