import './App.css';
import * as XLSX from 'xlsx';
import {Graph} from "./pages/Graph.tsx";
import {xDataCreater} from "./functions/xDataCreater.ts";
import {useEffect, useRef, useState} from "react";

function App() {
    const xData = xDataCreater()
    const maxRow = 3000
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(2)
    const [yData, setYData] = useState<number[]>([])
    const [title, setTitle] = useState("")
    const [file, setFile] = useState<File | null>(null);
    const [maxYValue, setMaxYValue] = useState<undefined | number>(undefined)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [titles, setTitles] = useState<string[]>([])
    const options = ["a", "b", "c", "d"]


    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files?.[0];
        if (!newFile) return;
        setFile(newFile); // ファイルを state にセット
        console.log("aaaa")

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets['try'];
            if (sheet) {
                let undefinedFlg = false
                let columnIndex = 0
                const tempTitles:string[] = []
                while (!undefinedFlg) {
                        const cellAddress = XLSX.utils.encode_cell({r: 0, c: columnIndex});
                        const cell = sheet[cellAddress];
                        const cellValue = cell ? cell.v : 0;
                        if (cellValue === 0) {
                            undefinedFlg = true
                        } else {
                            columnIndex++
                            tempTitles.push(cellValue)
                        }
                }
                setTitles(tempTitles)
            } else {
                window.alert('Sheet "try" not found');
            }
        };
        reader.readAsArrayBuffer(newFile);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColumnIndex(titles.indexOf(event.target.value));
    };

    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
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
    }, [file,selectedColumnIndex]); // 依存配列に file を追加


    const download = (content: string, fileName: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <>
            {/*<div>エクセルの読み込み</div>*/}
            <input type="file" onChange={handleFile} accept=".xlsx, .xls"/>
            <div>
                <label>オプション選択:</label>
                <select onChange={handleOptionChange} value={titles[selectedColumnIndex]}>
                    {titles.map((title, index) => (
                        <option key={index} value={title}>{title}</option>
                    ))}
                </select>
            </div>
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
            <Graph xData={xData} yData={yData} title={title} maxValue={maxYValue}/>
            <div>
                <button onClick={() => {
                    if (selectedColumnIndex !== 0) setSelectedColumnIndex(selectedColumnIndex - 1)
                }}
                >前へ
                </button>
                <button onClick={() => {
                    if(selectedColumnIndex < titles.length -1 ) setSelectedColumnIndex(selectedColumnIndex + 1)
                }}>次へ
                </button>
            </div>
        </>
    )
}


export default App;