const path = require('path')
const { getFilesInFolder } = require('./src/utils/file-reader');
const { decode } = require('./src/utils/decoder');
const { fft, spliceSpectrum } = require('./src/utils/fft');
const { writeToFile } = require('./src/utils/file-writer');

const decodeFiles = async (inFolder, outFolder) => {
	console.time('read-files');
	// 1 read all file inside of in folder
	const files = await getFilesInFolder(inFolder);

  let processed = 0;
	// 2 decode .wav to float array
	for(let i=0; i < files.length; i++) {
		decode(files[i].filePath).then(audioData => {
			// 3 get spectrum by fff
			const wave = audioData.channelData[0];
			const { spectrum } = fft(wave);
			const { splicedSpectrum } = spliceSpectrum(spectrum);

			// 4 write result ito out folder
			writeToFile(outFolder, files[i].fileName, splicedSpectrum);
			console.log(`[${files[i].filePath}] processed`);
			processed ++;
			if (processed === files.length) {
				console.timeEnd('read-files');
			}
		});
	}
};

decodeFiles(path.resolve(__dirname, './assets/in'), path.resolve(__dirname, './assets/out'));

