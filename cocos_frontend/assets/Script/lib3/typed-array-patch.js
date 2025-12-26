/**
 * Critical TypedArray Compatibility Patch
 * ========================================
 * This patch MUST be loaded BEFORE any library that uses TypedArray spread operations.
 *
 * Problem: Some transpilers/bundlers convert `[...uint8Array]` into `[].concat(uint8Array)`.
 * Array#concat does NOT expand TypedArray elements - it treats the TypedArray as a single
 * element, corrupting byte sequences used in cryptographic operations (signatures, hashes, etc.).
 *
 * Solution: Override Array.prototype.concat to detect TypedArray arguments and properly
 * expand them into individual byte values.
 */
(function() {
    'use strict';

    var g = (typeof globalThis !== 'undefined') ? globalThis
          : (typeof window !== 'undefined') ? window
          : (typeof self !== 'undefined') ? self
          : {};

    // Prevent double-patching
    if (g.__typedArrayConcatPatchApplied) return;
    g.__typedArrayConcatPatchApplied = true;

    var originalConcat = Array.prototype.concat;

    function isTypedArray(v) {
        if (!v || typeof v !== 'object') return false;
        if (typeof ArrayBuffer === 'undefined') return false;
        if (typeof ArrayBuffer.isView !== 'function') return false;
        if (!ArrayBuffer.isView(v)) return false;
        // DataView is ArrayBuffer.isView but not a TypedArray
        if (typeof DataView !== 'undefined' && v instanceof DataView) return false;
        return true;
    }

    function typedArrayToArray(ta) {
        var len = ta.length;
        var out = new Array(len);
        for (var i = 0; i < len; i++) {
            out[i] = ta[i] & 0xff;
        }
        return out;
    }

    Array.prototype.concat = function() {
        var receiver = this;
        var args = [];
        var needsConversion = false;

        // Check if receiver is TypedArray
        if (isTypedArray(receiver)) {
            receiver = typedArrayToArray(receiver);
            needsConversion = true;
        }

        // Process arguments
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (isTypedArray(arg)) {
                args.push(typedArrayToArray(arg));
                needsConversion = true;
            } else {
                args.push(arg);
            }
        }

        if (needsConversion) {
            return originalConcat.apply(receiver, args);
        }

        return originalConcat.apply(this, arguments);
    };

    // Also patch Array.from to ensure it properly handles TypedArrays
    // (usually it does, but some environments may have issues)
    var originalArrayFrom = Array.from;
    if (originalArrayFrom) {
        Array.from = function(arrayLike, mapFn, thisArg) {
            // If it's a TypedArray and no mapFn, ensure proper expansion
            if (isTypedArray(arrayLike) && !mapFn) {
                return typedArrayToArray(arrayLike);
            }
            return originalArrayFrom.apply(this, arguments);
        };
    }

    // Patch Symbol.iterator on TypedArray prototypes to ensure spread works correctly
    // This is a safety net in case some runtime interferes with TypedArray iteration
    function ensureTypedArrayIterator(TypedArrayCtor) {
        if (typeof TypedArrayCtor === 'undefined') return;
        var proto = TypedArrayCtor.prototype;
        if (!proto) return;
        
        // Only patch if the iterator seems broken or missing
        var testArray = new TypedArrayCtor([1, 2, 3]);
        try {
            var spread = [];
            for (var v of testArray) {
                spread.push(v);
            }
            if (spread.length !== 3 || spread[0] !== 1 || spread[1] !== 2 || spread[2] !== 3) {
                throw new Error('Iterator broken');
            }
        } catch (e) {
            // Iterator is broken, try to fix it
            proto[Symbol.iterator] = function() {
                var self = this;
                var index = 0;
                return {
                    next: function() {
                        if (index < self.length) {
                            return { value: self[index++], done: false };
                        }
                        return { done: true };
                    }
                };
            };
            console.warn('[typed-array-patch] Fixed broken iterator for', TypedArrayCtor.name);
        }
    }

    // Check common TypedArray types
    var typedArrayTypes = [
        typeof Uint8Array !== 'undefined' ? Uint8Array : undefined,
        typeof Uint16Array !== 'undefined' ? Uint16Array : undefined,
        typeof Uint32Array !== 'undefined' ? Uint32Array : undefined,
        typeof Int8Array !== 'undefined' ? Int8Array : undefined,
        typeof Int16Array !== 'undefined' ? Int16Array : undefined,
        typeof Int32Array !== 'undefined' ? Int32Array : undefined,
        typeof Float32Array !== 'undefined' ? Float32Array : undefined,
        typeof Float64Array !== 'undefined' ? Float64Array : undefined,
        typeof Uint8ClampedArray !== 'undefined' ? Uint8ClampedArray : undefined
    ];

    for (var j = 0; j < typedArrayTypes.length; j++) {
        if (typedArrayTypes[j]) {
            ensureTypedArrayIterator(typedArrayTypes[j]);
        }
    }

    console.log('[typed-array-patch] Array.prototype.concat patched for TypedArray compatibility');
})();
