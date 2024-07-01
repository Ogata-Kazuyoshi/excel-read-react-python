import {Graph} from "./Graph.tsx";
import {useRef, useState} from "react";

type Props = {
    xDataFourier:number[]
    yDataFourier:number[]
    maxYValue?:number

}
export const FourierGraph = (props:Props) => {

    const [xMinValue, setXMinValue] = useState<undefined | number>(undefined)
    const [xMaxValue, setXMaxValue] = useState<undefined | number>(undefined)
    const inputXminRef = useRef<HTMLInputElement | null>(null)
    const inputXmaxRef = useRef<HTMLInputElement | null>(null)

    return  <>
        <Graph xData={props.xDataFourier} yData={props.yDataFourier} title={"Fourier変換後(フーリエの計算結果がおかしい！！！)"} maxValue={props.maxYValue}
               xMin={xMinValue} xMax={xMaxValue}/>
        <div>
            <input type={"number"} ref={inputXminRef}/>
            <button onClick={() => {
                if (inputXminRef.current!.value) {
                    setXMinValue(+inputXminRef.current!.value)
                } else {
                    setXMinValue(undefined)
                }
            }}>x軸Min
            </button>
        </div>
        <div>
            <input type={"number"} ref={inputXmaxRef}/>
            <button onClick={() => {
                if (inputXmaxRef.current!.value) {
                    setXMaxValue(+inputXmaxRef.current!.value)
                } else {
                    setXMaxValue(undefined)
                }
            }}>x軸Max
            </button>
        </div>
    </>
}