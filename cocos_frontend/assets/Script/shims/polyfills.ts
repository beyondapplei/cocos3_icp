import './global';
import * as bufferModule from 'buffer';
import process from 'process';
import EventEmitter from 'events';

// @ts-ignore
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.global = window;
    // @ts-ignore
    window.process = process;
    // @ts-ignore
    window.Buffer = bufferModule.Buffer || bufferModule.default?.Buffer || (bufferModule as any).default;
    // @ts-ignore
    window.EventEmitter = EventEmitter;
}
