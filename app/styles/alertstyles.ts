import { StyleSheet } from "react-native";

export const createAlertStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 30,
    },

    header: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 25,
      marginTop:30,
    },

    empty: {
      textAlign: "center",
      color: colors.textSecondary,
      marginTop: 40,
      fontSize: 15,
    },

    card: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 18,
      marginBottom: 18,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
    },

    iconContainer: {
      marginRight: 12,
      marginTop: 2,
    },

    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },

    message: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    time: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      opacity: 0.7,
    },
  });
