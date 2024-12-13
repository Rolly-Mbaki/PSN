import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import GameList from "@/components/GameList";
import { Game } from "@/types";
import styles from './index.styles'

const Home = () => {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const headers = {
      Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvbGx5Lm1iYWtpQGFwLmJlIiwiaWF0IjoxNzMzMzYyMTIzfQ.rxGcugs7UeRhEM1hccxZOr9iaXywxvWBGei5CUCWp_g",
    };
    const baseURL = "https://sampleapis.assimilate.be/playstation/games";
  
    const loadAllGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(baseURL, { headers });
        const data: Game[] = await response.json();
        setGameList(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
      setLoading(false);
    };

    const onRefresh = async () => {
      try {
        setRefreshing(true);
        const response = await fetch(baseURL, { headers });
        const data: Game[] = await response.json();
        setGameList(data);
      } catch (error) {
        console.error("Failed to refresh games:", error);
      } finally {
        setRefreshing(false);
      }
    };
  
    useEffect(() => {
      loadAllGames();
    }, []);

  if(loading) return <View><Text>Loading data...</Text></View>

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
      <GameList gameList={gameList} onRefresh={onRefresh} refreshing={refreshing} />
    </View>
  );
};

export default Home;
