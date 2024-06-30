import './App.css';
import * as XLSX from 'xlsx';
import {Graph} from "./pages/Graph.tsx";
import {xDataCreater} from "./functions/xDataCreater.ts";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {FileInput} from "./component/FileInput.tsx";

type ResponseFourier = {
    fft_result: number[],
    frequencies: number[]
}

function App() {
    const xData = xDataCreater()
    const maxRow = 3000
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(0)
    const [yData, setYData] = useState<number[]>([])
    const [title, setTitle] = useState("")
    const [file, setFile] = useState<File | null>(null);
    const [maxYValue, setMaxYValue] = useState<undefined | number>(undefined)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [titles, setTitles] = useState<string[]>([])
    const [isFourier, setIsFourier] = useState(false)
    const [xDataFourier, setXDataFourier] = useState<number[]>([])
    const [yDataFourier, setYDataFourier] = useState<number[]>([])
    const inputXminRef = useRef<HTMLInputElement | null>(null)
    const inputXmaxRef = useRef<HTMLInputElement | null>(null)
    const [xMinValue, setXMinValue] = useState<undefined | number>(undefined)
    const [xMaxValue, setXMaxValue] = useState<undefined | number>(undefined)


    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = workbook.Sheets['try'];
            if (sheet) {
                setTitle(titles[selectedColumnIndex]);
                const tempYData: number[] = [];
                for (let i = 1; i < maxRow; i++) {
                    const cellAddress = XLSX.utils.encode_cell({r: i, c: selectedColumnIndex});
                    const cell = sheet[cellAddress];
                    const cellValue = cell ? cell.v : 0;
                    tempYData.push(cellValue);
                }
                setYData(tempYData);
            } else {
                window.alert('Sheet "try" not found');
            }
        };
        reader.readAsArrayBuffer(file);
    }, [file, selectedColumnIndex]); // 依存配列に file を追加


    const download = (content: string, fileName: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const handleConvertWave = async () => {
        const data = {
            xData: xData,
            yData: yData,
        }
        const res = await axios.post<ResponseFourier>("http://localhost:5181/api/convert", data).then(res => res.data)
        console.log({res})
        setXDataFourier(res.frequencies)
        setYDataFourier(res.fft_result)
        setIsFourier(true)

    }

    return (
        <>
            <FileInput
                selectedColumnIndex={selectedColumnIndex}
                setSelectedColumnIndex={setSelectedColumnIndex}
                titles={titles}
                setTitles={setTitles}
                setFile={setFile}
            />
            <div>
                <label>Y軸の最大値変更</label>
                <input type={"number"} ref={inputRef}/>
                <button onClick={() => {
                    if (inputRef.current!.value) {
                        setMaxYValue(+inputRef.current!.value)
                    } else {
                        setMaxYValue(undefined)
                    }
                }}>決定
                </button>
            </div>
            <div>
                <button onClick={handleConvertWave}>パイソンでフーリエ変換する</button>
            </div>
            <Graph xData={xData} yData={yData} title={title} maxValue={maxYValue}/>
            <div>
                <button onClick={() => {
                    if (selectedColumnIndex !== 0) setSelectedColumnIndex(selectedColumnIndex - 1)
                }}
                >前へ
                </button>
                <button onClick={() => {
                    if (selectedColumnIndex < titles.length - 1) setSelectedColumnIndex(selectedColumnIndex + 1)
                }}>次へ
                </button>
            </div>
            {isFourier && <>
                <Graph xData={xDataFourier} yData={yDataFourier} title={"Fourier変換後"} maxValue={maxYValue}
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
            </>}
        </>
    )
}


export default App;