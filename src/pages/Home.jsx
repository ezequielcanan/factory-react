import Main from "../containers/Main"

const Home = () => {
  return (
    <Main className={"bg-fourth pl-[12%] grid grid-cols-2 gap-8"}>
      <section className="bg-secondary rounded-lg">
        <h2 className="text-3xl text-white font-bold p-4">Estadisticas ultima semana</h2>
      </section>
    </Main>
  )
}

export default Home