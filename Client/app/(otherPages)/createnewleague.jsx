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
import CustomHeader from "../../src/components/customHeader";
import WeekSelector from "../../src/components/weekComponent";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";
import leagueValidator from "../../src/utils/leagueValidator";
function createnewleague() {
  const router = useRouter();
  const { isAuthUser } = useAuthStore();
  const { createmyownleague } = useLeagueStore();

  const handleSubmit = (values) => {
    if (Platform.OS === "web") {
      // Web alert (confirm + success)
      const confirm = window.confirm(
        `Are you sure you want to create the league "${values.name}"?`
      );

      if (confirm) {
        createmyownleague(values)
          .then(() => {
            window.alert("League created successfully!");
            router.replace("/");
          })
          .catch(() => {
            window.alert("Failed to create league. Please try again.");
          });
      }
    } else {
      // Mobile alert (React Native Alert)
      Alert.alert(
        "Create League",
        `Are you sure you want to create the league "${values.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Create",
            onPress: async () => {
              try {
                await createmyownleague(values);
                Alert.alert("Success", "League created successfully!", [
                  { text: "OK", onPress: () => router.replace("/") },
                ]);
              } catch (error) {
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

      {/* Scrollable Form */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: "#000",
          borderTopEndRadius: 40,
          borderTopStartRadius: 40,
        }}
      >
        <Formik
          initialValues={{
            name: "",
            joinfee: {
              amount: "59",
              type: "SCoin",
            },
            end: "",
            start: "",
            totalWeeks: "",
            maxTimeTeamSelect: "1",
            lifelinePerUser: "1",
            type: "private",
          }}
          onSubmit={handleSubmit}
          validationSchema={leagueValidator}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
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
                    onValueChange={handleChange("type")}
                    style={styles.picker}
                  >
                    <Picker.Item label="Private" value="private" />
                    <Picker.Item label="Public" value="public" />
                  </Picker>
                </View>

                {values.type === "public" && (
                  <View
                    style={{
                      backgroundColor: "#dcfce7",
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 6,
                    }}
                  >
                    <Text style={{ color: "#15803d", fontSize: 14 }}>
                      ✅ This league is public. Anyone can join without admin
                      approval.
                    </Text>
                  </View>
                )}
              </View>

              {/* Date Selection */}
              <View>
                <WeekSelector values={values} handleChange={handleChange} />

                {touched.totalWeeks && errors.totalWeeks && (
                  <Text style={styles.errorText}>{errors.totalWeeks}</Text>
                )}
              </View>

              {/* Max Time Team Select */}
              <View>
                <Text style={styles.label}>
                  ⏱️ Max Time Team Can Be Selected
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("maxTimeTeamSelect")}
                  onBlur={handleBlur("maxTimeTeamSelect")}
                  value={values.maxTimeTeamSelect}
                  placeholder="e.g. 1"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
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
              </View>

              {/* Join Fee */}
              <View>
                <Text style={styles.label}>💸 Joining Fee</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    setFieldValue("joinfee.amount", text);
                  }}
                  onBlur={handleBlur("joinfee.amount")}
                  value={values.joinfee?.amount || ""}
                  placeholder="e.g. 399"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                {touched.joinfee?.amount && (
                  <>
                    {Number(values.joinfee?.amount) < 20 ? (
                      <Text style={styles.errorText}>
                        Joining Fee must be at least 20
                      </Text>
                    ) : (
                      errors.joinfee?.amount && (
                        <Text style={styles.errorText}>
                          {errors.joinfee.amount}
                        </Text>
                      )
                    )}
                  </>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
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
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
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
  picker: {
    height: 50,
    color: "#111827",
  },
  errorText: {
    color: "#f87171",
    fontFamily: "Prismfont_CLv2",
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
};

export default createnewleague;
