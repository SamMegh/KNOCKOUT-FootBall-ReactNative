import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
function createleague() {
  const router = useRouter();
  return (
    <SafeAreaView>
      
    <View>
        <TouchableOpacity onPress={()=>router.push("/createnewleague")}>
          <Text>
            click here to create a league
          </Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

export default createleague
