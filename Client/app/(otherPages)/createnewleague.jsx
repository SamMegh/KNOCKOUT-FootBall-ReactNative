import { Picker } from "@react-native-picker/picker";
import { Redirect, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import CustomHeader from "../../src/components/customHeader";
import WeekSelector from "../../src/components/weekComponent";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";
import leagueValidator from "../../src/utils/leagueValidator";

function CreateNewLeague() {
  const router = useRouter();
  const { isAuthUser } = useAuthStore();
  const { createmyownleague } = useLeagueStore();

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      joinfee: {
        ...values.joinfee,
        amount: Number(values.joinfee.amount), // ensure number
      },
    };

    if (Platform.OS === "web") {
      const confirm = window.confirm(
        `Are you sure you want to create the league "${values.name}"?`
      );
      if (!confirm) return;

      try {
        await createmyownleague(payload);
        window.alert("League created successfully!");
        router.replace("/");
      } catch (err) {
        window.alert("Failed to create league. Please try again.");
      }
    } else {
      Alert.alert(
        "Create League",
        `Are you sure you want to create the league "${values.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Create",
            onPress: async () => {
              try {
                await createmyownleague(payload);
                Alert.alert("Success", "League created successfully!", [
                  { text: "OK", onPress: () => router.replace("/") },
                ]);
              } catch (err) {
                Alert.alert(
                  "Error",
                  "Failed to create league. Please try again."
                );
              }
            },
          },
        ]
      );
    }
  };

  if (!isAuthUser) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          marginTop: 10,
          padding: 20,
          backgroundColor: "#000",
          borderTopEndRadius: 40,
          borderTopStartRadius: 40,
        }}
      >
        <Formik
          initialValues={{
            name: "",
            joinfee: { amount: 59, type: "SCoin" },
            end: "",
            start: "",
            totalWeeks: "",
            maxTimeTeamSelect: "1",
            lifelinePerUser: "1",
            type: "private",
          }}
          validationSchema={leagueValidator}
          onSubmit={handleSubmit}
          validateOnMount={true}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <View style={{ gap: 20 }}>
              {/* League Name */}
              <View>
                <Text style={styles.label}>🏷️ League Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder="Enter the league name"
                  placeholderTextColor="#999"
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* League Type */}
              <View>
                <Text style={styles.label}>🔐 League Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.type}
                    onValueChange={(val) => setFieldValue("type", val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Private" value="private" />
                    <Picker.Item label="Public" value="public" />
                  </Picker>
                </View>
                {touched.type && errors.type && (
                  <Text style={styles.errorText}>{errors.type}</Text>
                )}
              </View>

              {/* Date Selection */}
              <WeekSelector values={values} handleChange={handleChange} />
              {touched.totalWeeks && errors.totalWeeks && (
                <Text style={styles.errorText}>{errors.totalWeeks}</Text>
              )}

              {/* Max Time Team Select */}
              <View>
                <Text style={styles.label}>⏱️ Max Time Team Can Be Selected</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("maxTimeTeamSelect")}
                  onBlur={handleBlur("maxTimeTeamSelect")}
                  value={values.maxTimeTeamSelect}
                  placeholder="e.g. 1"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                {touched.maxTimeTeamSelect && errors.maxTimeTeamSelect && (
                  <Text style={styles.errorText}>{errors.maxTimeTeamSelect}</Text>
                )}
              </View>

              {/* Lifeline Per User */}
              <View>
                <Text style={styles.label}>🛡️ Lifeline Per User</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("lifelinePerUser")}
                  onBlur={handleBlur("lifelinePerUser")}
                  value={values.lifelinePerUser}
                  placeholder="e.g. 3"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                {touched.lifelinePerUser && errors.lifelinePerUser && (
                  <Text style={styles.errorText}>{errors.lifelinePerUser}</Text>
                )}
              </View>

              {/* Coin Type + Join Fee */}
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>💰 Coin Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={values.joinfee.type}
                      onValueChange={(val) => setFieldValue("joinfee.type", val)}
                      style={styles.picker}
                    >
                      <Picker.Item label="SCoin" value="SCoin" />
                      <Picker.Item label="GCoin" value="GCoin" />
                    </Picker>
                  </View>
                  {touched.joinfee?.type && errors.joinfee?.type && (
                    <Text style={styles.errorText}>{errors.joinfee.type}</Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>💸 Join Fee</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) =>
                      setFieldValue("joinfee.amount", text.replace(/[^0-9]/g, ""))
                    }
                    onBlur={handleBlur("joinfee.amount")}
                    value={String(values.joinfee.amount)}
                    placeholder="e.g. 59"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                  {touched.joinfee?.amount && errors.joinfee?.amount && (
                    <Text style={styles.errorText}>{errors.joinfee.amount}</Text>
                  )}
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                style={[styles.button, !isValid && { opacity: 0.5 }]}
              >
                <Text style={styles.buttonText}>🚀 Create League</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

const styles = {
  backButton: { margin: 10 },
  backButtonText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  label: { fontSize: 16, color: "#fff", marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#111827",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: { height: 50, color: "#111827" },
  errorText: { color: "#f87171", fontSize: 14, marginBottom: 8 },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
};

export default CreateNewLeague;
