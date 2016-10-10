/* eslint-env node, mocha */
'use strict';

const assert = require('chai').assert
    , subject = require('./socketHandler')
    , events = require('harken');

describe('WebSocket handler Tests', () => {
    // NOTE: These test cover the moving parts of the web socket setup
    //  they don't cover the actual web socket server itself, that module
    //  is maintained outside the code base and should be tested independently
    //  but this is a nice comprimise.

    describe('Web Socket Handler Type: false tests', () => {
        const handler = subject(false);

        afterEach(() => {
            events.off('data:set:test');
            events.off('data:get:test');
            events.off('some:event');
        });

        it('should be a function and return a function', () => {
            assert.isFunction(subject);
            assert.isFunction(subject(false));
        });

        it('should not emit events for data event messages', () => {
            const socket = {};

            handler(socket);

            socket.onmessage({
                data: `{ "event": "data:get:test" }`
            });

            assert.isUndefined(events.listeners('data:set:test'));
        });

        it('should not emit events for non-data event messages', (done) => {
            const socket = {};

            handler(socket);
            events.on('some:event', (data) => {
                if (typeof data === 'undefined') {
                    assert.strictEqual(true, false);
                } else {
                    done();
                }
            });

            socket.onmessage({
                data: `{ "event": "some:event" }`
            });

            setTimeout(() => {
                events.emit('some:event', true);
            }, 0);
        });
    });

    describe('Web Socket Handler Type: true tests', () => {
        const handler = subject(true);

        afterEach(() => {
            events.off('data:set:test');
            events.off('data:get:test');
        });

        it('should be a function and return a function', () => {
            assert.isFunction(subject);
            assert.isFunction(subject(true));
        });

        it('should emit events for data event messages', (done) => {
            const socket = {};

            events.once('data:get:test', (test) => {
                assert.isUndefined(test);
                done();
            });

            handler(socket);

            socket.onmessage({
                data: `{ "event": "data:get:test" }`
            });
        });

        it('should pass message and socket through to data new events', (done) => {
            const socket = {};

            handler(socket);

            events.once('data:new:person', (data) => {
                assert.isObject(data);
                assert.isObject(data.message);
                assert.isObject(data.message.payload);
                assert.isObject(data.socket);
                assert.strictEqual(socket, data.socket);
                assert.strictEqual(data.message.event, 'data:new:person');
                done();
            });

            socket.onmessage({
                data: `{ "event": "data:new:person", "payload": { "name": "daniel" } }`
            });
        });

        it('should emit events for non-data event messages', (done) => {
            const socket = {};

            handler(socket);

            events.once('some:event', () => {
                assert.strictEqual(true, true);
                done();
            });

            socket.onmessage({
                data: `{ "event": "some:event" }`
            });
        });

        it('should pass the message and socket through to passthrough events', (done) => {
            const socket = {};

            handler(socket);

            events.once('some:event', (data) => {
                assert.isObject(data);
                assert.isObject(data.message);
                assert.isObject(data.socket);
                assert.strictEqual(socket, data.socket);
                assert.strictEqual(data.message.event, 'some:event');
                done();
            });

            socket.onmessage({
                data: `{ "event": "some:event" }`
            });
        });
    });

    describe('Web Socket Handler Type: data tests', () => {
        const handler = subject('data');

        afterEach(() => {
            events.off('data:set:test');
            events.off('data:get:test');
        });

        it('should be a function and return a function', () => {
            assert.isFunction(subject);
            assert.isFunction(subject('data'));
        });

        it('should emit events for data event messages', (done) => {
            const socket = {};

            events.once('data:get:test', (test) => {
                assert.isUndefined(test);
                done();
            });

            handler(socket);

            socket.onmessage({
                data: `{ "event": "data:get:test" }`
            });
        });

        it('should not emit events for non-data event messages', () => {
            const socket = {};

            handler(socket);

            socket.onmessage({
                data: `{ "event": "some:event" }`
            });

            assert.strictEqual(events.listeners('some:event').length, 0);
        });
    });

    describe('Web Socket Handler Type: passthrough tests', () => {
        const handler = subject('passthrough');

        afterEach(() => {
            events.off('data:set:test');
            events.off('data:get:test');
        });

        it('should be a function and return a function', () => {
            assert.isFunction(subject);
            assert.isFunction(subject('passthrough'));
        });

        it('should not emit events for data event messages', () => {
            const socket = {};

            handler(socket);

            socket.onmessage({
                data: `{ "event": "data:get:test" }`
            });

            assert.strictEqual(events.listeners('data:set:test').length, 0);
        });

        it('should emit events for non-data event messages', (done) => {
            const socket = {};

            handler(socket);

            events.once('some:event', () => {
                assert.strictEqual(true, true);
                done();
            });

            socket.onmessage({
                data: `{ "event": "some:event" }`
            });
        });

        it('should pass the message and socket through to passthrough events', (done) => {
            const socket = {};

            handler(socket);

            events.once('some:event', (data) => {
                assert.isObject(data);
                assert.isObject(data.message);
                assert.isObject(data.socket);
                assert.strictEqual(socket, data.socket);
                assert.strictEqual(data.message.event, 'some:event');
                done();
            });

            socket.onmessage({
                data: `{ "event": "some:event" }`
            });
        });

        it('should pass message and socket through to data new events', (done) => {
            const socket = {};

            handler(socket);

            events.once('data:new:person', (data) => {
                assert.isObject(data);
                assert.isObject(data.message);
                assert.isObject(data.message.payload);
                assert.isObject(data.socket);
                assert.strictEqual(socket, data.socket);
                assert.strictEqual(data.message.event, 'data:new:person');
                done();
            });

            socket.onmessage({
                data: `{ "event": "data:new:person", "payload": { "name": "daniel" } }`
            });
        });
    });
});
