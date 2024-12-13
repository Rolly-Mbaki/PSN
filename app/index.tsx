import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import GameList from "@/components/GameList";
import { Game } from "@/types";
import { DataContext } from "@/datacontext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { games, loadData, loading } = useContext(DataContext)

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      loadData()
    } catch (error) {
      console.error("Failed to refresh games:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // const resetAsyncStorage = async () => {
    //   try {
    //     await AsyncStorage.clear();
    //     console.log('AsyncStorage has been reset');
    //   } catch (error) {
    //     console.error('Error resetting AsyncStorage:', error);
    //   }
    // };
    // resetAsyncStorage()
    loadData();
  }, []);

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
      <GameList gameList={games} onRefresh={onRefresh} refreshing={refreshing} loading={loading}/>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#121212"
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
  }
});