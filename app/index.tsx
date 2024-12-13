import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Game } from "@/types";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder }: SearchBarProps) => {
  return (
    <View style={stylesSerach.container}>
      <TextInput
        style={stylesSerach.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const stylesSerach = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
});

const GameList = () => {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [filteredGameList, setFilteredGameList] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [showToTop, setShowToTop] = useState(false);
  const listRef = useRef<FlatList<Game>>(null);

  const headers = {
    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvbGx5Lm1iYWtpQGFwLmJlIiwiaWF0IjoxNzMzMzYyMTIzfQ.rxGcugs7UeRhEM1hccxZOr9iaXywxvWBGei5CUCWp_g",
  };
  const baseURL = "https://sampleapis.assimilate.be/playstation/games";

  const loadAllGames = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseURL, { headers });
      const data: Game[] = await response.json();
      setGameList(data);
      setFilteredGameList(data);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllGames();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredGameList = gameList.filter((game) =>
      game.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGameList(filteredGameList);
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowToTop(offsetY > 300);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

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
    </View>
  );

  return (
    <View style={styles.container}>

      {loading && <ActivityIndicator animating={true} style={styles.loader} />}

      <View style={{position:'fixed'}}>
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
      />
      {showToTop && (
        <TouchableOpacity style={styles.toTopButton} onPress={scrollToTop}>
          <Text style={styles.toTopText}>To Top</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const Index = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.WelcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome,</Text>
        <Text style={styles.welcomeTxt}>
          Discover the ultimate collection of PlayStation games with ease!
        </Text>
        <Text style={styles.welcomeBullets}>
          • Browse our extensive game library through our API.
        </Text>
        <Text style={styles.welcomeBullets}>
          • Search for your favorite titles instantly.
        </Text>
        <Text style={styles.welcomeBullets}>
          • Create your personalized favorite list to keep track of the games you love.
        </Text>
        <Text style={styles.welcomeTxt}>
          Your gaming journey starts here. Dive in and explore!
        </Text>
      </View>
      <GameList />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212"
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  loader: {
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 10,
  },
  WelcomeContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 10,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  welcomeTxt: {
    fontSize: 14,
    color: "#fff",
    marginTop: 10,
  },
  welcomeBullets: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#0070D1",
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  gameGenre: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  gameRelease: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 5,
  },
  developer: {
    fontSize: 12,
    color: "#bbb",
  },
  toTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0070D1",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  toTopText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  }
});
