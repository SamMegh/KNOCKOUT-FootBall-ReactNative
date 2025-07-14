import { Text, View } from 'react-native';
import { useLeagueStore } from '../../src/store/useLeagueStore';
export default function Home() {
  const {getData}= useLeagueStore();
  return (
    <View>
      <Text>Welcome to Home</Text>
      <button onClick={getData}>
        getData
      </button>
    </View>
  );
}
