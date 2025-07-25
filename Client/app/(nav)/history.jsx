import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function History() {
  const matchHistory = [
    {
      id: '1',
      league: 'Champions League',
      result: 'Won',
      date: '2025-07-20',
      points: 92,
    },
    {
      id: '2',
      league: 'IPL Fantasy',
      result: 'Lost',
      date: '2025-07-15',
      points: 47,
    },
    {
      id: '3',
      league: 'Weekend Clash',
      result: 'Won',
      date: '2025-07-10',
      points: 80,
    },
    {
      id: '4',
      league: 'La Liga Frenzy',
      result: 'Lost',
      date: '2025-07-01',
      points: 60,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📜 Your Match History</Text>

      {matchHistory.map((match) => (
        <View key={match.id} style={styles.card}>
          <Text style={styles.league}>{match.league}</Text>
          <Text style={styles.result}>
            Result:{' '}
            <Text style={{ color: match.result === 'Won' ? '#10b981' : '#ef4444' }}>
              {match.result}
            </Text>
          </Text>
          <Text style={styles.meta}>Date: {match.date}</Text>
          <Text style={styles.meta}>Points Earned: {match.points}</Text>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>🏆 Summary</Text>
        <Text style={styles.summaryText}>Total Matches: 4</Text>
        <Text style={styles.summaryText}>Wins: 2</Text>
        <Text style={styles.summaryText}>Losses: 2</Text>
        <Text style={styles.summaryText}>Total Points: 279</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  league: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
    marginBottom: 4,
  },
  result: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
  },
  summary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
});
