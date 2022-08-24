import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import readDataFromExcel from "../../JS/readDataFromExcel";
import checkFileName from "../../JS/checkFileName";
import { cleanData } from "../../JS/cleanData";
import "./regul-odoo.css";

const RegulOdoo = () => {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [sheetNames, setSheetNames] = useState([]);
    const [sheetData, setSheetData] = useState({});
    const [newData, setNewData] = useState({});
    const fileRef = useRef(null);
    const acceptableFile = ["xls", "xlsx"];

    const handleFile = async (e) => {
        const myFile = e.target.files[0];
        if (!myFile) return;
        if (!checkFileName(acceptableFile, myFile.name)) return alert("Invalide format");

        const data = await myFile.arrayBuffer();
        const { mySheetData, sheetNames } = readDataFromExcel(data);
        console.log("🚀 ~ file: regul-odoo.jsx ~ line 22 ~ handleFile ~ mySheetData", mySheetData);
        setSheetData(mySheetData);
        setSheetNames(sheetNames);
        setFile(myFile);
        setFileName(myFile.name);
        setNewData(cleanData(mySheetData, sheetNames));
        console.log("🚀 ~ myFile: App.jsx ~ line 14 ~ handleFile ~ myFile", myFile);
    };

    const handleRemove = () => {
        setFile(null);
        setFileName("");
        fileRef.current.value = "";
    };

    const handleExport = () => {
        console.log("NEW DATA ========>", newData);
        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(newData);

        XLSX.utils.book_append_sheet(workBook, workSheet, "T2");
        XLSX.writeFile(workBook, "T2_Essaie_1.xlsx");
    };
    return (
        <div className="ro">
            <div className="container">
                <div className="container_input">
                    <label htmlFor="import" className="import">
                        <input
                            type="file"
                            accept="xlsx, xls"
                            ref={fileRef}
                            name="import"
                            id="import"
                            onChange={(e) => handleFile(e)}
                        />
                        Importer fichier unique xlsx
                    </label>
                </div>
                <div className="container_btns">
                    <button onClick={handleRemove}>Supprimer</button>
                    <button onClick={handleExport}>Export</button>
                </div>
            </div>
            <div>{}</div>
        </div>
    );
};

export default RegulOdoo;
