import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

interface CustomButtonProps {
  title: string;
  onPressEvent: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPressEvent }) => {
  return (
    <Pressable
      style={styles.button}
      onPress={onPressEvent}
      accessible={true}
      accessibilityLabel={title}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "black",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "gray",
  },
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
    maxWidth: "90%",
  },
});

export default CustomButton;
