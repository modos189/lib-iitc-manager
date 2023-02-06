// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3

import { describe, it } from 'mocha';
import { check_matching } from '../src/matching.js';
import { expect } from 'chai';

describe('scheme', function () {
    it('should match all', function () {
        const script = {
            match: ['*://*/*'],
        };
        expect(check_matching(script, 'https://intel.ingress.com/'), 'should match').to.be.true;
        expect(check_matching(script, 'http://example.com/'), 'should match').to.be.true;
    });
    it('should match exact', function () {
        const script = {
            match: ['http://*/*'],
        };
        expect(check_matching(script, 'https://intel.ingress.com/'), 'should not match `https`').to.be.false;
        expect(check_matching(script, 'http://example.com/'), 'should match `http`').to.be.true;
        expect(check_matching(script, 'https://example.com/'), 'should not match `https`').to.be.false;
    });
});

describe('host', function () {
    it('should match domain', function () {
        const script = {
            match: ['*://www.example.com/'],
        };
        expect(check_matching(script, 'http://www.example.com/'), 'should match').to.be.true;
        expect(check_matching(script, 'http://sub.www.example.com/'), 'should not match subdomains').to.be.false;
        expect(check_matching(script, 'http://www.example.net/'), 'should not match another domains').to.be.false;
    });
    it('should match subdomains', function () {
        const script = {
            match: ['*://*.example.com/'],
        };
        expect(check_matching(script, 'http://www.example.com/'), 'should match subdomains').to.be.true;
        expect(check_matching(script, 'http://a.b.example.com/'), 'should match subdomains').to.be.true;
        expect(check_matching(script, 'http://example.com/'), 'should match specified domain').to.be.true;
        expect(check_matching(script, 'http://www.example.net/'), 'should not match another domains').to.be.false;
    });
});

describe('path', function () {
    it('should match any', function () {
        const script = {
            match: ['http://www.example.com/*'],
        };
        expect(check_matching(script, 'http://www.example.com/'), 'should match `/`').to.be.true;
        expect(check_matching(script, 'http://www.example.com/api/'), 'should match any').to.be.true;
    });
    it('should match exact', function () {
        const script = {
            match: ['http://www.example.com/a/b/c'],
        };
        expect(check_matching(script, 'http://www.example.com/a/b/c'), 'should match exact').to.be.true;
        expect(check_matching(script, 'http://www.example.com/a/b/c/d'), 'should not match').to.be.false;
    });
});

describe('include', function () {
    it('should include any', function () {
        const script = {
            include: ['*'],
        };
        expect(check_matching(script, 'https://www.example.com/'), 'should match `http | https`').to.be.true;
    });
    it('should include by regexp', function () {
        const script = {
            match: ['http://www.example.com/*', 'http://www.example2.com/*'],
        };
        expect(check_matching(script, 'http://www.example.com/'), 'should match `/`').to.be.true;
        expect(check_matching(script, 'http://www.example2.com/data/'), 'include by prefix').to.be.true;
        expect(check_matching(script, 'http://www.example3.com/'), 'should not match').to.be.false;
    });
});

describe('exclude', function () {
    it('should exclude any', function () {
        const script = {
            match: ['*://*/*'],
            exclude: ['*'],
        };
        expect(check_matching(script, 'https://www.example.com/'), 'should exclude `http | https`').to.be.false;
    });
    it('should include by regexp', function () {
        const script = {
            match: ['*://*/*'],
            exclude: ['http://www.example.com/*', 'http://www.example2.com/*'],
        };
        expect(check_matching(script, 'http://www.example.com/'), 'should exclude `/`').to.be.false;
        expect(check_matching(script, 'http://www.example2.com/data/'), 'exclude by prefix').to.be.false;
        expect(check_matching(script, 'http://www.example3.com/'), 'not exclude by prefix').to.be.true;
    });
});

describe('exclude-match', function () {
    it('should exclude any', function () {
        const script = {
            match: ['*://*/*'],
            'exclude-match': ['*://*/*'],
        };
        expect(check_matching(script, 'https://www.example.com/'), 'should exclude `http | https`').to.be.false;
    });
    it('should include by regexp', function () {
        const script = {
            match: ['*://*/*'],
            'exclude-match': ['http://www.example.com/*', 'http://www.example2.com/*'],
        };
        expect(check_matching(script, 'http://www.example.com/'), 'should exclude `/`').to.be.false;
        expect(check_matching(script, 'http://www.example2.com/data/'), 'exclude by prefix').to.be.false;
        expect(check_matching(script, 'http://www.example3.com/'), 'not exclude by prefix').to.be.true;
    });
});
