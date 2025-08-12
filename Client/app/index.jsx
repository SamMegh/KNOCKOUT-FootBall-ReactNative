import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../src/store/useAuthStore.js";
import OpenPage from "./(otherPages)/openpage.jsx";

export default function App() {
  const { isAuthUser, check } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    check();
    if (isAuthUser) {
      router.replace("/home");
    }
  }, [isAuthUser, check]);

  return (
    <SafeAreaView className="bg-[#000] flex-1">
      <OpenPage />
    </SafeAreaView>
  );
}
