const path = require('path')
const { getFilesInFolder } = require('./src/utils/file-reader');
const { FFTThreadWorker } = require('./src/FFT');
const { writeToFile } = require('./src/utils/file-writer');


const decodeFiles = async (inFolder, outFolder) => {
	console.time('read-files');
	// 1 read all file inside of in folder
	const files = await getFilesInFolder(inFolder);

	// for(let i=0; i < files.length; i++) {
	//
	// 	// const thread = spawn(function (input, done) {
	// 	// 	// 2 decode .wav to float array
	// 	// 	// 3 get spectrum by fff
	// 	// 	const { getWavSpectrum } = require('fft-thread-worker');
	// 	// 	getWavSpectrum(input.filePath, input.i, done);
	// 	// })
	// 	// 	.on('message', (response) => {
	// 	// 		const { splicedSpectrum, index } = response;
	// 	// 		thread.kill();
	// 	//
	// 	// 		if(index == files.length - 1) {
	// 	// 			console.timeEnd('read-files');
	// 	// 		}
	// 	// 	})
	// 	// 	.send({ filePath: files[i], i })
	// 	// 	.on('error', console.log)
	// 	// 	.on('exit', () => console.log('stopped!'));
	// 	const fftThreadWorker = new FFTThreadWorker();
	// 	const { splicedSpectrum, index }  = await fftThreadWorker.start(files[i], i)
	// }

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
	console.timeEnd('read-files');
};

decodeFiles(path.resolve(__dirname, './assets/in'), path.resolve(__dirname, './assets/out'));

