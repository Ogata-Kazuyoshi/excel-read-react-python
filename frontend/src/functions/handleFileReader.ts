import * as XLSX from "xlsx";

export const handleFileReader = (file:File):Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = workbook.Sheets['try'];
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
        };
        reader.readAsArrayBuffer(file);
    })
}