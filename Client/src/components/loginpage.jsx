import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import loginvalidate from "../../src/utils/loginValidator.js";
export default function Login() {

  const [fontsLoaded] = useFonts({
    'Nedian-Bold': require('../../assets/fonts/Nedian-Bold.otf'),
    'UrbanJungleDEMO': require('../../assets/fonts/UrbanJungleDEMO.otf'),
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
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center px-4 space-y-6">
        {/* Header */}
        <View className="items-center my-9">
          <Text className="text-white font-UrbanJungleDEMO text-4xl font-normal tracking-wider my-1 ">KnockOut</Text>
          <Text className="text-white  font-Nedian-Bold text-xl font-normal my-1  ">Tell about You</Text>
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
                  <Text className="text-white font-UrbanJungleDEMO tracking-widest my-2">Email</Text>
                  <TextInput
                    className="h-12 w-full rounded-full font- -Bold px-4 text-white border lowecasety border-white/30 bg-white/10"
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
                  <Text className="text-white font-UrbanJungleDEMO tracking-widest my-2">Password</Text>
                  <TextInput
                    className="h-12 w-full rounded-full font-Nedian-Bold px-4 text-white border lowercase  border-white/30 bg-white/10"
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
                  <Text className="font-UrbanJungleDEMO tracking-widest text-xl text-white hover:text-black">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
} 

