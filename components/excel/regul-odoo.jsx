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
    const [newData, setNewData] = useState(null);
    const [coef, setCoef] = useState(0.776923076923077);
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
        setNewData(cleanData(mySheetData, sheetNames, coef));
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
        XLSX.utils.sheet_add_aoa(workSheet, [[`Coef pour base net`]], { origin: "O1" });
        XLSX.utils.sheet_add_aoa(workSheet, [[`${coef}`]], { origin: "O2" });

        console.log("🚀 ~ file: regul-odoo.jsx ~ line 44 ~ handleExport ~ workSheet", workSheet);
        XLSX.utils.book_append_sheet(workBook, workSheet, "T2");
        XLSX.writeFile(workBook, "T2_Essaie_2.xlsx");
    };

    return (
        <div className="ro">
            <h1>Regul des heures Odoo</h1>
            <div className="container">
                <aside>
                    <button>
                        <label htmlFor="import" className="import">
                            <input
                                type="file"
                                accept="xlsx, xls"
                                ref={fileRef}
                                name="import"
                                id="import"
                                onChange={(e) => handleFile(e)}
                            />
                            {file ? "Changer de fichier" : "Importer un fichier"}
                        </label>
                    </button>
                    <div className="container_coef">
                        <label htmlFor="coef">Modifier le coef Base Net : </label>
                        <input
                            type="number"
                            name="coef"
                            id="coef"
                            value={coef}
                            onChange={(e) => setCoef(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setNewData(cleanData(sheetData, sheetNames, coef))}>Re calculer</button>
                    <button onClick={handleExport}>Export</button>
                </aside>
                <article>
                    <section className="container_input header">
                        {/* <button>
                            <label htmlFor="import" className="import">
                                <input
                                    type="file"
                                    accept="xlsx, xls"
                                    ref={fileRef}
                                    name="import"
                                    id="import"
                                    onChange={(e) => handleFile(e)}
                                />
                                {file ? "Changer de fichier" : "Importer un fichier"}
                            </label>
                        </button> */}
                        {file && (
                            <div>
                                <p>{fileName}</p>
                                <div onClick={handleRemove} className="delete">
                                    <span>X</span>
                                </div>
                            </div>
                        )}
                    </section>
                    {/* <div>
                        <label htmlFor="coef">Modifier la valeur du coefficient Pour Base Net : </label>
                        <input
                            type="number"
                            name="coef"
                            id="coef"
                            value={coef}
                            onChange={(e) => setCoef(e.target.value)}
                        />
                    </div>
                    <div className="container_btns">
                        <button onClick={() => setNewData(cleanData(sheetData, sheetNames, coef))}>Re calculer</button>
                        <button onClick={handleExport}>Export</button>
                    </div> */}
                    <section className="previsualisation">
                        <div className="container_table">
                            {newData && (
                                <table>
                                    <thead>
                                        <tr>
                                            {Object.keys(newData[0]).map((d) => {
                                                return <th key={d}>{d}</th>;
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <>
                                            {newData.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{data["Agence"]}</td>
                                                        <td>{data["Clients"]}</td>
                                                        <td>{data["Manager"]}</td>
                                                        <td>{data["Nom EAD"]}</td>
                                                        <td>{data["Prénom EAD"]}</td>
                                                        <td>{data["Hrs total"]}</td>
                                                        <td>{data["Hrs travaillées"]}</td>
                                                        <td>{data["CP"]}</td>
                                                        <td>{data["Hrs supp"]}</td>
                                                        <td>{data["Base brut"]}</td>
                                                        <td>{data["Base net"]}</td>
                                                        <td>{data["Date"]}</td>
                                                        <td>{data["Montant"]}</td>
                                                        <td>{data["Commentaires"]}</td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
};

export default RegulOdoo;
