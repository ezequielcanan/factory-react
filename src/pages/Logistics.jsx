import { useEffect, useState } from "react"
import Title from "../components/Title"
import Main from "../containers/Main"
import moment from "moment"
import 'moment/locale/es'
import customAxios from "../config/axios.config"
import Date from "../components/Date"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaCalendar, FaCalendarAlt } from "react-icons/fa"

moment.updateLocale('es', {
  months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  weekdaysShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  weekdaysMin: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sa']
});

const Logistics = () => {
  const [from, setFrom] = useState(moment().startOf('week').add(1, 'day'))
  const [to, setTo] = useState(moment().endOf("week").add(1, "day"))
  const [activities, setActivities] = useState(null)
  const [reload, setReload] = useState(false)


  useEffect(() => {
    customAxios.get(`/activities?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`).then(res => {
      setActivities(res?.data)
    })
  }, [reload, to])
  
  const getDatesBetween = (start, end) => {
    const dates = [];
    let currentDate = start.clone();
  
    while (currentDate.isSameOrBefore(end)) {
      dates.push({date: currentDate.format('YYYY-MM-DD'), day: currentDate.format("dddd")});
      currentDate.add(1, 'day');
    }
  
    return dates;
  };

  const changeWeek = (weeks = 1) => {
    setFrom(f => f.clone().add(weeks, "week"))
    setTo(t => t.clone().add(weeks, "week"))
  }

  return (
    <Main className={"grid gap-y-8 content-start"}>
      <section className="grid items-center justify-center gap-8 md:items-start md:grid-cols-2 md:justify-between">
        <Title text={"Logistica"} className={"text-center md:text-start"}/>
        <Link className="justify-between justify-self-center md:justify-self-end font-bold" to={`/logistics/new`}><Button className={"flex gap-4 items-center px-4 py-2"}>Nueva tarea <FaCalendarAlt/></Button></Link>
      </section>
      <section className="grid xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {activities && getDatesBetween(from, to).map(date => {
          const dateActivities = {
            activities: activities["activities"].map(activity => {
              if (moment(activity.date).isSame(moment(date?.date, "YYYY-MM-DD"), "day")) {
                return {type: "activity", data: activity}
              } else {
                return false
              }
            }).filter(a => a),
            orders: activities["orders"].map(activity => {
              if (moment(activity.deliveryDate).isSame(moment(date?.date, "YYYY-MM-DD"), "day")) {
                return {type: "order", data: activity}
              } else {
                return false
              }
            }).filter(a => a)
          }
          return <Date date={date} activities={dateActivities} key={date?.date} setReload={setReload}/>
        })}
      </section>
      <section className="flex justify-between items-center gap-8 text-white text-3xl">
        <FaChevronLeft className="cursor-pointer" onClick={() => changeWeek(-1)}/>
        <FaChevronRight className="cursor-pointer" onClick={() => changeWeek()}/>
      </section>
    </Main>
  )
}

export default Logistics