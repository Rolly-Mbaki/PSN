import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Game } from "@/types";
import SearchBar from "@/components/Searchbar";
import styles from './GameList.styles'
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";

const FAVORITES_STORAGE_KEY = "favorites";

interface GameListProps {
    gameList: Game[],
    onRefresh: () => Promise<void>,
    refreshing: boolean,
    loading: boolean
}

const GameList = ({ gameList, onRefresh, refreshing, loading }: GameListProps) => {
    const [filteredGameList, setFilteredGameList] = useState<Game[]>([]);
    const [search, setSearch] = useState<string>("");
    const [showToTop, setShowToTop] = useState(false);
    const listRef = useRef<FlatList<Game>>(null);

    useFocusEffect(
        React.useCallback(() => {
            setFilteredGameList(gameList)
            setSearch('')
        }, [gameList])
    );

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

    return (
        <View style={styles.container}>

            <View style={{ position: 'fixed' }}>
                <SearchBar value={search} onChangeText={handleSearch} placeholder="Enter Game Title..." />
            </View>

            {loading 
            ? 
                (
                    <ActivityIndicator size={'large'} />
                ) 
            : 
                (
                    <>
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
                    </>
                )
            }

        </View>
    );
};

export default GameList