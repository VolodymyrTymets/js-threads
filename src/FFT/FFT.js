const spawn = require('threads').spawn;

class FFTThreadWorker {
	constructor(payload) {
		this.start = this.start.bind(this);
		this.log = this.log.bind(this);
		this._payload = payload;
	}

	log(message) {
		// console.log(`-> [FFTThreadWorker]: ${message.message || message}`);
	}

	start(filePath) {
		return new Promise((resolve, reject) => {
			const thread = spawn(function (input, done) {
				const { calculateWavSpectrum } = require('fft-thread-worker');
				calculateWavSpectrum(input.filePath, done);
			})
				.send({ filePath })
				.on('message', (response) => {
					thread.kill();
					resolve({ payload: this._payload, response });
				})
				.on('error', reject)
				.on('exit', () => this.log('stopped!'));
		})
	}
}

// const fftThreadWorker = new FFTThreadWorker();
module.exports = { FFTThreadWorker };