import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import validate from "../../utils/validator";
export default function login() {
  const router = useRouter();
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <View className="flex-1 justify-center items-center px-4 space-y-6">
        {/* Header */}
        <View className="items-center">
          <Text className="text-white text-3xl font-bold">KnockOut</Text>
          <Text className="text-white text-xl font-normal">Tell about you</Text>
        </View>

        {/* Form */}
        <View className="w-full px-4">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validate}
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
                <View>
                  <Text className="text-white mb-1">Email</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mb-2">
                      {errors.email}
                    </Text>
                  )}
                </View>

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
          <View className="flex justify-center items-center">
              <TouchableOpacity
                className="flex flex-row justify-center mt-5 p-2 items-center"
                onPress={() => router.push("/signup")}>
                <Text className="text-white font-semibold">New User? </Text>
                <Text className="text-base font-semibold underline text-[#f49b33]">
                  Sign up
                </Text>
              </TouchableOpacity>
              </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
