import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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

  export default styles;