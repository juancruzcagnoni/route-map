import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  mode: "driving" | "cycling" | "walking";
  onChange: (mode: "driving" | "cycling" | "walking") => void;
};

export function TransportSelector({ mode, onChange }: Props) {
  return (
    <View style={styles.transportBar}>
      <TouchableOpacity
        onPress={() => onChange("driving")}
        style={[styles.transportBtn, mode === "driving" && styles.transportBtnActive]}
      >
        <MaterialCommunityIcons name="car" size={22} color={mode === "driving" ? "#4285F4" : "#444"} />
        <Text style={{ fontSize: 12, color: mode === "driving" ? "#4285F4" : "#444" }}>Care</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("cycling")}
        style={[styles.transportBtn, mode === "cycling" && styles.transportBtnActive]}
      >
        <MaterialCommunityIcons name="bike" size={22} color={mode === "cycling" ? "#4285F4" : "#444"} />
        <Text style={{ fontSize: 12, color: mode === "cycling" ? "#4285F4" : "#444" }}>Bike</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("walking")}
        style={[styles.transportBtn, mode === "walking" && styles.transportBtnActive]}
      >
        <MaterialCommunityIcons name="walk" size={22} color={mode === "walking" ? "#4285F4" : "#444"} />
        <Text style={{ fontSize: 12, color: mode === "walking" ? "#4285F4" : "#444" }}>Walk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  transportBar: {
    position: "absolute",
    left: 18,
    bottom: 32,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "transparent",
  },
  transportBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#edededff",
  },
  transportBtnActive: {
    backgroundColor: "#e3f0ff",
  },
});
