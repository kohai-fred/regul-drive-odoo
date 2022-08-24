/**
 *
 * @param {[String]} acceptableFile
 * @param {*} name
 * @returns {Booleans}
 */
const checkFileName = (acceptableFile, name) => {
    return acceptableFile.includes(name.split(".").pop().toLowerCase());
};

export default checkFileName;
