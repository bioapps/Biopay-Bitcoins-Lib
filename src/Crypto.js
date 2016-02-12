'use strict';

const NodeRSA = require('node-rsa');
const Constants = require('./Constants');

const baseConfig = {
	publicKey: null,
	privateKey: null
};

module.exports = class Crypto {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		if (this.config.privateKey) {
			this.privateKey = new NodeRSA(this.config.privateKey);
		}

		if (this.config.publicKey) {
			this.publicKey = new NodeRSA(this.config.publicKey);
		}
	}

	encrypt(clearText) {
		if (!this.publicKey) {
			throw new Error('Crypto doesn\'t have a public key to encrypt with.');
		}

		return this.publicKey.encrypt(clearText, 'base64');
	}

	decrypt(cryptMessage) {
		if (!this.privateKey) {
			throw new Error('Crypto doesn\'t have a private key to decrypt with.');
		}

		return this.privateKey.decrypt(cryptMessage, 'utf8');
	}


	decryptWalletCredentials(cryptMessage, tagId/*, pinCode*/) {
		let clearText = this.decrypt(cryptMessage);

		// Validate
		if (!this.isValid(clearText, tagId)) {
			throw new Error('Crypted text does not contain a valid salt');
		}

		clearText = this.removeSalt(clearText, tagId);
		const firstSplitCharacter = clearText.indexOf(Constants.SplitCharacter);

		return {
			identifier: clearText.substr(0, firstSplitCharacter),
			password: clearText.substr(firstSplitCharacter + 1)
		};
	}

	encryptWalletCredentials(credentials, tagId/*, pinCode*/) {
		const salt = tagId;
		const credentialsMessage = credentials.identifier + Constants.SplitCharacter + credentials.password;
		const cryptMessage = this.addSalt(credentialsMessage, salt);

		return this.encrypt(cryptMessage);
	}

	addSalt(text, salt) {
		return salt + text;
	}

	removeSalt(clearText, salt) {
		return clearText.substr(salt.length);
	}

	isValid(clearText, salt) {
		return clearText.indexOf(salt) === 0;
	}
};
