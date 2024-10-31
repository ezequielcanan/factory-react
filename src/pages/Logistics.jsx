import { useEffect, useState } from "react"
import Title from "../components/Title"
import Main from "../containers/Main"
import moment from "moment"
import 'moment/locale/es'
import customAxios from "../config/axios.config"
import Date from "../components/Date"

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

  useEffect(() => {
    customAxios.get(`/activities?from=${from.format("YYYY-MM-DD")}&to=${to.format("YYYY-MM-DD")}`).then(res => {
      setActivities(res?.data)
    })
  }, [])
  
  const getDatesBetween = (start, end) => {
    const dates = [];
    let currentDate = start.clone();
  
    while (currentDate.isSameOrBefore(end)) {
      dates.push({date: currentDate.format('YYYY-MM-DD'), day: currentDate.format("dddd")});
      currentDate.add(1, 'day');
    }
  
    return dates;
  };

  return (
    <Main className={"grid gap-y-8 content-start"}>
      <Title text={"Logistica"}/>
      <section className="grid xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {activities && getDatesBetween(from, to).map(date => {
          const dateActivities = [
            ...activities["activities"].map(activity => {
              if (moment(activity.date).isSameOrAfter(from) && moment(activity.date).isSameOrBefore(to)) {
                return {type: "activity", data: activity}
              } else {
                return false
              }
            }).filter(a => a),
            ...activities["orders"].map(activity => {
              if (moment(activity.date).isSameOrAfter(from) && moment(activity.date).isSameOrBefore(to)) {
                return {type: "order", data: activity}
              } else {
                return false
              }
            }).filter(a => a)
          ]
          return <Date date={date}/>
        })}
      </section>
    </Main>
  )
}

export default Logistics