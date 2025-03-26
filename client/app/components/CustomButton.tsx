import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface CustomButtonProps {
    title: string;
    onPressEvent: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPressEvent }) => {
    return (
        <Pressable style={styles.button} onPress={onPressEvent}>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    button: {
      width: "100%",
      backgroundColor: "black",
      minHeight: 35,
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 0,
      borderWidth: 3,
      borderRadius: 12,
      borderColor: "gray"
    },
    title: {
      fontSize: 16,
      color: "white",
      fontWeight: "medium",
      textAlign: "center",
      maxWidth: "75%",
    },
});


export default CustomButton;