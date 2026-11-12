export function normalizeWheelDelta(deltaY, maxDelta = 120) {
  const raw = Number.isFinite(deltaY) ? deltaY : 0;
  if (raw === 0) return 0;
  const capped = Math.min(Math.abs(raw), Math.abs(maxDelta));
  return Math.sign(raw) * capped;
}
