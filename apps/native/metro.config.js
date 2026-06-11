// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /android\/app\/build\/.*/,
  /android\/build\/.*/,
  /android\/\.gradle\/.*/,
  /ios\/build\/.*/,
  /ios\/Pods\/.*/,
];

module.exports = config;
