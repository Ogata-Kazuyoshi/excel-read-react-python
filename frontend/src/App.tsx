import './App.css';
import {Graph} from "./component/Graph.tsx";
import {xDataCreater} from "./functions/xDataCreater.ts";
import {useEffect, useState} from "react";
import {FileInput} from "./component/FileInput.tsx";
import {handleFileReader} from "./functions/handleFileReader.ts";
import {ChangeGraphScale} from "./component/ChangeGraphScale.tsx";
import {FourierConvert} from "./component/FourierConvert.tsx";
import {PageNation} from "./component/PageNation.tsx";
import {FourierGraph} from "./component/FourierGraph.tsx";
import {Magenta} from "./component/Magenta.tsx";


export const maxRow = 3000
export const xData = xDataCreater()

function App() {

    const [selectedColumnIndex, setSelectedColumnIndex] = useState(0)
    const [yData, setYData] = useState<number[]>([])
    const [title, setTitle] = useState("")
    const [file, setFile] = useState<File | null>(null);
    const [maxYValue, setMaxYValue] = useState<undefined | number>(undefined)
    const [titles, setTitles] = useState<string[]>([])
    const [isFourier, setIsFourier] = useState(false)
    const [xDataFourier, setXDataFourier] = useState<number[]>([])
    const [yDataFourier, setYDataFourier] = useState<number[]>([])


    useEffect(() => {
        if (!file) return;
        setTitle(titles[selectedColumnIndex]);
        handleFileReader(file, "changeGraph", selectedColumnIndex).then(res => {
            const convertNum = res.map(elm => +elm)
            console.log({convertNum})
            console.log(JSON.stringify(convertNum))
            setYData(convertNum)
        })
    }, [file, selectedColumnIndex]); // 依存配列に file を追加


    // const download = (content: string, fileName: string) => {
    //     const element = document.createElement("a");
    //     const file = new Blob([content], {type: 'text/plain'});
    //     element.href = URL.createObjectURL(file);
    //     element.download = fileName;
    //     document.body.appendChild(element); // Required for this to work in FireFox
    //     element.click();
    // }

    return (
        <>
            <FileInput
                selectedColumnIndex={selectedColumnIndex}
                setSelectedColumnIndex={setSelectedColumnIndex}
                titles={titles}
                setTitles={setTitles}
                setFile={setFile}
            />
            <ChangeGraphScale setMaxYValue={setMaxYValue}/>
            <FourierConvert yData={yData}
                            setXDataFourier={setXDataFourier}
                            setYDataFourier={setYDataFourier}
                            setIsFourier={setIsFourier}
            />
            <Magenta yData={yData}/>
            <Graph xData={xData} yData={yData} title={title} maxValue={maxYValue}/>
            <PageNation selectedColumnIndex={selectedColumnIndex} setSelectedColumnIndex={setSelectedColumnIndex}
                        numberOfTitle={titles.length}/>
            {isFourier && <FourierGraph xDataFourier={xDataFourier} yDataFourier={yDataFourier} maxYValue={maxYValue}/>}
        </>
    )
}


export default App;