import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

const stripeConfig = Constants.expoConfig?.plugins?.find(
  (p) => p[0] === "@stripe/stripe-react-native"
)?.[1];

const merchantId = stripeConfig?.merchantIdentifier; // For iOS Apple Pay (optional)
const enableGooglePay = stripeConfig?.enableGooglePay ?? true; // For Android

if (merchantId === undefined && enableGooglePay === undefined) {
  throw new Error(
    'Missing Expo config for "@stripe/stripe-react-native" in app.json'
  );
}

export default function ExpoStripeProvider(
  props
) {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      // merchantIdentifier is optional for Android, required for Apple Pay on iOS
      merchantIdentifier={merchantId}
      urlScheme={Linking.createURL("/").split(":")[0]} // matches app.json scheme
      {...props}
    />
  );
}
