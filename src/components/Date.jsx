import ActivityRow from "./ActivityRow"

const Date = ({ date, activities, setReload, cut = false }) => {
  return <div className="grid gap-y-2 bg-secondary content-start text-white border-2">
    <div className="p-4 bg-third border-b-2">
      <p className="text-md text-center">{date?.day}: {date?.date}</p>
    </div>
    <div className="flex flex-col p-4 gap-y-4">
      {(activities?.orders?.length || activities?.activities?.length) ? (
        <>
          {activities?.orders.map((order, i) => {
            return <ActivityRow title={order?.data?.client?.name} isOrder activity={order?.data} key={i + date?.date + "o" + order?.data?._id} setReload={setReload} />
          })}
          {activities?.activities?.map((activity, i) => {
            return <ActivityRow title={activity?.data?.title} activity={activity?.data} key={i + date?.date + "a" + activity?.data?._id} setReload={setReload}/>
          })}
        </>
      ) : (
        <p className="text-lg text-center">No hay tareas</p>
      )}
    </div>
  </div>
}

export default Date