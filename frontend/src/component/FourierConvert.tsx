import axios from "axios";
import {xData} from "../App.tsx";
import {Dispatch, SetStateAction} from "react";

type ResponseFourier = {
    fft_result: number[],
    frequencies: number[]
}

type Props = {
    yData:number[]
    setXDataFourier:Dispatch<SetStateAction<number[]>>
    setYDataFourier:Dispatch<SetStateAction<number[]>>
    setIsFourier:Dispatch<SetStateAction<boolean>>
}
export const FourierConvert = (props:Props) => {

    const handleConvertWave = async () => {
        const data = {
            xData: xData,
            yData: props.yData,
        }
        const res = await axios.post<ResponseFourier>("http://localhost:5181/api/convert", data).then(res => res.data)
        props.setXDataFourier(res.frequencies)
        props.setYDataFourier(res.fft_result)
        props.setIsFourier(true)

    }

    return (
        <div>
            <button onClick={handleConvertWave}>パイソンでフーリエ変換する</button>
        </div>
    )
}