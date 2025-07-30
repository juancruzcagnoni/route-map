import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

type Props = { duration: number };

export function DurationBox({ duration }: Props) {
  function formatDuration(secs: number) {
    const min = Math.floor(secs / 60);
    if (min < 1) return "< 1 min";
    if (min < 60) return `${min} min`;
    const hs = Math.floor(min / 60);
    const mins = min % 60;
    return `${hs}h${mins > 0 ? ` ${mins}m` : ""}`;
  }
  return (
    <View style={styles.durationBox}>
      <Text style={styles.durationText}>{`Estimated time: ${formatDuration(duration)}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  durationBox: {
    position: "absolute",
    top: Platform.OS === "android" ? 58 : 130,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  durationText: {
    fontSize: 14,
    color: "#222",
    backgroundColor: "#edededff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    textAlign: "center",
  },
});
