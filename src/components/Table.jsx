import { useState } from "react"
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa"

const Table = ({ headers, rows, fields, containerClassName = "", colorScale = false, colorProperty = "balance", maxValue = 0, minValue = 0 }) => {
  const [width, setWidth] = useState(window.innerWidth)
  const widthClass = `max-w-[${width}px]`
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth)
  })
  return (
    <div className={`relative overflow-x-auto col-start-1 ${containerClassName}`}>
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
                  
                  const finalOscurity = 200
                  const red = 255
                  const green = Math.floor(finalOscurity - ((row[colorProperty] - minValue) / (maxValue - minValue)) * finalOscurity);
                  const blue = 0;

                  const finalGreen = Math.max(0, Math.min(green, finalOscurity));
                
                  const finalColor = `rgb(${red}, ${finalGreen}, ${blue})`;

                  return (
                    <td style={{ backgroundColor: finalColor, color: finalGreen > 150 ? "black" : "white" }} className={`py-2 px-4 whitespace-nowrap ${!colorScale ? (i % 2 ? "!bg-secondary" : "!bg-third") : ""} ${f.clickeable ? "cursor-pointer" : ""}`} onClick={() => f.clickeable ? f.onClick(row) : {}} key={f.value+i+j}>
                      <div className="flex items-center gap-x-2">
                        {!f.showsFunc ? (f.value == "description" ? (row[f?.value] || row["detail"]) : row[f?.value]) : (f?.param ? f?.shows(row[f?.value], row) : f?.shows(row[f?.value]))}
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