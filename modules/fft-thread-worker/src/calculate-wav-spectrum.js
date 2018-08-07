const { decode } = require('./utils/decoder');
const { fft, spliceSpectrum } = require('./utils/fft');

const calculateWavSpectrum = (fileName, done) => {
	decode(fileName)
		.then(audioData => {
			const wave = audioData.channelData[0];
			const { spectrum } = fft(wave);
			const { splicedSpectrum } = spliceSpectrum(spectrum);
			done({ splicedSpectrum });
		})
		.catch(done);
};

module.exports = { calculateWavSpectrum };