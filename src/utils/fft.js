const { maxBy, findIndex, values } = require('lodash');
const fjs = require('frequencyjs');

function nearestPow2( aSize ){
	return Math.pow( 2, Math.round( Math.log( aSize ) / Math.log( 2 ) ) );
}

const spliceSpectrum = (spectrum, nweLength = 40) => {
	const maxSpectrum = maxBy(spectrum, s => s.amplitude);
	const maxIndex = findIndex(spectrum,
		s => s.amplitude === maxSpectrum.amplitude);

	const from = maxIndex - (nweLength / 2) || 0;
	const to = maxIndex + (nweLength / 2);

	const splicedSpectrum = spectrum.slice(from >= 0 ? from : 0, to);
	return { splicedSpectrum,  maxIndex };
};


const fft = (wave) => {
	let waveLength = wave.length;
	let index = nearestPow2(waveLength);

	while (!(index <= wave.length)) {
		waveLength = waveLength - 2;
		index = nearestPow2(waveLength);
	}

	const cutedWave = wave.slice(0, index);
	const spectrum = fjs.Transform.toSpectrum(cutedWave, { method: 'fft'} );
	return { wave: values(cutedWave), spectrum };
};

module.exports = { fft, spliceSpectrum };
