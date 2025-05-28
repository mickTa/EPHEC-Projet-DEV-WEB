module.exports = {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    // Si tu as besoin de mapper certains fichiers comme CSS/images, fais-le ici
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(uuid)/)", // 👈 autorise la lib uuid à être transformée
  ],
};
