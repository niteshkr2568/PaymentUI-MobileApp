const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        extraNodeModules: {
            "node:async_hooks": require('path').resolve(__dirname, 'src/mocks/async_hooks.js'),
            "async_hooks": require('path').resolve(__dirname, 'src/mocks/async_hooks.js'),
            "stream": require.resolve("readable-stream"),
            "net": require('path').resolve(__dirname, 'src/mocks/empty.js'),
            "tls": require('path').resolve(__dirname, 'src/mocks/empty.js'),
        },
        resolveRequest: (context, moduleName, platform) => {
            if (moduleName === 'ollama/browser') {
                return {
                    filePath: require('path').resolve(__dirname, 'node_modules/ollama/dist/browser.cjs'),
                    type: 'sourceFile',
                };
            }
            return context.resolveRequest(context, moduleName, platform);
        },
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
