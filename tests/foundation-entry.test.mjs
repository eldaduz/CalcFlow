import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

assert.ok(existsSync('index.html'), 'index.html must exist');
assert.ok(existsSync('src/main.jsx'), 'src/main.jsx must exist');
assert.match(readFileSync('src/main.jsx', 'utf8'), /createRoot/);

console.log('React entry point is present.');
