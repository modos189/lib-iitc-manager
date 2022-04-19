//@license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3

import { describe, it } from 'mocha';
import * as helpers from '../src/helpers.js';
import { expect } from 'chai';


describe('parseMeta', function() {

    it('without arguments', function() {
        expect(helpers.parseMeta()).to.be.undefined;
    });

    const data1 = "// ==UserScript==\n" +
        "// @author         Hollow011\n" +
        "// @name           IITC plugin: Available AP statistics\n" +
        "// @category       Info\n" +
        "// @version        0.4.1\n" +
        "// @description    Displays the per-team AP gains available in the current view.\n" +
        "// @id             ap-stats\n" +
        "// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion\n" +
        "// @match          https://intel.ingress.com/*\n" +
        "// @grant          none\n" +
        "// ==/UserScript==";

    const expected1 = {
        author: 'Hollow011',
        name: 'Available AP statistics',
        category: 'Info',
        version: '0.4.1',
        description: 'Displays the per-team AP gains available in the current view.',
        id: 'ap-stats',
        namespace: 'https://github.com/IITC-CE/ingress-intel-total-conversion',
        match: [ 'https://intel.ingress.com/*' ],
        grant: [ 'none' ]
    };

    context('test data1', function() {
        it('has expected number of keys', function() {
            expect(Object.keys(helpers.parseMeta(data1)).length).to.equal(Object.keys(expected1).length);
        })
        it('has expected keys and values', function() {
            expect(helpers.parseMeta(data1)).to.deep.equal(expected1);
        })
    });

});



describe('ajaxGet', function() {

    it('download UserScript', async function() {
        expect(await helpers.ajaxGet("http://localhost:31606/release/total-conversion-build.meta.js")).to.include('==UserScript==');
    });

});



describe('getUniqId', function() {

    it('without arguments', function() {
        expect(helpers.getUniqId()).to.include('VM');
    });

    context('with argument tmp', function() {
        it('has expected text "tmp"', function() {
            expect(helpers.getUniqId("tmp")).to.include('tmp');
        });
        it('is random value', function() {
            expect(helpers.getUniqId("tmp")).to.not.equal(helpers.getUniqId("tmp"));
        });
    });

});



describe('getUID', function() {

    it('empty object', function() {
        expect(helpers.getUID({})).to.be.null;
    });

    it('simply plugin', function() {
        expect(helpers.getUID({
            name: 'Available AP statistics',
            namespace: 'https://github.com/IITC-CE/ingress-intel-total-conversion'
        })).to.equal("Available AP statistics+https://github.com/IITC-CE/ingress-intel-total-conversion");
    });

    it('another plugin', function() {
        expect(helpers.getUID({
            id: 'ap-stats',
            namespace: 'https://github.com/IITC-CE/ingress-intel-total-conversion'
        })).to.equal("ap-stats+https://github.com/IITC-CE/ingress-intel-total-conversion");
    });

    it('Plugin with incorrect meta header', function() {
        expect(helpers.getUID({
            id: 'ap-stats'
        })).to.be.null;
    });

});



describe('check_url_match_pattern', function() {

    context('domain = <all>', function() {
        it('variant 1', function() {
            expect(helpers._check_url_match_pattern("http://ingress.com", "<all>")).to.be.false;
        });

        it('variant 2', function() {
            expect(helpers._check_url_match_pattern("https://ingress.com/intel", "<all>")).to.be.true;
        });

        it('variant 3', function() {
            expect(helpers._check_url_match_pattern("https://missions.ingress.com/", "<all>")).to.be.true;
        });
    });

    context('domain = intel.ingress.com', function() {
        it('variant 1', function() {
            expect(helpers._check_url_match_pattern("http://ingress.com", "intel.ingress.com")).to.be.false;
        });

        it('variant 2', function() {
            expect(helpers._check_url_match_pattern("https://ingress.com/intel", "intel.ingress.com")).to.be.true;
        });

        it('variant 3', function() {
            expect(helpers._check_url_match_pattern("https://intel.ingress.com", "intel.ingress.com")).to.be.false;
        });

        it('variant 4', function() {
            expect(helpers._check_url_match_pattern("https://intel.ingress.com/intel", "intel.ingress.com")).to.be.true;
        });
    });

    context('missions.ingress.com', function() {
        it('variant 1', function() {
            expect(helpers._check_url_match_pattern("http://ingress.com", "missions.ingress.com")).to.be.false;
        });

        it('variant 2', function() {
            expect(helpers._check_url_match_pattern("https://ingress.com/missions", "missions.ingress.com")).to.be.false;
        });

        it('variant 3', function() {
            expect(helpers._check_url_match_pattern("https://missions.ingress.com", "missions.ingress.com")).to.be.false;
        });

        it('variant 4', function() {
            expect(helpers._check_url_match_pattern("https://missions.ingress.com/*", "missions.ingress.com")).to.be.true;
        });
    });

});



describe('check_meta_match_pattern', function() {

    context('domain = <all>', function() {
        it('variant 1', function() {
            expect(helpers.check_meta_match_pattern({"match": ["http://ingress.com"]}, "<all>")).to.be.false
        });

        it('variant 2', function() {
            expect(helpers.check_meta_match_pattern({"match": ["http://ingress.com", "https://ingress.com/intel"]}, "<all>")).to.be.true
        });
    });

    context('domain = intel.ingress.com', function() {
        it('variant 1', function() {
            expect(helpers.check_meta_match_pattern({"match": ["https://missions.ingress.com"]}, "intel.ingress.com")).to.be.false
        });

        it('variant 2', function() {
            expect(helpers.check_meta_match_pattern({"match": ["http://ingress.com", "https://ingress.com/intel"]}, "intel.ingress.com")).to.be.true
        });
    });

});



describe('wait', function() {

    it('timer works', async function() {
        let time = performance.now();

        await helpers.wait(0.1);

        time = performance.now() - time;
        expect(time).to.be.closeTo(100, 15);
    });

});
