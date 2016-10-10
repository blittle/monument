/* eslint-env node, mocha */
'use strict';

const assert = require('chai').assert
    , gulpfile = require('./gulpfile');

describe('gulpfile tests', () => {

    it('should have an "incrementVersion" function', () => {
        assert.isFunction(gulpfile.incrementVersion);
    });

    it('should increment only patch when incrementing patch', () => {
        assert.strictEqual('1.2.4', gulpfile.incrementVersion('1.2.3', 'patch'));
    });

    it('should increment minor and roll patch when incrementing minor', () => {
        assert.strictEqual('1.3.0', gulpfile.incrementVersion('1.2.3', 'minor'));
    });

    it('should increment major and roll minor and patch when incrementing major', () => {
        assert.strictEqual('2.0.0', gulpfile.incrementVersion('1.2.3', 'major'));
    });
});
