import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useLeagueStore } from '../../src/store/useLeagueStore.js';

function JoinLeague() {
  const { getleague, leagues } = useLeagueStore();

  useEffect(() => {
    getleague();
  }, []);

  return (
    <View>
      {leagues && leagues.map((league, index) => (
        <View key={index} style={{ padding: 10, marginVertical: 5, backgroundColor: '#eee' }}>
          <Text>Name: {league.name}</Text>
          <Text>Join fee: {league.joinfee}</Text>
          <Text>Start: {new Date(league.start).toDateString()}</Text>
          <Text>End: {new Date(league.end).toDateString()}</Text>
        </View>
      ))}
    </View>
  );
}

export default JoinLeague;
