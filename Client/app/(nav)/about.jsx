import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/868/868785.png',
          }}
          style={styles.logo}
        />
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 App Info</Text>
        <Text style={styles.cardText}>
          Fantasy League Manager helps users create and manage football leagues,
          join public leagues, track match stats, and more.
        </Text>
      </View>

      {/* Developer Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👨‍💻 Developers</Text>
        <Text style={styles.cardText}>👤 Name: Sam</Text>
        <Text style={styles.cardText}>💼 Role: Backend Developer</Text>
        <Text style={styles.cardText}>✉️ Email: sam.megh0305@gmail.com</Text>
        <View style={styles.divider} />
        <Text style={styles.cardText}>👤 Name: Jagjeet</Text>
        <Text style={styles.cardText}>💼 Role: Frontend Developer</Text>
        <Text style={styles.cardText}>✉️ Email: insanetech.in@gmail.com</Text>
      </View>

      {/* Version Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔖 Version</Text>
        <Text style={styles.cardText}>App Version: 1.2.0</Text>
        <Text style={styles.cardText}>Last Updated: July 23, 2025</Text>
      </View>

      {/* Credits */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>❤️ Credits</Text>
        <Text style={styles.cardText}>Icons: Ionicons, Material Icons</Text>
        <Text style={styles.cardText}>Design: Tailwind-inspired RN styles</Text>
        <Text style={styles.cardText}>API: Mock data for demo purposes</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 80,
    width: 80,
    borderRadius: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2563eb',
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
});
