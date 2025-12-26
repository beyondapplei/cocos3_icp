// @ts-ignore
if (typeof window !== 'undefined') {
    if (typeof (window as any).global === 'undefined') {
        (window as any).global = window;
    }
    if (typeof (window as any).process === 'undefined') {
        (window as any).process = { env: {} };
    }
}
export {};
