import * as XLSX from "xlsx";
import {maxRow} from "../App.tsx";

type mode = "initialSet" | "changeGraph"
export const handleFileReader = (file:File, mode:mode,selectNumber?:number):Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = workbook.Sheets['try'];
            switch (mode) {
                case "initialSet":
                    if (sheet) {
                        let undefinedFlg = false
                        let columnIndex = 0
                        const tempTitles: string[] = []
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
                        resolve(tempTitles);
                    }
                    else {
                        reject(new Error('Sheet "try" not found'));
                    }

                    break;
                case "changeGraph":
                        if (sheet) {
                            const tempYData: string[] = [];
                            if (selectNumber!==undefined){
                                for (let i = 1; i < maxRow; i++) {
                                    const cellAddress = XLSX.utils.encode_cell({r: i, c: selectNumber});
                                    const cell = sheet[cellAddress];
                                    const cellValue = cell ? cell.v : "0";
                                    tempYData.push(cellValue);
                                }
                                resolve(tempYData);
                            }
                            reject(new Error('selectNumber is undefined'));
                        } else {
                            reject(new Error('Sheet "try" not found'));
                        }
                    break;
                default:
                    break;
            }
        };
        reader.readAsArrayBuffer(file);
    })
}