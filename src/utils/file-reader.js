const fs = require('fs');
const path = require('path');


const getFilesInFolder = (folderPath) => new Promise((resolve, reject) => {
	fs.readdir(folderPath, (err, files) => {
		if (err) reject();
		const res = [];
		for (let i = 0; i < files.length; i++) {
			res.push({ fileName: files[i], filePath: path.resolve(folderPath, files[i]) });
		}
		resolve(res);
	});
});


module.exports = { getFilesInFolder };