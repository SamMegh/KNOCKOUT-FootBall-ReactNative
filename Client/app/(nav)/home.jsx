import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLeagueStore } from '../../src/store/useLeagueStore';

export default function Home() {
  const router = useRouter();

  const myLeagues = [
    { id: '1', name: 'Champions League', status: 'Ongoing', players: 128 },
    { id: '2', name: 'IPL Fantasy', status: 'Upcoming', players: 64 },
  ];

  const tips = [
    'Build your dream team wisely',
    'Check player stats regularly',
    'Join public leagues to win rewards',
  ];

  const { leagues, getleague, joinleague, loading } = useLeagueStore();

  useEffect(() => {
    getleague();
  }, [getleague]);

    const confirmJoin = (league) => {
      if (Platform.OS === "web") {
        const ok = window.confirm(`Join "${league.name}"?`);
        if (ok) {
          joinleague(league._id);
          removeLeague(league._id);
        }
      } else {
        Alert.alert(
          "Join League",
          `Are you sure you want to join "${league.name}"?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Join",
              onPress: () => {
                joinleague(league._id);
                removeLeague(league._id);
              },
            },
          ],
          { cancelable: true }
        );
      }
    };

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
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : leagues?.length > 0 ? (
          leagues.map((league) => (
            <View key={league._id} style={styles.publicCard}>
              <View>
                <Text style={styles.publicName}>{league.name}</Text>
                <Text style={styles.leagueData}>Leqgue Id: {league._id}</Text>
                <Text style={styles.leagueData}>Joining Fee: ₹{league.joinfee}</Text>
                <Text style={styles.leagueData}>Owner: {league.ownerName}</Text>
              </View>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => confirmJoin(league)}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Join</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#6b7280' }}>
            No public leagues available yet.
          </Text>
        )}

        {/* Create League Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/createnewleague')}
        >
          <Text style={styles.createText}>+ Create New League</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginVertical: 12,
  },
  leagueCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  leagueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  leagueMeta: {
    color: '#6b7280',
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
    color: '#1e3a8a',
  },
  leagueData: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'flex-start',
  },
  tipsTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#92400e',
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 13,
    color: '#92400e',
  },
});
