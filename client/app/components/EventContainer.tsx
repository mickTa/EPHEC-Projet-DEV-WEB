import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

interface EventContainerProps {
  title: string;
  text: string;
  image?: string;
}

const screenWidth = Dimensions.get("window").width; 

const EventContainer: React.FC<EventContainerProps> = ({ title, text, image }) => {
  return (
    <View style={styles.eventContainer}>
      {image && (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    width: screenWidth * 0.8, 
    height: 250, 
    backgroundColor: "lightgrey",
    borderRadius: 12,
    padding: 0,
    elevation: 3,
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%", 
    height: "60%", 
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
    marginTop: 8,
  },
});

export default EventContainer;
