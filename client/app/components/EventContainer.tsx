import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EventContainerProps {
  title: string;
  text: string;
}

const EventContainer: React.FC<EventContainerProps> = ({ title, text }) => {
  return (
    <View style={styles.eventContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    width: 220,
    backgroundColor: "lightgrey",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },
});

export default EventContainer;
