// jest.config.cjs

module.exports = {
  bail: true,
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
