# Route Map - Mobile App

A simple and intuitive route planning app built with React Native and Expo. Route Map helps users search for places, view directions, and estimate travel time by car, bike, or walking—all on a beautiful interactive map.

---

## Features

- **Search for any place or address** using autocomplete
- **Instant route calculation** between your location and a selected destination
- **Travel mode selection:** car, bike, or walking
- **Estimated travel time** for each mode of transport
- **Interactive map** with user location, destination marker, and route line
- **Clear routes and search** with one tap
- **Animated search overlay** for seamless UX
- **Responsive UI** with support for light and dark status bar

---

## Screens

- **Home / Map:** Search bar, live map, and travel mode selector
- **Overlay:** Animated list of search results
- **Duration Box:** Estimated travel time displayed when a route is set

---

## Tech Stack

- **React Native** with **Expo**
- **Expo Location** for geolocation
- **react-native-maps** for map view and markers
- **OpenStreetMap (Nominatim)** for place search/autocomplete
- **OSRM (Open Source Routing Machine)** API for route and travel time calculation
- **expo-router** (if used) for routing/navigation
- **Animated API** for smooth transitions

---

## Architecture

- **Modular components:**  
  `SearchBar`, `SearchResultsOverlay`, `TransportSelector`, `DurationBox`
- **Centralized state:**  
  Uses React state/hooks for managing search, map, and UI
- **Live calculations:**  
  Distance, duration, and mode switching update UI in real time

---

## Why this project?

Route Map was built to showcase:

- Clean, simple UX for mapping and navigation
- Real integration of map, geolocation, and third-party APIs
- Modular and readable React Native code structure
- User-friendly mobile experience with responsive animations
