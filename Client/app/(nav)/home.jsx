import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home() {
  const myLeagues = [
    { id: '1', name: 'Champions League', status: 'Ongoing', players: 128 },
    { id: '2', name: 'IPL Fantasy', status: 'Upcoming', players: 64 },
  ];

  const publicLeagues = [
    { id: '3', name: 'La Liga Frenzy', fee: 199 },
    { id: '4', name: 'Weekend Clash', fee: 0 },
    { id: '5', name: 'Premier League Showdown', fee: 299 },
  ];

  const tips = [
    'Build your dream team wisely',
    'Check player stats regularly',
    'Join public leagues to win rewards',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.heading}>👋 Welcome back, Sam!</Text>

        {/* Tips Section */}
        <View style={styles.tipsBox}>
          <Ionicons name="bulb-outline" size={24} color="#f59e0b" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipsTitle}>Quick Tips</Text>
            {tips.map((tip, i) => (
              <Text key={i} style={styles.tipItem}>• {tip}</Text>
            ))}
          </View>
        </View>

        {/* My Leagues */}
        <Text style={styles.sectionTitle}>⚽ My Leagues</Text>
        {myLeagues.map((league) => (
          <View key={league.id} style={styles.leagueCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.leagueName}>{league.name}</Text>
              <Text style={styles.leagueMeta}>
                {league.status} • {league.players} players
              </Text>
            </View>
            <Ionicons
              name={league.status === 'Ongoing' ? 'flash' : 'time'}
              size={22}
              color={league.status === 'Ongoing' ? '#10b981' : '#f59e0b'}
            />
          </View>
        ))}

        {/* Explore Public Leagues */}
        <Text style={styles.sectionTitle}>🌍 Public Leagues</Text>
        {publicLeagues.map((league) => (
          <View key={league.id} style={styles.publicCard}>
            <View>
              <Text style={styles.publicName}>{league.name}</Text>
              <Text style={styles.publicFee}>Joining Fee: ₹{league.fee}</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Highlighted Banner */}
        <View style={styles.bannerBox}>
          <Image
            source={{ uri: 'https://img.freepik.com/free-vector/soccer-match-banner-with-realistic-ball_1284-39336.jpg' }}
            style={styles.bannerImage}
          />
          <Text style={styles.bannerText}>🔥 Participate in Weekly Mega Leagues & Win Exciting Prizes!</Text>
        </View>

        {/* Create League Button */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createText}>+ Create New League</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginVertical: 12,
  },
  leagueCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#fff',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  leagueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  leagueMeta: {
    color: '#000',
    fontSize: 14,
    marginTop: 2,
  },
  publicCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  publicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  publicFee: {
    color: '#000',
    fontSize: 14,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'flex-start',
  },
  tipsTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 13,
    color: '#000',
  },
  bannerBox: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    padding: 12,
  },
});
