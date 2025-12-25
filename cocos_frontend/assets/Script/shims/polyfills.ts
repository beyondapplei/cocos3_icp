import './global';
import './buffer-shim';

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
