const Date = ({date}) => {
  return <div className="grid gap-y-2 bg-slate-800/60 content-start text-white">
    <div className="p-4 bg-slate-400/60">
      <p className="text-xs text-center">{date?.day}: {date?.date}</p>
    </div>
    <div className="flex flex-col p-4">
      <p>pasdipasdhioj</p>
    </div>
  </div>
}

export default Date