import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Region } from "react-native-maps";
import { Game } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from "@/datacontext";

interface Country {
  name: string;
  latitude: number;
  longitude: number;
}

const FAVORITES_STORAGE: string = 'favorites';

const countries: Country[] = [
  { name: "Japan", latitude: 35.6895, longitude: 139.6917 },
  { name: "North America", latitude: 37.0902, longitude: -95.7129 },
  { name: "Europe", latitude: 54.5260, longitude: 15.2551 },
  { name: "Australia", latitude: -25.2744, longitude: 133.7751 }
];

const GameDetails = () => {
  const { games, loadData, loading } = useContext(DataContext)
  const [game, setGame] = useState<Game>();
  const [releaseCountry, setReleaseCountry] = useState<Country>(countries[0])
  const { id } = useLocalSearchParams<{ id: string }>();
  const [heart, setHeart] = useState<boolean>();

  useEffect(() => {
    if (games.length > 0) {
      const result = games.find((game) => game.id.toString() === id);
      setGame(result);
    }
  }, [games, id]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleReleaseCountry = (rc: Country) => {
    const release: Country = rc
    setReleaseCountry(release)
  }

  const addFavGame = async (gameId: number) => {
    try {
      setHeart(true); // Mark game as favorite locally
      const storedData = await AsyncStorage.getItem(FAVORITES_STORAGE);
      let favorites: number[] = storedData ? JSON.parse(storedData) : []; // Parse existing favorites or start a new array
      if (!favorites.includes(gameId)) {
        favorites.push(gameId); // Add the current game ID
        await AsyncStorage.setItem(FAVORITES_STORAGE, JSON.stringify(favorites)); // Update storage
        alert(`${game?.name} added to your favorites`);
      } else {
        alert(`${game?.name} is already in your favorites`);
      }
    } catch (error) {
      console.error("Error adding game to favorites:", error);
    }
  };

  const removeFavGame = async (gameId: number) => {
    try {
      setHeart(false); // Mark game as not favorite locally
      const storedData = await AsyncStorage.getItem(FAVORITES_STORAGE);
      let favorites: number[] = storedData ? JSON.parse(storedData) : [];
      favorites = favorites.filter((id) => id !== gameId); // Remove the game
      await AsyncStorage.setItem(FAVORITES_STORAGE, JSON.stringify(favorites)); // Update storage
      alert(`${game?.name} removed from your favorites`);
    } catch (error) {
      console.error("Error removing game from favorites:", error);
    }
  };

  useEffect(() => {
    const checkFavorite = async () => {
      const storedData = await AsyncStorage.getItem(FAVORITES_STORAGE);
      const favorites: number[] = storedData ? JSON.parse(storedData) : [];
      setHeart(favorites.includes(parseInt(id)));
    };
    checkFavorite();
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => heart ? removeFavGame(game!.id) :addFavGame(game!.id)}>
              <Ionicons name={heart ? "heart" : "heart-outline"} size={22} color={heart ? "blue" : "white"} />
            </TouchableOpacity>
          ),
          title: game?.name || "Game Details",
        }}
      />
      <ScrollView style={styles.container}>
        {game ? (
          <View style={styles.card}>
            <Text style={styles.gameTitle}>{game.name}</Text>
            <Text style={styles.details}>Genre: {game.genre.join(', ') || 'N/A'}</Text>
            <Text style={styles.details}>Developer: {game.developers.join(', ') || 'N/A'}</Text>
            <Text style={styles.details}>Publisher: {game.publishers.join(', ') || 'N/A'}</Text>
            <Text style={styles.details}>Release Dates:</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Region</Text>
                <Text style={styles.tableHeader}>Date</Text>
              </View>

              <Pressable onPress={() => handleReleaseCountry(countries[0])}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Japan</Text>
                  <Text style={styles.tableCell}>{game.releaseDates.Japan || 'Unknown'}</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => handleReleaseCountry(countries[1])}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>North America</Text>
                  <Text style={styles.tableCell}>{game.releaseDates.NorthAmerica || 'Unknown'}</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => handleReleaseCountry(countries[2])}>
                <View style={styles.tableRow} >
                  <Text style={styles.tableCell}>Europe</Text>
                  <Text style={styles.tableCell}>{game.releaseDates.Europe || 'Unknown'}</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => handleReleaseCountry(countries[3])}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Australia</Text>
                  <Text style={styles.tableCell}>{game.releaseDates.Australia || 'Unknown'}</Text>
                </View>
              </Pressable>

            </View>
            <View style={{ flex: 1 }}>
              <MapView
                style={{ height: 300, width: '100%', marginTop: 20, borderRadius: 10 }}
                region={{
                  latitude: releaseCountry.latitude,
                  longitude: releaseCountry.longitude,
                  latitudeDelta: 20.0,
                  longitudeDelta: 20.0,
                }}
              />
            </View>
          </View>
        ) : (
          <Text style={styles.loading}>Loading game details...</Text>
        )}
      </ScrollView>
    </>
  );
};

export default GameDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#0070D1',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableCell: {
    fontSize: 14,
    color: '#ccc',
  },
  loading: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});
