const {
	isMainThread, parentPort, workerData
} = require('worker_threads');

const { decode } = require('./decoder');
const { fft, spliceSpectrum } = require('./fft');

if(isMainThread) {
	console.log('Only for second thread!!');
	proccess.exit();
}
const { filePath, fileName } = workerData;

decode(filePath).then(audioData => {
	// 3 get spectrum by fff
	const wave = audioData.channelData[0];
	const { spectrum } = fft(wave);
	const { splicedSpectrum } = spliceSpectrum(spectrum);
	console.log(`[${filePath}] processed`);

	parentPort.postMessage({ fileName, filePath, splicedSpectrum });
});
