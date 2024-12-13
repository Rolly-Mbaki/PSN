import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: 10,
    },
    loader: {
        marginVertical: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: "#0070D1",
    },
    listContainer: {
        paddingBottom: 10,
    },
    WelcomeContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 10,
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
    },
    heartIcon: {
      position: "absolute",
      bottom: 15,
      right: 20,
    },
});

export default styles;