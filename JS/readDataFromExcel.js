import * as XLSX from "xlsx";

const readDataFromExcel = (data) => {
    const wb = XLSX.read(data);
    const sheetNames = wb.SheetNames;
    const mySheetData = {};

    for (const sheetName of sheetNames) {
        const worksheet = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        mySheetData[sheetName] = jsonData;
    }

    return { mySheetData, sheetNames };
};

export default readDataFromExcel;
