import Main from "../containers/Main"

const Home = () => {
  return (
    <Main className={"px-8 pt-[150px] pb-[50px] grid md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 gap-8"}>
      <section className="bg-third rounded-lg border-2 border-cyan-500 row-span-2 shadow-[0_0px_10px_1px_rgba(0,255,255,0.8)]">
        <h2 className="text-3xl text-white font-bold p-4">Ultima semana</h2>
      </section>
      <section className="bg-third rounded-lg border-2 border-cyan-500 row-span-2 shadow-[0_0px_10px_1px_rgba(0,255,255,0.8)]">
        <h2 className="text-3xl text-white font-bold p-4">Ultimo mes</h2>
      </section>
    </Main>
  )
}

export default Home