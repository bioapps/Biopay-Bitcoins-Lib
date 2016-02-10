'use strict';

const expect = require('chai').expect;
const BitcoinUtils = require('../src/BitcoinUtils');

describe('BitcoinUtils', () => {

	it('should transform bitcoin to satoshi', () => {
		expect(BitcoinUtils.btcToSatoshi(1)).to.equal(100000000);
		expect(BitcoinUtils.btcToSatoshi(0.00263123)).to.equal(263123);
		expect(BitcoinUtils.btcToSatoshi(0.03735859)).to.equal(3735859);
		expect(BitcoinUtils.btcToSatoshi(0.0013508767189906248)).to.equal(135088);
	});

	it('should transform satoshi to bitcoin', () => {
		expect(BitcoinUtils.satoshiToBtc(1)).to.equal(0.00000001);
		expect(BitcoinUtils.satoshiToBtc(72061920)).to.equal(0.72061920);
		expect(BitcoinUtils.satoshiToBtc(88854761)).to.equal(0.88854761);
	});
});
