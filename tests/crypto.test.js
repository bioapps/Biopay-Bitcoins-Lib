'use strict';

const expect = require('chai').expect;
const Crypto = require('../src/Crypto');

const publicKey = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALAuAVkF+BpQtsivA/Cdwn64xEDQxuHB\n6zdB5/EVT4B2zeqZu4XO3zX+Ua2M641hGjqG0pcuovraVJLrFu0MFLMCAwEAAQ==\n-----END PUBLIC KEY-----';
const privateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBALAuAVkF+BpQtsivA/Cdwn64xEDQxuHB6zdB5/EVT4B2zeqZu4XO\n3zX+Ua2M641hGjqG0pcuovraVJLrFu0MFLMCAwEAAQJAe5/cnD4/CSAoEowUpKve\nxZMbSyv00oeDaOPbQGUmw0nve7F44sMiBVR5I95meurAwaCIiWNXYGZwvxp/55W6\nAQIhAOSYCHtZvYzA1vQZoZiLV1KmoJ1v6m7SjDD4tbdILJcBAiEAxU1I5VfT/nUv\nNkvwCCTc3OycKa+s/R65zjiy/9P1f7MCIQCeLm5AHRtDWPXluA7QZiuo79DY4ObS\nhTOpd5EXIQRqAQIgAi03F6ifYxhB3BR8YmqdsSY/FsqkWuqC3D6N4vqgo7cCID3R\nF5pQiWKAW+abSTxhsChJPNVVZbIX1VR7zyY0kAAK\n-----END RSA PRIVATE KEY-----';


describe('Crypto', () => {
	let crypto, credentials, tagId;

	beforeEach(() => {
		crypto = new Crypto({ publicKey, privateKey });
		credentials = {
			identifier: '285e2f22-ea22-4322-9492-32bbbb24b3d4',
			password: 'fuubar-.,1423'
		};
		tagId = '1234123-125124';
	});

	it('should return the original text when first encrypting it and then decrypting the result', () => {
		const text = 'Encryption test string 123!@;:{}';
		const encrypted = crypto.encrypt(text);
		const decrypted = crypto.decrypt(encrypted);

		expect(text).to.equal(decrypted);
	});

	it('should be able to encrypt wallet credentials', () => {
		const encrypted = crypto.encryptWalletCredentials(credentials, tagId);
		expect(encrypted).to.be.a('string');
	});

	it('should be able to decrypt encrypted wallet crdentials', () => {
		const encrypted = crypto.encryptWalletCredentials(credentials, tagId);
		const decrypted = crypto.decryptWalletCredentials(encrypted, tagId);

		expect(decrypted).to.be.an('object');
		expect(decrypted.identifier).to.equal(credentials.identifier);
		expect(decrypted.password).to.equal(credentials.password);
	});

	it('should throw an error if the tag id sent to decryptWalletCredentials is not the same as it was encrypted with', () => {
		const wrongId = '1234123-125123';
		const encrypted = crypto.encryptWalletCredentials(credentials, tagId);

		expect(crypto.decryptWalletCredentials.bind(crypto, encrypted, wrongId)).to.throw(Error);
	});

	it('should throw an error when trying to encrypt without being instansiated with a public key', () => {
		crypto = new Crypto({ privateKey });
		const text = 'Testtexttoencrypt';

		expect(crypto.encrypt.bind(crypto, text)).to.throw(Error);
	});

	it('should throw an error when trying to decrypt without being instansiated with a private key', () => {
		crypto = new Crypto({ publicKey });
		const text = 'Testtexttoencrypt';
		const encrypted = crypto.encrypt(text); 

		expect(crypto.decrypt.bind(crypto, encrypted)).to.throw(Error);
	});
});
