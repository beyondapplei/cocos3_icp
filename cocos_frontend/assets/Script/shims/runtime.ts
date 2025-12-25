// Single runtime entry for Cocos editor preview.
// Keep all global/polyfill patches in ONE place to avoid import-order issues.

import './global';
import './polyfills';

// Principal/toText patch (guards internally against double-patching)
import '../mg/Polyfill';
