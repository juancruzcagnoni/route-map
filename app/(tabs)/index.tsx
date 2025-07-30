import { DurationBox } from "@/components/sections/DurationBox";
import { SearchBar } from "@/components/sections/SearchBar";
import { SearchResultsOverlay } from "@/components/sections/SearchResultsOverlay";
import { TransportSelector } from "@/components/sections/TransportSelector";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

// Tipos
type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: any;
  _distance?: number;
};
type TransportMode = "driving" | "cycling" | "walking";

const SPEED = {
  driving: 40,     // km/h
  cycling: 15,     // km/h
  walking: 5,      // km/h
};

export default function IndexScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [destination, setDestination] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [mode, setMode] = useState<TransportMode>("driving");
  const [duration, setDuration] = useState<number | null>(null);

  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  // Animación del overlay
  useEffect(() => {
    if (searchFocused) {
      setShowOverlay(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else if (showOverlay) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setShowOverlay(false));
      Keyboard.dismiss();
    }
  }, [searchFocused]);

  // Buscar lugares en Nominatim
  useEffect(() => {
    if (search.length < 3 || !location) {
      setSearchResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        search
      )}&format=json&addressdetails=1&limit=5`;
      const resp = await fetch(url, {
        headers: { "User-Agent": "ReactNativeApp" },
        signal: controller.signal,
      });
      if (resp.ok) {
        let data: NominatimResult[] = await resp.json();
        data = data
          .map((item) => ({
            ...item,
            _distance: getDistanceKm(
              location.coords.latitude,
              location.coords.longitude,
              parseFloat(item.lat),
              parseFloat(item.lon)
            ),
          }))
          .sort((a, b) => (a._distance || 0) - (b._distance || 0));
        setSearchResults(data);
      }
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [search, location]);

  // Obtener ruta y duración según modo
  useEffect(() => {
    const getRoute = async () => {
      if (!destination || !location) return;
      setDuration(null);

      if (mode === "driving") {
        const url = `https://router.project-osrm.org/route/v1/driving/${location.coords.longitude},${location.coords.latitude};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
        const resp = await fetch(url);
        if (resp.ok) {
          const data = await resp.json();
          const coords = data.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
          );
          setRouteCoords(coords);
          setDuration(data.routes[0].duration); // en segundos
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(coords, {
              edgePadding: { top: 100, left: 60, right: 60, bottom: 100 },
              animated: true,
            });
          }
        }
      } else {
        let coords: { latitude: number; longitude: number }[] = [];
        let distanceKm = getDistanceKm(
          location.coords.latitude,
          location.coords.longitude,
          destination.lat,
          destination.lon
        );

        if (routeCoords.length > 0) {
          coords = routeCoords;
        } else {
          const url = `https://router.project-osrm.org/route/v1/driving/${location.coords.longitude},${location.coords.latitude};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
          const resp = await fetch(url);
          if (resp.ok) {
            const data = await resp.json();
            coords = data.routes[0].geometry.coordinates.map(
              ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
            );
            setRouteCoords(coords);
          }
        }
        const velocidad = SPEED[mode] * 1000 / 3600; // m/s
        const durationSec = (distanceKm * 1000) / velocidad;
        setDuration(durationSec);
      }
    };
    getRoute();
    // eslint-disable-next-line
  }, [destination, mode]);

  const handleSelectResult = (item: NominatimResult) => {
    setDestination({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.display_name,
    });
    setSearch(item.display_name);
    setSearchFocused(false);
  };

  const handleCenterOnUser = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    } catch (e) {
      setErrorMsg("Could not get location");
    }
  };

  function getResultTitleSubtitle(item: NominatimResult) {
    if (!item.address) {
      const [main, ...rest] = item.display_name.split(",");
      return {
        title: main.trim(),
        subtitle: rest.join(", ").trim(),
      };
    }
    const {
      attraction, building, road, pedestrian, house_number, name,
      city, town, village, suburb, municipality, state
    } = item.address;
    let title =
      name ||
      attraction ||
      building ||
      [road || pedestrian, house_number].filter(Boolean).join(" ").trim();
    if (!title) {
      title = item.display_name.split(",")[0].trim();
    }
    const subtitle = [
      city || town || village || suburb || municipality,
      state,
    ]
      .filter(Boolean)
      .join(", ");
    return { title, subtitle };
  }

  const handleClearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setDuration(null);
    setRouteCoords([]);
    setDestination(null);
  };

  if (!location && !errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={showOverlay ? "dark-content" : "light-content"}
        animated
        backgroundColor={showOverlay ? "#fff" : "transparent"}
      />
      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={{ ...StyleSheet.absoluteFillObject }}
        showsUserLocation
        initialRegion={{
          latitude: location?.coords.latitude ?? -34.6075682,
          longitude: location?.coords.longitude ?? -58.4370894,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {destination && (
          <Marker
            coordinate={{ latitude: destination.lat, longitude: destination.lon }}
            title="Destino"
            description={destination.name}
          />
        )}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#4285F4"
          />
        )}
      </MapView>

      {/* Selector modo de transporte */}
      {!showOverlay && (
        <TransportSelector mode={mode} onChange={setMode} />
      )}

      {/* Duración estimada */}
      {duration !== null && destination && !showOverlay && (
        <DurationBox duration={duration} />
      )}

      {/* Barra de búsqueda */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        inputRef={inputRef}
        onClear={handleClearSearch}
      />

      {/* Overlay de resultados */}
      {showOverlay && (
        <SearchResultsOverlay
          fadeAnim={fadeAnim}
          searchResults={searchResults}
          getResultTitleSubtitle={getResultTitleSubtitle}
          handleSelectResult={handleSelectResult}
          search={search}
        />
      )}

      {/* Botón de centrar */}
      {!showOverlay && (
        <TouchableOpacity style={styles.fab} onPress={handleCenterOnUser}>
          <Feather name="navigation" size={24} color="#444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#edededff",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
});
