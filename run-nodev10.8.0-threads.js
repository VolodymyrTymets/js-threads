const {
	Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
const path = require('path');
const { getFilesInFolder } = require('./src/utils/file-reader');
const { writeToFile } = require('./src/utils/file-writer');

const decodeFiles = async (inFolder, outFolder) => {
	console.time('executing time');
	// 1 read all file inside of in folder
	const files = await getFilesInFolder(inFolder);

	const results = await Promise.all(files.map(({ filePath, fileName }) =>
		new Promise((resolve, reject) => {
			const worker = new Worker(path.resolve(__dirname, './src/utils/node.v10.8.0-fft-thread-worker.js'), {
				workerData: { filePath, fileName }
			});
			worker.on('message', resolve);
			worker.on('error', reject);
			worker.on('exit', (code) => {
				if (code !== 0)
					reject(new Error(`Worker stopped with exit code ${code}`));
			});
		})
	));

	results.forEach(({ fileName, filePath, splicedSpectrum }) => {
		// 4 write result ito out folder
		writeToFile(outFolder, fileName, splicedSpectrum);
	});

	console.timeEnd('executing time');
};

decodeFiles(path.resolve(__dirname, './assets/in'), path.resolve(__dirname, './assets/out'));

