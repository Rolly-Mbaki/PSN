import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useRef, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, RefreshControl, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { DataContext } from "@/datacontext";
import { Game } from "@/types";
import { Link, useFocusEffect } from "expo-router";
import styles from '../../components/GameList.styles'
import SearchBar from "@/components/Searchbar";

const FAVORITES_STORAGE: string = 'favorites';

const Favorites = () => {
  const { games, loadData, loading } = useContext(DataContext)
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredGameList, setFilteredGameList] = useState<Game[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showToTop, setShowToTop] = useState(false);
  const listRef = useRef<FlatList<Game>>(null);


  useFocusEffect(
    React.useCallback(() => {
      loadData();
      if (games.length > 0) {
        getFavorites();
      }
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (favoriteGames.length > 0) {
        setFilteredGameList(favoriteGames)
      }
    }, [favoriteGames])
  );

  const getFavorites = async () => {
    try {
      const storedData = await AsyncStorage.getItem(FAVORITES_STORAGE);
      const favorites = storedData ? JSON.parse(storedData) : []; // Parse existing favorites or start with an empty array
      console.log(favorites)
      let favGameList: Game[] = []
      if (favorites && favorites.length > 0) {

        favorites.forEach((element: number) => {
          let data: Game | undefined = games.find(game => game.id === element)
          favGameList.push(data!)
        });
        setFavoriteGames(favGameList)
        setIsLoading(false)
      } else {
        setFavoriteGames([])
        setIsLoading(false)
        console.log('No favorites found.');
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching favorites:", error);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData()
      getFavorites()
    } catch (error) {
      console.error("Failed to refresh games:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const list = favoriteGames.filter((game) =>
      game.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGameList(list);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowToTop(offsetY > 300);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderGameCard = ({ item }: { item: Game }) => (
    <TouchableOpacity>
      <Link style={styles.card} href={{
        pathname: '/game/[id]',
        params: { id: item.id.toString() }
      }}>
        <View>
          <Text style={styles.gameTitle}>{item.name}</Text>
          <Text style={styles.gameGenre}>Genre: {item.genre.join(", ") || "N/A"}</Text>
        </View>
      </Link>
    </TouchableOpacity>
  );

  if (isLoading) return <ActivityIndicator size={"large"} />

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: '#121212',
      flexDirection: 'column',
      padding: 10
    }}>
      <View style={{ position: 'fixed', width: '100%' }}>
        <SearchBar value={search} onChangeText={handleSearch} placeholder="Enter Game Title..." />
      </View>

      {loading
        ?
        (
          <ActivityIndicator size={'large'} />
        )
        :
        (
          <View style={styles.container}>
            <FlatList
              ref={listRef}
              data={filteredGameList}
              renderItem={renderGameCard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#0070D1"]}
                />
              }
              showsVerticalScrollIndicator={false}
            />
            {showToTop && (
              <TouchableOpacity style={styles.toTopButton} onPress={scrollToTop}>
                <Text style={styles.toTopText}>To Top</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      }

    </View>
  );
};

export default Favorites;