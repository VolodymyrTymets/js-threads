const path = require('path')
const { getFilesInFolder } = require('./src/utils/file-reader');
const { FFTThreadWorker } = require('./src/FFT');
const { writeToFile } = require('./src/utils/file-writer');


const decodeFiles = async (inFolder, outFolder) => {
	console.time('executing time');
	// 1 read all file inside of in folder
	const files = await getFilesInFolder(inFolder);

	const results = await Promise.all(
		files.map(({ filePath, fileName }) =>
			new FFTThreadWorker({ fileName, filePath }).start(filePath)));

	results.forEach(({
		 payload: { fileName, filePath  },
		 response: { splicedSpectrum }
	}) => {
		// 4 write result ito out folder
		writeToFile(outFolder, fileName, splicedSpectrum);
		console.log(`[${filePath}] processed`);
	});
	console.timeEnd('executing time');
};

decodeFiles(path.resolve(__dirname, './assets/in'), path.resolve(__dirname, './assets/out'));

