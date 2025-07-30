import React from "react";
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  fadeAnim: Animated.Value;
  searchResults: any[];
  getResultTitleSubtitle: (item: any) => { title: string; subtitle: string };
  handleSelectResult: (item: any) => void;
  search: string;
};

export function SearchResultsOverlay({
  fadeAnim,
  searchResults,
  getResultTitleSubtitle,
  handleSelectResult,
  search,
}: Props) {
  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.place_id?.toString() ?? (item.lat + item.lon)}
        renderItem={({ item }) => {
          const { title, subtitle } = getResultTitleSubtitle(item);
          return (
            <Pressable onPress={() => handleSelectResult(item)} style={styles.resultItem}>
              <View style={styles.resultItemKmIcon}>
                <View style={styles.resultItemKm}>
                  <Feather name="map-pin" size={16} color="black" />
                </View>
                <Text style={{ color: "#888", fontSize: 12 }}>
                  {Math.round(item._distance || 0)} km
                </Text>
              </View>
              <View style={styles.resultItemInfo}>
                <Text style={styles.resultTitle} numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={styles.resultSubtitle} numberOfLines={1} ellipsizeMode="tail">
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={() =>
          search.length > 2 ? <Text style={styles.resultEmpty}>Sin resultados</Text> : null
        }
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 80 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    zIndex: 0,
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  resultItemKmIcon: {
    alignItems: "center",
  },
  resultItemKm: {
    backgroundColor: "#edededff",
    padding: 6,
    borderRadius: 100,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#edededff",
  },
  resultItemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  resultSubtitle: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 2,
  },
  resultEmpty: {
    textAlign: "center",
    color: "#888",
    marginTop: 16,
    fontSize: 15,
  },
});
