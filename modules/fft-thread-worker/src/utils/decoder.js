const fs = require('fs');
const WavDecoder = require('wav-decoder');

const decode = filePath => {
	const readFile = filepath => {
		return new Promise((resolve, reject) => {
			setTimeout(function () {
				fs.readFile(filepath, (err, buffer) => {
					if (err) {
						return reject(err);
					}
					return resolve(buffer);
				});
			}, 500)
		});
	};

	return readFile(filePath).then((buffer) => {
		return WavDecoder.decode(buffer);
	});
};

module.exports = { decode };