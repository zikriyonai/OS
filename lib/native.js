export const isNative = () => typeof window !== 'undefined' && !!window.Zikriyon;

export const Zikriyon = new Proxy({}, {
  get: (_, k) => (...a) =>
    typeof window !== 'undefined' && window.Zikriyon && window.Zikriyon[k]
      ? window.Zikriyon[k](...a)
      : Promise.reject(new Error('not native')),
});
