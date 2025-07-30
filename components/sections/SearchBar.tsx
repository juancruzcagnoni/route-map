import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    inputRef: React.RefObject<TextInput>;
    onClear: () => void; 
};

export function SearchBar({ value, onChangeText, onFocus, onBlur, inputRef, onClear }: Props) {
    return (
        <View style={styles.topBar}>
            <Feather name="search" size={22} color="#444" style={{ marginRight: 8 }} />
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    ref={inputRef}
                    style={[styles.searchInput, { paddingRight: value ? 34 : 8 }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Search here..."
                    placeholderTextColor="#888"
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {value.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={onClear}
                        hitSlop={12}
                    >
                        <Feather name="x" size={20} color="#888" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: Platform.OS === "android" ? 50 : 60,
        left: 20,
        right: 20,
        backgroundColor: "#edededff",
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: 10,
        zIndex: 2,
    },
    searchInput: {
        flex: 1,
        borderRadius: 24,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === "ios" ? 10 : 6,
        fontSize: 15,
        color: "#222",
    },
    clearButton: {
        position: "absolute",
        right: 8,
        top: "50%",
        transform: [{ translateY: -10 }],
        zIndex: 10,
    },
});
