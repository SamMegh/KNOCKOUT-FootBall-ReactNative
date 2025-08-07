import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import signupvalidate from "../../src/utils/signupValidator.js";

export default function Signup() {
  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  const router = useRouter();
  const { isAuthUser, signup } = useAuthStore();

  const handleSubmit = (values) => {
    signup(values);
  };

  useEffect(() => {
    if (isAuthUser) {
      router.replace("/home");
    }
  }, [isAuthUser, router]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: "NedianMedium" }]}>
            KnockOut
          </Text>
          <Text style={styles.subtitle}>Let's Create Your Account</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Formik
            initialValues={{ email: "", name: "", password: "" }}
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
              <View style={styles.form}>
                {/* Name */}
                <View>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Enter your name"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                {/* Email */}
                <View>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Password */}
                <View>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  header: {
    alignItems: "center",
    marginVertical: 36,
  },
  title: {
    color: "#fff",
    fontSize: 36,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Prismfont_CLv2", // Ensure this font is loaded
  },
  formContainer: {
    width: 320, // fixed width
    paddingHorizontal: 6,
  },
  form: {
    gap: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "NedianMedium",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    fontFamily: "Prismfont_CLv2",
    marginBottom: 4,
    width: "100%",
  },
  errorText: {
    color: "#f87171",
    fontFamily: "Prismfont_CLv2",
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    height: 48,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "NedianMedium",
    letterSpacing: 1.5,
  },
});
