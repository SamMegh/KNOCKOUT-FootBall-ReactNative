export default function ExpoStripeProvider({ children }) {
  console.warn("⚠️ Stripe is not supported on web, returning children only.");
  return children;
}
