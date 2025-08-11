import { StripeProvider } from '@stripe/stripe-react-native';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../src/store/useAuthStore.js";
import OpenPage from './(otherPages)/openpage.jsx';

export default function App() {
  const [publishableKey, setPublishableKey] = useState('');
const {isAuthUser,check} = useAuthStore();
  const router = useRouter();
  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  useEffect(() => {
      check();
  if(isAuthUser){
    router.replace("/home");
  }
    fetchPublishableKey();
  }, [isAuthUser,fetchPublishableKey,check]);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
    <SafeAreaView className="bg-[#000] flex-1">
      <OpenPage/>
    </SafeAreaView>
    </StripeProvider>
  );
}