import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import CustomHeader from "../../src/components/customHeader";

export default function CoinBuy() {
  const router = useRouter();
  const { coinData } = useLocalSearchParams();
  const coinPackages = JSON.parse(coinData || "[]");

  // ✅ Load font
  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  // ✅ Wait for font to load
  if (!fontsLoaded) return null;

  const goToCoinBuy = (data) => {
    router.push({
      pathname: "/checkOut",
      params: { coinData: JSON.stringify(data) },
    });
  };

  const renderItem = ({ item }) => {
    const isGcoin = item.coin === "Gcoin";

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => goToCoinBuy(item)}
      >
        <LinearGradient
          colors={isGcoin ? ["#ff4800", "#000"] : ["#000", "#ff4800"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.icon}>{isGcoin ? "🪙" : "⚪"}</Text>

          <Text style={styles.coinType}>
            {isGcoin ? "Gold Coin\nPack" : "Silver Coin\nPack"}
          </Text>

          <Text style={styles.amount}>
            {item.amount} {isGcoin ? "Gcoins" : "Scoins"}
          </Text>

          {isGcoin && item.freeamount && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>+{item.freeamount} Scoins FREE</Text>
            </View>
          )}

          <Text style={styles.price}>${item.usd}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      {/* Coin List */}
      <FlatList
        data={coinPackages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  gradient: {
    padding: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  icon: {
    fontSize: 40,
    marginBottom: 6,
    color: "#fff",
  },
  coinType: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "NedianMedium",
  },
  amount: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "NedianMedium",
  },
  freeBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  freeText: {
    fontSize: 13,
    color: "#000",
    fontFamily: "NedianMedium",
  },
  price: {
    fontSize: 18,
    marginTop: 10,
    color: "#fff",
    fontFamily: "NedianMedium",
  },
  backButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  backButtonText: {
    marginLeft: 20,
    fontSize: 20,
    color: "#000",
    // fontFamily: "NedianMedium",
  },
});
