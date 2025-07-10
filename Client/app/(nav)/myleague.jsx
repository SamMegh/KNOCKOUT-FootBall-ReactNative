import { useEffect } from "react"


function myleague() {
    useEffect(()=>{
        
    })
  return (
    <View>
          {myleagues && myleagues.map((league, index) => (
            <View key={index} style={{ padding: 10, marginVertical: 5, backgroundColor: '#eee' }}>
              <Text>Name: {league.name}</Text>
              <Text>Join fee: {league.joinfee}</Text>
              <Text>Start: {new Date(league.start).toDateString()}</Text>
              <Text>End: {new Date(league.end).toDateString()}</Text>
            </View>
          ))}
        </View>
  )
}

export default myleague
