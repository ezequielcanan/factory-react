import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import customAxios from "../config/axios.config"
import moment from "moment"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Input from "./Input"
import Button from "./Button"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement,  
  Title,     
  Tooltip,
  Legend 
);

const Resume = ({ title = "Ultima semana", week = true, month = false, controls = false, buys = false, society }) => {
  const [resume, setResume] = useState(null)
  const [error, setError] = useState(false)
  const [labels, setLabels] = useState([])
  const [profitsData, setProfitsData] = useState([])
  const [from, setFrom] = useState(moment().subtract(month ? 31 : 7, "days"))
  const [to, setTo] = useState(moment())
  const [search, setSearch] = useState(false)

  const buysUrl = `/buy-orders/recent${controls ? `?from=${from.format("DD-MM-YYYY")}&to=${to.format("DD-MM-YYYY")}` : ((month) ? `?from=${moment().subtract(31, "days").format("DD-MM-YYYY")}` : "")}`
  const ordersUrl = `/orders/recent?society=${society?.value}${controls ? `&from=${from.format("DD-MM-YYYY")}&to=${to.format("DD-MM-YYYY")}` : ((month) ? `&from=${moment().subtract(31, "days").format("DD-MM-YYYY")}` : "")}`

  const resumeUrl = buys ? buysUrl : ordersUrl

  useEffect(() => {
    customAxios.get(resumeUrl).then(res => {
      setResume(res?.data)
    }).catch(e => {
      setError(true)
    })
  }, [search, society])


  useEffect(() => {
    const generateLabels = () => {
      let days = [];
      const differenceBetweenActualDate = moment().diff(to, "days")
      const totalDays = (controls ? (to.diff(from, "days")) : (week && !month) ? 7 : 30)
      for (let i = totalDays; i >= 0; i--) {
        days.push(moment().subtract(i+differenceBetweenActualDate, "days").format("DD-MM"));
      }
      setLabels(days);
      return days
    };

    
    const calculateProfits = (days = labels) => {
      if (!resume) return [];
      
      let dailyProfits = [];
      let accumulatedProfit = 0;
      
      const sortedOrders = resume?.orders?.sort((a, b) =>
        moment(a?.finalDate, "DD-MM-YYYY")?.diff(moment(b?.finalDate, "DD-MM-YYYY"))
    );
    
      const profitsByDate = {};

      sortedOrders.forEach((order) => {
        const date = moment(order?.finalDate).format("DD-MM");

        const orderProfit = order?.articles?.reduce(
          (artAcc, art) =>
            artAcc + (art?.price || 0) * (art?.quantity || 0) * (order?.mode ? 1.21 : 1),
          0
        );

        if (profitsByDate[date]) {
          profitsByDate[date] += orderProfit;
        } else {
          profitsByDate[date] = orderProfit;
        }
      });

      days.forEach((day) => {
        if (profitsByDate[day]) {
          accumulatedProfit += profitsByDate[day];
        }
        dailyProfits.push(accumulatedProfit);
      });

      setProfitsData(dailyProfits);
    };

    const days = generateLabels();
    calculateProfits(days);
  }, [resume]);

  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: profitsData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 8,
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 8,
          }
        }
      }
    }
  };

  const onChangeDate = (setFunc, value, subtract = false) => {
    setFunc(!subtract ? moment(value) : moment(value))
  }

  const textClassName = "text-md text-white"

  return resume ? (
    <>
      <motion.section initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.5 }} className="bg-third rounded-xl shadow-[0_0px_10px_1px_rgba(0,255,255,0.2)] p-4 grid gap-y-8 content-start text-white">
        {!controls ? <h2 className="text-xl text-white font-bold mb-2">{title}</h2> : (
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold">Desde:</p>
              <Input type="date" className="text-sm !p-2" defaultValue={from.format("YYYY-MM-DD")} onInput={(e) => onChangeDate(setFrom,e?.target?.value)}/>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold">Hasta:</p>
              <Input type="date" className="text-sm !p-2" defaultValue={to.format("YYYY-MM-DD")} onInput={(e) => onChangeDate(setTo,e?.target?.value, true)}/>
            </div>
            <Button className={"text-sm"} onClick={() => setSearch(s => !s)}>Buscar</Button>
          </div>
        )}
        <p className={textClassName}>{!buys ? "Ganancia" : "Gasto"}: ${parseFloat(resume?.profits)?.toFixed(2)}</p>
        <p className={textClassName}>Pedidos {!buys ? "facturados" : "realizados"}: {resume?.ordersLength}</p>
        <p className={textClassName}>{!buys ? "Articulos" : "Insumos"} diferentes: {resume?.articles?.length}</p>
        <Line key={JSON.stringify(resume?.articles)} data={data} options={options} className="text-sm mt-auto"/>
      </motion.section>
    </>
  ) : (
    !error ? (
      <Oval />
    ) : (
      <p className="text-2xl text-red-600">ERROR</p>
    )
  )
}

export default Resume