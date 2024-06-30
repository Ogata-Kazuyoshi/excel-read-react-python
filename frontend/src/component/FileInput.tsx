import {Dispatch, SetStateAction} from "react";
import {handleFileReader} from "../functions/handleFileReader.ts";

type Props = {
    selectedColumnIndex: number
    setSelectedColumnIndex:  Dispatch<SetStateAction<number>>
    titles: string[]
    setTitles: Dispatch<SetStateAction<string[]>>
    setFile: Dispatch<SetStateAction<File>>
}

export const FileInput = (props:Props) => {
    const handleFile =async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        props.setFile(file);
        const res = await handleFileReader(file)
        props.setTitles(res)
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.setSelectedColumnIndex(props.titles.indexOf(event.target.value));
    };

    return <>
        <input type="file" onChange={handleFile} accept=".xlsx, .xls"/>
        <div>
            <label>オプション選択:</label>
            <select onChange={handleOptionChange} value={props.titles[props.selectedColumnIndex]}>
                {props.titles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                ))}
            </select>
        </div>
    </>
}