import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function LoaderCard() {
  const translateY = useRef(new Animated.Value(0)).current;

  const words = ["buttons", "forms", "switches", "cards", "buttons"];
  const wordHeight = 40; // must match styles.word height

  useEffect(() => {
    const animations = [];

    for (let i = 1; i < words.length; i++) {
      animations.push(
        Animated.timing(translateY, {
          toValue: -wordHeight * i,
          duration: 400, // slide speed
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(800) // pause on each word
      );
    }

    Animated.loop(Animated.sequence(animations)).start();
  }, [translateY]);

  return (
    <View style={styles.card}>
      <View style={styles.loader}>
        <Text style={styles.text}>loading</Text>
        <View style={styles.wordsContainer}>
          <Animated.View
            style={{
              transform: [{ translateY }],
            }}
          >
            {words.map((word, index) => (
              <Text key={index} style={styles.word}>
                {word}
              </Text>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  loader: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    overflow: "hidden",
  },
  text: {
    color: "rgb(31,31,31)",
    fontSize: 20,
    marginRight: 6,
    fontWeight: "500",
  },
  wordsContainer: {
    height: 40,
    overflow: "hidden",
  },
  word: {
    height: 40,
    textAlignVertical: "center",
    color: "#956afa",
    fontSize: 20,
    fontWeight: "600",
  },
});
