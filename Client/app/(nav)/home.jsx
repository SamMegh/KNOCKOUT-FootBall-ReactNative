import { Text, View } from 'react-native';
import { useLeagueStore } from '../../src/store/useLeagueStore';
import { useEffect } from 'react';
export default function Home() {
  const {getDayData}= useLeagueStore();
  useEffect(()=>{
getDayData();
  },[getDayData])
  return (
    <View>
      <Text>Welcome to Home</Text>
      <button onClick={getDayData}>
        getData
      </button>
    </View>
  );
}
