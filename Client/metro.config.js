const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Stub out stripe-react-native for web builds
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@stripe/stripe-react-native": path.resolve(__dirname, "privateStripeProvider.web.jsx"),
};

module.exports = withNativeWind(config, {
  input: "./global.css", // ← this is correct for your structure
  assets: ["./assets/fonts"], // path to your fonts
});
