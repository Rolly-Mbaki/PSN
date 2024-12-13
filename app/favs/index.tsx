import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GameList from "@/components/GameList";
import { Game } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const FAVORITES_STORAGE_KEY = "favorites";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load favorites from AsyncStorage

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        console.log("(Favorites Screen) Loaded favorites:", parsedFavorites);
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }

  useEffect(() => {
    loadFavorites()
  },[])

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Refresh favorites
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites(); // Reload favorites
    setRefreshing(false);
  };

  return (
    <View>
      <Text>Favorites Screen</Text>
      <GameList
        gameList={favorites}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default Favorites;
