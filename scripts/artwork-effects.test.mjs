import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
  function originalBoxPass(source, width, height, radius, horizontal) {
    const output = new Uint8ClampedArray(source.length), length = horizontal ? width : height, lines = horizontal ? height : width;
    const stride = horizontal ? 4 : width * 4, divisor = radius * 2 + 1;
    for (let line = 0; line < lines; line++) {
      const base = horizontal ? line * width * 4 : line * 4;
      for (let channel = 0; channel < 4; channel++) {
        let sum = 0;
        for (let offset = -radius; offset <= radius; offset++) sum += source[base + Math.max(0, Math.min(length - 1, offset)) * stride + channel];
        for (let pixel = 0; pixel < length; pixel++) {
          output[base + pixel * stride + channel] = sum / divisor;
          sum += source[base + Math.min(length - 1, pixel + radius + 1) * stride + channel] - source[base + Math.max(0, pixel - radius) * stride + channel];
        }
      }
    }
    return output;
  }
const source = readFileSync(new URL('../artwork-effects.js', import.meta.url), 'utf8');
const optimized = new Function(source.slice(source.indexOf('  function boxPass'), source.indexOf('  function drawCover')) + ';return boxPass')();
test('optimized blur preserves every RGBA value across three passes and edge cases', () => {

for(const [w,h] of [[1,1],[3,7],[270,338]])for(const radius of [1,6,20,30]){
 const input=Uint8ClampedArray.from({length:w*h*4},(_,i)=>(i*173+Math.floor(i/7))%256);
 let expected=input;for(let p=0;p<3;p++){expected=originalBoxPass(expected,w,h,radius,true);expected=originalBoxPass(expected,w,h,radius,false)}
 const actual=input.slice(),scratch=new Uint8ClampedArray(input.length);
 for(let p=0;p<3;p++){optimized(actual,scratch,w,h,radius,true);optimized(scratch,actual,w,h,radius,false)}
 assert.deepEqual(actual,expected);
}
});
