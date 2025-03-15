if (typeof require === "function") {
  const originalRequire = require;
  require = function (moduleName) {
    if (moduleName === "http") {
      return require("react-native-fetch-api/http");
    }
    return originalRequire(moduleName);
  };
}
