const jsonfile = require('jsonfile');
const path = require('path');

const writeToFile = (dirPath, fileName, data) => {
	const meanFilePath = path.resolve(dirPath, `${fileName}.json`);
	jsonfile.writeFileSync(meanFilePath, data);
};


module.exports = { writeToFile };

