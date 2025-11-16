module.exports = function (api) {
  api.cache(true)

  const nativewindBabel = require('nativewind/babel')
  const nativewindPlugins = nativewindBabel()

  return {
    presets: ['babel-preset-expo'],
    plugins: [...nativewindPlugins.plugins],
  }
}
