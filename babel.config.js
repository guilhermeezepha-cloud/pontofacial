module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV'],
      },
    ],
    ['react-native-worklets-core/plugin'],
    'react-native-reanimated/plugin',
  ],
};
