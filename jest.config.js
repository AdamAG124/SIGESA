module.exports = {
  testEnvironment: 'jsdom', // Simula el DOM para pruebas frontend
  roots: ['<rootDir>/tests'], // Donde están tus archivos .test.js
  moduleFileExtensions: ['js'],
  transform: {},
  testMatch: ['<rootDir>/tests/**/*.test.js'],
   "maxWorkers": "50%"
};