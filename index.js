/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;
global.process = require('process');

// Apply standardized polyfills for LangChain/Hermes
// These replace manual TextEncoder, ReadableStream, and most importantly, fetch (to support streaming)
require('react-native-polyfill-globals/auto');

// Polyfill AbortSignal.throwIfAborted (Method missing in older RN environments)
// We place this AFTER other polyfills in case they redefine AbortSignal
if (typeof AbortSignal !== 'undefined' && !AbortSignal.prototype.throwIfAborted) {
    AbortSignal.prototype.throwIfAborted = function () {
        if (this.aborted) {
            throw this.reason;
        }
    };
}

if (typeof Symbol.asyncIterator === 'undefined') {
    Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
}

if (typeof navigator === 'undefined') {
    global.navigator = {
        userAgent: 'ReactNative',
        product: 'ReactNative',
        platform: 'ReactNative',
        language: 'en-US',
        languages: ['en-US'],
        onLine: true,
    };
} else {
    // Ensure properties exist if navigator is already defined
    if (!navigator.userAgent) navigator.userAgent = 'ReactNative';
    if (!navigator.product) navigator.product = 'ReactNative';
    if (!navigator.platform) navigator.platform = 'ReactNative';
}

if (typeof location === 'undefined') {
    global.location = {
        href: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '80',
        pathname: '/',
        search: '',
        hash: '',
        assign: () => { },
        reload: () => { },
        replace: () => { },
    };
}

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
