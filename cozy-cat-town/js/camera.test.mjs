import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWheelDelta } from './camera.js';

test('normalizeWheelDelta keeps large scroll events from causing huge camera jumps', () => {
  assert.equal(normalizeWheelDelta(0), 0);
  assert.equal(normalizeWheelDelta(40), 40);
  assert.equal(normalizeWheelDelta(150), 120);
  assert.equal(normalizeWheelDelta(-1000), -120);
});
