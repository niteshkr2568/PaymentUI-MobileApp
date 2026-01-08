
// Stub for node:async_hooks
module.exports = {
    AsyncLocalStorage: class AsyncLocalStorage {
        run(store, callback, ...args) {
            return callback(...args);
        }
        getStore() {
            return undefined;
        }
    }
};
