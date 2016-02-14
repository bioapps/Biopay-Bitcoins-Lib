'use strict';

const expect = require('chai').expect;
const BtcNdef = require('../src/BtcNdef');
const Constants = require('../src/Constants');

describe('BtcNdef', () => {

	describe('#isBtcNdefRecord', () => {
		let record, identifier, password;

		beforeEach(() => {
			identifier = '12345-67890-123456';
			password = 'abc123!,.;:-_(){}';

			record = {
				type: 'T',
				id: [],
				payload: [],
				value: `${Constants.NdefIdentifier}${identifier}${Constants.SplitCharacter}${password}`
			};
		});

		it('should return true for btc ndef records', () => {
			const res = BtcNdef.isBtcNdefRecord(record);
			expect(res).to.be.true;
		});

		it('should return false when passed a falsy value', () => {
			expect(BtcNdef.isBtcNdefRecord()).to.be.false;
			expect(BtcNdef.isBtcNdefRecord(null)).to.be.false;
			expect(BtcNdef.isBtcNdefRecord(undefined)).to.be.false;
			expect(BtcNdef.isBtcNdefRecord(false)).to.be.false;
			expect(BtcNdef.isBtcNdefRecord(0)).to.be.false;
		});

		it('should return false if record doesn\'t have a type', () => {
			delete record.type;
			const res = BtcNdef.isBtcNdefRecord(record);
			expect(res).to.be.false;
		});

		it('should return false if record isn\'t the right type', () => {
			record.type = 'text/vCard';
			const res = BtcNdef.isBtcNdefRecord(record);
			expect(res).to.be.false;
		});

		it('should return false if record has no value', () => {
			delete record.value;
			const res = BtcNdef.isBtcNdefRecord(record);
			expect(res).to.be.false;
		});

		it('should return false if value is not proper btc ndef data', () => {
			record.value = 'Non btc data';
			const res = BtcNdef.isBtcNdefRecord(record);
			expect(res).to.be.false;
		});
	});


	describe('#createNdefRecord', () => {
		let credentials;
		beforeEach(() => {
			credentials = {
				identifier: '12345-67890-123456',
				password: 'abc123!,.;:-_(){}'
			};
		});

		it('should create a btc ndef record with credentials', () => {
			const record = BtcNdef.createNdefRecord(credentials);
			expect(record).to.be.an('object');
		});

		it('should throw an error if password is missing', () => {
			delete credentials.password;
			const fn = BtcNdef.createNdefRecord.bind(BtcNdef, credentials);
			expect(fn).to.throw(Error);
		});

		it('should throw an error if identifier is missing', () => {
			delete credentials.identifier;
			const fn = BtcNdef.createNdefRecord.bind(BtcNdef, credentials);
			expect(fn).to.throw(Error);
		});

		it('should pass true for #isBtcNdefRecord', () => {
			const identifier = 'foo';
			const password = 'bar';

			const record = BtcNdef.createNdefRecord({ identifier, password });
			const res = BtcNdef.isBtcNdefRecord(record);
			expect(res).to.be.true;
		});
	});


	describe('#getCredentialsFromNdefRecord', () => {
		let record, identifier, password;

		beforeEach(() => {
			identifier = '12345-67890-123456';
			password = 'abc123!,.;:-_(){}';
			record = {
				type: 'T',
				value: Constants.NdefIdentifier
			};
		});

		it('should return the credentials from a btc ndef record', () => {
			record = BtcNdef.createNdefRecord({ identifier, password });
			const credentials = BtcNdef.getCredentialsFromNdefRecord(record);
			expect(credentials.identifier).to.equal(identifier);
			expect(credentials.password).to.equal(password);
		});

		it('should throw an error if passed a falsy value', () => {
			expect(BtcNdef.createNdefRecord.bind(BtcNdef)).to.throw(Error);
			expect(BtcNdef.createNdefRecord.bind(BtcNdef, null)).to.throw(Error);
			expect(BtcNdef.createNdefRecord.bind(BtcNdef, undefined)).to.throw(Error);
			expect(BtcNdef.createNdefRecord.bind(BtcNdef, false)).to.throw(Error);
			expect(BtcNdef.createNdefRecord.bind(BtcNdef, 0)).to.throw(Error);
		});

		it('should throw an error if passed a non btc ndef record', () => {
			record.value = 'Non btc value';
			expect(BtcNdef.createNdefRecord.bind(BtcNdef, record)).to.throw(Error);
		});

		it('should throw an error if the btc record doesn\'t contain a split character', () => {
			record.value = `${Constants.NdefIdentifier}${identifier}${password}`;
			expect(BtcNdef.createNdefRecord.bind(BtcNdef, record)).to.throw(Error);
		});
	});
});
