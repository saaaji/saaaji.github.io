// returns a new vec2
export function create() {
    return new Float64Array(2);
}

// creates a new vec2 from X and Y
export function fromValues(x, y) {
  const dst = new Float64Array(2);
  dst[0] = x;
  dst[1] = y;
  return dst;
}

// creates a new vec2 with the same components as A
export function clone(a) {
  const dst = new Float64Array(2);
  dst[0] = a[0];
  dst[1] = a[1];
  return dst;
}
  
// sets the components of dst to X and Y, respectively
export function set(dst, x, y) {
  dst[0] = x;
  dst[1] = y;
  return dst;
}
  
// the sum of A and B is stored in dst
export function add(dst, a, b) {
  dst[0] = a[0] + b[0];
  dst[1] = a[1] + b[1];
  return dst;
}

// the difference of A and B is stored in dst
export function sub(dst, a, b) {
  dst[0] = a[0] - b[0];
  dst[1] = a[1] - b[1];
  return dst;
}

// A scaled by the scalar S is stored in dst
export function scale(dst, a, s) {
  dst[0] = a[0] * s;
  dst[1] = a[1] * s;
  return dst;
}

// the sum of A and B scaled by the scalar S is stored in dst
export function addScaled(dst, a, b, s) {
  dst[0] = a[0] + b[0] * s;
  dst[1] = a[1] + b[1] * s;
  return dst;
}

// a vector with a direction opposite to that of A is stored in dst
export function negate(dst, a) {
  dst[0] = -a[0];
  dst[1] = -a[1];
  return dst;
}

// stores a unit vector pointing in the same direction as A in dst
export function norm(dst, a) {
  const invLen = 1 / length(a);
  dst[0] = a[0] * invLen;
  dst[1] = a[1] * invLen;
  return dst;
}

// returns the squared magnitude of A
export function lengthSq(a) {
  const x = a[0],
        y = a[1];
  return x*x + y*y
}

// returns the magnitude of A
export function length(a) {
  return Math.hypot(a[0], a[1]);
}

// returns the squared distance between A and B
export function distanceToSq(a, b) {
  const x = a[0] - b[0],
        y = a[1] - b[1];
  return x*x + y*y
}

// returns the distance between A and B
export function distanceTo(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}