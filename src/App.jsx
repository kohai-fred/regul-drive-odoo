import { useState, useRef } from "react";
import "./App.css";
// import { read, utils, writeFileXLSX } from "xlsx";
// import XLSX from "xlsx";
// import * as XLSX from "https://unpkg.com/xlsx/xlsx.mjs";
import * as XLSX from "xlsx";

function App() {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [sheetNames, setSheetNames] = useState([]);
    const [sheetData, setSheetData] = useState({});
    const fileRef = useRef(null);
    const acceptableFile = ["xls", "xlsx"];

    const checkFileName = (name) => {
        return acceptableFile.includes(name.split(".").pop().toLowerCase());
    };

    const cleanData = (data, sheetNames) => {
        console.log("SheetNames", sheetNames);
        const copyData = structuredClone(data[`${sheetNames}`]);
        const reduceByName = copyData.reduce((acc, current) => {
            const nom = current["Employé/Nom"];
            if (!acc[nom]) {
                acc[nom] = [current];
                return acc;
            } else {
                acc[nom].push(current);
                return acc;
            }
        }, {});
        console.log("🚀 ~ file: App.jsx ~ line 30 ~ reduceByName ~ reduceByName", reduceByName);
        const newData = [];
        for (const item in reduceByName) {
            const user = reduceByName[item];
            let partenaire, userName;
            const element = user.reduce((acc, current) => {
                partenaire = current["Entrées congés/Partenaire"];
                userName = current["Employé/Nom"];
                if (!acc[userName]) {
                    acc[userName] = { [partenaire]: current };
                    return acc;
                } else if (!acc[userName][partenaire]) {
                    acc[userName][partenaire] = current;
                    return acc;
                } else {
                    acc[userName][partenaire]["Heures normales"] += current["Heures normales"];
                    acc[userName][partenaire]["Total d'heures"] += current["Total d'heures"];
                    return acc;
                }
            }, {});

            for (const item in element[userName]) {
                const partenaire = element[userName][item];
                partenaire["Heures normales"] = +partenaire["Heures normales"].toFixed(2);
                partenaire["Total d'heures"] = +partenaire["Total d'heures"].toFixed(2);
                newData.push(partenaire);
            }
        }
        console.log("🚀 ~ file: App.jsx ~ line 37 ~ cleanData ~ newData", newData);
    };

    const readDataFromExcel = (data) => {
        const wb = XLSX.read(data);
        setSheetNames(wb.SheetNames);
        console.log("🚀 ~ file: App.jsx ~ line 25 ~ readDataFromExcel ~ sheetNames", wb.SheetNames);
        const mySheetData = {};

        for (const sheetName of wb.SheetNames) {
            console.log("🚀 ~ file: App.jsx ~ line 28 ~ readDataFromExcel ~ sheetName", sheetName);
            const worksheet = wb.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            mySheetData[sheetName] = jsonData;
        }
        setSheetData(mySheetData);
        console.log("mySheetData", mySheetData);
        cleanData(mySheetData, wb.SheetNames);
    };

    const handleFile = async (e) => {
        const myFile = e.target.files[0];
        if (!myFile) return;
        if (!checkFileName(myFile.name)) return alert("Invalide format");

        const data = await myFile.arrayBuffer();
        readDataFromExcel(data);
        setFile(myFile);
        setFileName(myFile.name);
        console.log("🚀 ~ myFile: App.jsx ~ line 14 ~ handleFile ~ myFile", myFile);
    };

    const handleRemove = () => {
        setFile(null);
        setFileName("");
        fileRef.current.value = "";
    };

    return (
        <div>
            <div>
                <label htmlFor="import">Importer fichier unique xlsx</label>
                <input
                    type="file"
                    accept="xlsx, xls"
                    ref={fileRef}
                    name="import"
                    id="import"
                    onChange={(e) => handleFile(e)}
                />
                <button>Button</button>
                <button onClick={handleRemove}>Remove</button>
            </div>
            <div>{}</div>
        </div>
    );
}

export default App;
