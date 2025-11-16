const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Add monorepo support
const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

config.watchFolders = [monorepoRoot]

// Ensure Metro can resolve modules from both locations
if (!config.resolver) {
  config.resolver = {}
}
if (!config.resolver.nodeModulesPaths) {
  config.resolver.nodeModulesPaths = []
}
config.resolver.nodeModulesPaths.push(
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
)

// Ensure source extensions are included
if (!config.resolver.sourceExts) {
  config.resolver.sourceExts = []
}
if (!config.resolver.sourceExts.includes('jsx')) {
  config.resolver.sourceExts.push('jsx')
}
if (!config.resolver.sourceExts.includes('js')) {
  config.resolver.sourceExts.push('js')
}

module.exports = withNativeWind(config, { input: './global.css' })
