import { Text, View } from 'react-native';
import { useLeagueStore } from '../../src/store/useLeagueStore';
export default function Home() {
  const {getDayData}= useLeagueStore();
  return (
    <View>
      <Text>Welcome to Home</Text>
    </View>
  );
}
