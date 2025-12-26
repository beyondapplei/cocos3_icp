import './runtime-global';
import './runtime-buffer-shim';

// Fix: some bundlers/transpilers may rewrite `[...u8a]` into `[].concat(u8a)`.
// Array#concat does NOT expand TypedArray elements, which can silently corrupt byte sequences
// used by crypto/principal/signature logic.
(() => {
    const g: any = (typeof globalThis !== 'undefined')
        ? globalThis
        : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {}));

    if (!g || g.__patchedArrayConcatForTypedArraySpread) return;
    g.__patchedArrayConcatForTypedArraySpread = true;

    const originalConcat = Array.prototype.concat;

    const isTypedArrayView = (v: any): boolean => {
        if (!v || typeof v !== 'object') return false;
        if (typeof ArrayBuffer === 'undefined' || typeof ArrayBuffer.isView !== 'function') return false;
        if (!ArrayBuffer.isView(v)) return false;
        if (typeof DataView !== 'undefined' && v instanceof DataView) return false;
        return true;
    };

    const typedArrayToNumberArray = (v: any): number[] => {
        const len = (v && typeof v.length === 'number') ? v.length : 0;
        const out = new Array(len);
        for (let i = 0; i < len; i++) out[i] = v[i] & 0xff;
        return out;
    };

    // eslint-disable-next-line no-extend-native
    (Array.prototype as any).concat = function (...args: any[]) {
        try {
            let changed = false;

            const receiver = isTypedArrayView(this)
                ? (changed = true, typedArrayToNumberArray(this))
                : this;

            const mapped = args.map((a) => {
                if (isTypedArrayView(a)) {
                    changed = true;
                    return typedArrayToNumberArray(a);
                }
                return a;
            });

            if (changed) return originalConcat.apply(receiver as any, mapped);
        } catch {
            // fallthrough
        }
        return originalConcat.apply(this, args as any);
    };
})();

class EventEmitterShim {
    private _listeners: Record<string, Function[]> = Object.create(null);

    on(event: string, listener: Function) {
        (this._listeners[event] || (this._listeners[event] = [])).push(listener);
        return this;
    }

    addListener(event: string, listener: Function) {
        return this.on(event, listener);
    }

    once(event: string, listener: Function) {
        const wrapped = (...args: any[]) => {
            this.off(event, wrapped);
            listener(...args);
        };
        return this.on(event, wrapped);
    }

    off(event: string, listener: Function) {
        const arr = this._listeners[event];
        if (!arr) return this;
        const idx = arr.indexOf(listener);
        if (idx >= 0) arr.splice(idx, 1);
        return this;
    }

    removeListener(event: string, listener: Function) {
        return this.off(event, listener);
    }

    removeAllListeners(event?: string) {
        if (event) delete this._listeners[event];
        else this._listeners = Object.create(null);
        return this;
    }

    emit(event: string, ...args: any[]) {
        const arr = this._listeners[event];
        if (!arr || arr.length === 0) return false;
        for (const fn of [...arr]) fn(...args);
        return true;
    }
}

// @ts-ignore
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.global = window;
    // buffer-shim already installs Buffer/process onto globalThis; mirror onto window for compatibility.
    // @ts-ignore
    window.process = (globalThis as any).process;
    // @ts-ignore
    window.Buffer = (globalThis as any).Buffer;
    // @ts-ignore
    window.EventEmitter = (globalThis as any).EventEmitter || EventEmitterShim;
}

// Also expose EventEmitter on globalThis (some libs read it from there)
if (typeof (globalThis as any).EventEmitter === 'undefined') {
    (globalThis as any).EventEmitter = EventEmitterShim;
}
