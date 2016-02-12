'use strict';

const ndef = require('ndef');
const Constants = require('./Constants');

const BtcNdef = {

	isBtcNdefRecord(ndefRecord) {
		if (ndefRecord.type !== 'T') {
			return false;
		}

		const value = ndefRecord.value;
		if (!value) {
			return false;
		}

		const identifier = value.toLowerCase().substr(0, Constants.NdefIdentifier.length);
		if (identifier !== Constants.NdefIdentifier) {
			return false;
		}

		return true;
	},

	getCredentialsFromNdefRecord(ndefRecord) {
		if (!BtcNdef.isBtcNdefRecord(ndefRecord)) {
			throw Error('Ndef record is not a BtcNdefRecord.');
		}

		const content = ndefRecord.value.substr(Constants.NdefIdentifier.length);

		let firstSplitCharater = content.indexOf(Constants.SplitCharacter);
		if (firstSplitCharater === -1) {
			firstSplitCharater = content.length;
		}

		const identifier = content.substr(0, firstSplitCharater);
		const password = content.substr(firstSplitCharater + 1);

		return {
			identifier,
			password
		};
	},

	createNdefRecord(credentials/*, crypto, tagId */) {
		if (!credentials.identifier || !credentials.password) {
			throw Error('Credentials must contain "identifier" and "password".');
		}

		const message = 
			Constants.NdefIdentifier +
			credentials.identifier +
			Constants.SplitCharacter +
			credentials.password;

		return ndef.textRecord(message);
	}
};

module.exports = BtcNdef;
