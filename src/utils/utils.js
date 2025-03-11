export const commonConstants = {
    opacity: 'opacity',
    brightness:'brightness',
    blur:'blur',
    contrast: 'contrast',
    grayscale: 'grayscale',
    hueRotate: 'hue-rotate',
    invert: 'invert',
    saturate: 'saturate',
    sepia: 'sepia'
}


export const filterValues = ['opacity' , 'brightness' , 'blur' , 'contrast' , 'grayscale' , 'hue-rotate' , 'invert' , 'saturate' , 'sepia']


export const throttle = (callback , delay , options) => {
    let previous = 0;
  let timeout = null;
  let lastArgs = null;
  options = options || {};

  return function(...args) {
    let now = Date.now();
    let remaining = delay - (now - previous);
    lastArgs = args;

    if (options.leading === false && !previous) {
      previous = now;
    }

    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      callback.apply(this, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        callback.apply(this, lastArgs);
      }, remaining);
    }
  };
}
