export const cleanData = (data, sheetNames) => {
    const copyData = structuredClone(data[`${sheetNames}`]);
    const reduceByName = groupByName(copyData);
    const newData = test(reduceByName);

    return newData;
};

function test(reduceByName) {
    const newData = [];
    for (const item in reduceByName) {
        const user = reduceByName[item];
        const { element, userName } = groupByPartenaire(user);

        for (const item in element[userName]) {
            const partenaire = element[userName][item];
            partenaire["Heures normales"] = +partenaire["Heures normales"].toFixed(2);
            partenaire["Total d'heures"] = +partenaire["Total d'heures"].toFixed(2);
            newData.push(partenaire);
        }
    }
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
