import React, { useEffect, useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Game } from "@/types";
import SearchBar from "@/components/Searchbar";
import styles from './GameList.styles'
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "favorites";

interface GameListProps {
    gameList: Game[],
    onRefresh: () => Promise<void>,
    refreshing: boolean,
}

const GameList = ({ gameList, onRefresh, refreshing }: GameListProps) => {
    const [favorites, setFavorites] = useState<Game[]>([]);
    const [filteredGameList, setFilteredGameList] = useState<Game[]>([]);
    const [search, setSearch] = useState<string>("");
    const [showToTop, setShowToTop] = useState(false);
    const listRef = useRef<FlatList<Game>>(null);

    useEffect(() => {
        setFilteredGameList(gameList)
    }, [gameList])

    const handleSearch = (text: string) => {
        setSearch(text);
        const list = gameList.filter((game) =>
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

    const handleFavoriteToggle = (game: Game) => {
        const newFavorites = favorites.find((fav) => fav.id === game.id)
            ? favorites.filter((fav) => fav.id !== game.id)
            : [...favorites, game];
        setFavorites(newFavorites)
    };

    const isFavorite = (game: Game) => {
        return favorites.some((fav) => fav.id === game.id);
    };

    // useEffect(() => {
    //     console.log("Updated favorites (in favorieten):", favorites);
    // }, [favorites]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
                if (storedFavorites) {
                    // const parsedFavorites = JSON.parse(storedFavorites);
                    // console.log("Loaded favorites:", parsedFavorites);
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };

        loadFavorites();
    }, []);

    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
                //om te zien wat er gesaved word
                const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
                if (storedFavorites) {
                    const parsedFavorites = JSON.parse(storedFavorites);
                }
            } catch (error) {
                console.error("Error saving favorites:", error);
            }
        };

        saveFavorites();
    }, [favorites]);

    const renderGameCard = ({ item }: { item: Game }) => (
        <View style={styles.card}>
            <Text style={styles.gameTitle}>{item.name}</Text>
            <Text style={styles.gameGenre}>Genre: {item.genre.join(", ") || "N/A"}</Text>
            <Text style={styles.gameRelease}>
                Release: {item.releaseDates.NorthAmerica || "Unknown"}
            </Text>
            <Text style={styles.developer}>
                Developer: {item.developers.join(", ") || "N/A"}
            </Text>
            <TouchableOpacity
                style={styles.heartIcon}
                onPress={() => handleFavoriteToggle(item)}
            >
                <Icon
                    name={isFavorite(item) ? "heart" : "heart-o"}
                    size={24}
                    color={isFavorite(item) ? "#0070D1" : "gray"}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={{ position: 'fixed' }}>
                <SearchBar value={search} onChangeText={handleSearch} placeholder="Enter Game Title..." />
            </View>

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
            />
            {showToTop && (
                <TouchableOpacity style={styles.toTopButton} onPress={scrollToTop}>
                    <Text style={styles.toTopText}>To Top</Text>
                </TouchableOpacity>
            )}

        </View>
    );
};

export default GameList