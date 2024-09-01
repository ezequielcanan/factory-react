import { useState } from "react"
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa"

const Table = ({ headers, rows, fields }) => {
  const [width, setWidth] = useState(window.innerWidth)
  const widthClass = `max-w-[${width}px]`
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth)
  })
  return (
    <div className={`relative overflow-x-auto col-start-1`}>
      <table className="w-full">
        <thead className="bg-primary">
          <tr>
            {headers.map(header => {
              return <th className="text-start p-4 text-md whitespace-nowrap" key={"header" + header}>{header}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (
              <tr key={"row" + i}>
                {fields.map((f, j) => {
                  return (
                    <td className={`py-2 px-4 whitespace-nowrap ${i % 2 ? "bg-secondary" : "bg-third"}`} key={f.value+i+j}>
                      <div className="flex items-center gap-x-2">
                        {!f.showsFunc ? (f.value == "description" ? (row[f?.value] || row["detail"]) : row[f?.value]) : f?.shows(row[f?.value])}
                        {f.controls && (
                          <div className="flex gap-x-2">
                            <FaPlusCircle className={"cursor-pointer"} onClick={() => f.onClickControls(row, f.value, 1)}/>
                            <FaMinusCircle className={"cursor-pointer"} onClick={() => f.onClickControls(row, f.value, -1)}/>
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table