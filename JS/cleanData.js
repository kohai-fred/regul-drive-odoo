export const cleanData = (data, sheetNames, coef) => {
    const copyData = structuredClone(data[`${sheetNames}`]);
    const reduceByName = groupByName(copyData);
    const newData = test(reduceByName, coef);

    return newData;
};

function test(reduceByName, coef) {
    const newData = [];

    for (const item in reduceByName) {
        const user = reduceByName[item];
        const { element, userName } = groupByPartenaire(user);

        for (const item in element[userName]) {
            const p = structuredClone(element[userName][item]);
            const partenaire = {
                Agence: p.Agence,
                Clients: p["Entrées congés/Partenaire"],
                Manager: p["Responsable RH"],
                ["Nom EAD"]: p["Employé/Nom"],
                ["Prénom EAD"]: p["Employé/Prénom"],
                ["Hrs total"]: (p["Total d'heures"] = +p["Total d'heures"].toFixed(2)),
                ["Hrs travaillées"]: "",
                CP: "",
                ["Hrs supp"]: "",
                ["Base brut"]: p["Salaire horaire brut hors CP"],
                ["Base net"]: +(p["Salaire horaire brut hors CP"] * coef).toFixed(2),
                Date: "",
                Montant: 0,
                Commentaires: "",
            };
            newData.push(partenaire);
        }
    }
    console.log("🚀 ~ file: cleanData.js ~ line 24 ~ test ~ newData", newData);
    console.log("🚀 ~ file: cleanData.js ~ line 24 ~ test ~ newData", Object.keys(newData[0]));
    return newData;
}

function groupByName(data) {
    const reduceByName = data.reduce((acc, current) => {
        const nom = current["Employé/Nom"];
        if (!nom) return acc;
        if (!acc[nom]) {
            acc[nom] = [current];
            return acc;
        } else {
            acc[nom].push(current);
            return acc;
        }
    }, {});
    return reduceByName;
}

function groupByPartenaire(user) {
    let partenaireName, userName;
    const element = user.reduce((acc, current) => {
        partenaireName = current["Entrées congés/Partenaire"];
        userName = current["Employé/Nom"];
        if (!acc[userName]) {
            acc[userName] = { [partenaireName]: current };
            return acc;
        } else if (!acc[userName][partenaireName]) {
            acc[userName][partenaireName] = current;
            return acc;
        } else {
            acc[userName][partenaireName]["Heures normales"] += current["Heures normales"];
            acc[userName][partenaireName]["Total d'heures"] += current["Total d'heures"];
            return acc;
        }
    }, {});

    return { element, userName };
}
