import { Picker } from '@react-native-picker/picker';
import { Redirect, useRouter } from 'expo-router';
import { Formik } from 'formik';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLeagueStore } from '../../src/store/useLeagueStore';

function createnewleague() {
  const router = useRouter();
  const { isAuthUser } = useAuthStore();
  const { createmyownleague } = useLeagueStore();

 const handleSubmit = (values) => {
  if (Platform.OS === 'web') {
    // Web alert (confirm + success)
    const confirm = window.confirm(
      `Are you sure you want to create the league "${values.name}"?`
    );

    if (confirm) {
      createmyownleague(values)
        .then(() => {
          window.alert('League created successfully!');
          router.replace('/');
        })
        .catch(() => {
          window.alert('Failed to create league. Please try again.');
        });
    }
  } else {
    // Mobile alert (React Native Alert)
    Alert.alert(
      'Create League',
      `Are you sure you want to create the league "${values.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            try {
              await createmyownleague(values);
              Alert.alert('Success', 'League created successfully!', [
                { text: 'OK', onPress: () => router.replace('/') },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to create league. Please try again.');
            }
          },
        },
      ]
    );
  }
};
  if (!isAuthUser) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      {/* Sticky Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 20,
          backgroundColor: '#e0f2fe',
          borderBottomColor: '#bae6fd',
          borderBottomWidth: 1,
          borderRadius: 12,
          elevation: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Ionicons name="arrow-back-circle" size={26} color="#2563eb" />
          <Text
            style={{
              color: '#2563eb',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: '#1e3a8a',
          }}
        >
          ⚽ Create New League
        </Text>
        <Text style={{ fontSize: 14, color: '#334155', marginTop: 4 }}>
          Fill out the details below to start your own league.
        </Text>
      </View>

      {/* Scrollable Form */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Formik
          initialValues={{
            name: '',
            joinfee: '',
            end: '',
            start: '',
            maxTimeTeamSelect: '',
            lifelinePerUser: '',
            type: 'private',
          }}
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
            <View style={{ gap: 20 }}>
              {/* League Name */}
              <View>
                <Text style={styles.label}>🏷️ League Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder="Enter the league name"
                  placeholderTextColor="#999"
                />
              </View>

              {/* League Type */}
              <View>
                <Text style={styles.label}>🔐 League Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.type}
                    onValueChange={handleChange('type')}
                    style={styles.picker}
                  >
                    <Picker.Item label="Private" value="private" />
                    <Picker.Item label="Public" value="public" />
                  </Picker>
                </View>

                {values.type === 'public' && (
                  <View
                    style={{
                      backgroundColor: '#dcfce7',
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 6,
                    }}
                  >
                    <Text style={{ color: '#15803d', fontSize: 14 }}>
                      ✅ This league is public. Anyone can join without admin approval.
                    </Text>
                  </View>
                )}
              </View>

              {/* Start Date */}
              <View>
                <Text style={styles.label}>📅 Start Date</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('start')}
                  onBlur={handleBlur('start')}
                  value={values.start}
                  placeholder="Start date (YYYY-MM-DD)"
                  placeholderTextColor="#999"
                />
              </View>

              {/* End Date */}
              <View>
                <Text style={styles.label}>📅 End Date</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('end')}
                  onBlur={handleBlur('end')}
                  value={values.end}
                  placeholder="End date (YYYY-MM-DD)"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Max Time Team Select */}
              <View>
                <Text style={styles.label}>⏱️ Max Time Team Can Be Selected</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('maxTimeTeamSelect')}
                  onBlur={handleBlur('maxTimeTeamSelect')}
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
                  onChangeText={handleChange('lifelinePerUser')}
                  onBlur={handleBlur('lifelinePerUser')}
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
                  onChangeText={handleChange('joinfee')}
                  onBlur={handleBlur('joinfee')}
                  value={values.joinfee}
                  placeholder="e.g. 399"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
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
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#111827',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default createnewleague;
