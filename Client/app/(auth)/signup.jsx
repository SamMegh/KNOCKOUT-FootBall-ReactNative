import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import signupvalidate from "../../src/utils/signupValidator.js";

export default function signup() {
  const router = useRouter();
  const {isAuthUser, signup} = useAuthStore();
    const handleSubmit = (values) => {
      signup(values);
    };
    useEffect(()=>{
      if(isAuthUser){
        router.replace("/home");
      }
    },[isAuthUser, router])
  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <View className="flex-1 justify-center items-center px-4 space-y-6">
        {/* Header */}
        <View className="items-center">
          <Text className="text-white text-3xl font-bold">KnockOut</Text>
          <Text className="text-white text-xl font-normal">Let's Create Your Account</Text>
        </View>

        {/* Form */}
        <View className="w-full px-4">
          <Formik
            initialValues={{ email: "", name:"", password: "" }}
            validationSchema={signupvalidate}
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
              <View className="space-y-4">

                {/* email */}
                <View>
                  <Text className="text-white mb-1">Email</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.email}
                    </Text>
                  )}
                </View>

                  {/* name */}
                <View>
                  <Text className="text-white mb-1">Name</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Enter your name"
                    placeholderTextColor="#aaa"
                  />
                  {touched.name && errors.name && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.name}
                    </Text>
                  )}
                </View>

                  {/* password */}
                <View>
                  <Text className="text-white mb-1">Password</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.password}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  className="bg-white rounded p-2 mt-2"
                >
                  <Text className="text-black text-center font-bold">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          {/* alrady account */}
          <View className="flex justify-center items-center">
              <TouchableOpacity
                className="flex flex-row justify-center mt-5 p-2 items-center"
                onPress={() => router.replace("/login")}>
                <Text className="text-white font-semibold">Alerady have Account :  </Text>
                <Text className="text-base font-semibold underline text-[#f49b33]">
                  LogIn
                </Text>
              </TouchableOpacity>
              </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
