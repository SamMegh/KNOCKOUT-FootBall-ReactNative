import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import loginvalidate from "../../src/utils/loginValidator.js";
export default function login() {

  const [fontsLoaded] = useFonts({
    'Nedian-Bold': require('../../assets/fonts/Nedian-Bold.otf'),
  });



  const router = useRouter();
  const { isAuthUser, login } = useAuthStore();

  const handleSubmit = async (values) => {
    await login(values);
  };
  useEffect(() => {
    if (isAuthUser) {
      router.replace("/home");
    }
  }, [isAuthUser, router])
  return (
    <SafeAreaView className="flex-1 bg-teal-500">
      <View className="flex-1 w-screen justify-center items-center px-4 space-y-6">
        {/* Header */}
        <View className="items-center my-9">
          <Text className="text-white font-Nedian-Bold text-4xl font-normal my-1 ">KnockOut</Text>
          <Text className="text-[#e4bf57]  font-Nedian-Bold text-xl font-normal my-1 ">Tell about You</Text>
        </View>

        {/* Form */}
        <View className="w-full px-4">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginvalidate}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="space-y-6">
                <View>
                  <Text className="text-[#e4bf57] font-Nedian-Bold my-2">Email</Text>
                  <TextInput
                    className="h-12 w-full rounded-full font-Nedian-Bold px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                  />

                  {touched.email && errors.email && (
                    <Text className="text-red-500 font-Nedian-Bold mb-2">
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-[#e4bf57] font-Nedian-Bold my-2">Password</Text>
                  <TextInput
                    className="h-12 w-full rounded-full font-Nedian-Bold px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 font-Nedian-Bold mb-2">
                      {errors.password}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  className="h-12 my-6 flex justify-center text-center align-middle items-center w-full rounded-full  px-4 text-white border border-white/30 bg-white/10"
                >
                  <Text className="font-Nedian-Bold text-xl text-[#e4bf57] hover:text-black">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <View className="font-Nedian-Bold text-xl text-white hover:text-black">
            <TouchableOpacity
              className="flex flex-row justify-center mt-5 p-3 items-center"
              onPress={() => router.replace("/signup")}>
              <Text className="font-Nedian-Bold text-xl text-white hover:text-black">New User? </Text>
              <Text className="font-Nedian-Bold text-xl  hover:text-black underline text-[#e4bf57]">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
} export function joinleague() {
  return (
    <View />)
}

