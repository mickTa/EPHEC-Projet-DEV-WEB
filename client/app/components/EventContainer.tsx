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
      <View style={styles.eventDesc}>
        <Text style={styles.txt}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    //todo: structure
    width: "100%",
    padding: 10,
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    maxWidth: "75%",
    minHeight: 250,
    backgroundColor: "lightgray",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "75%",
  },
  eventDesc: {
    //todo: structure
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    flexWrap: "wrap",
    width: "100%",
  },
  txt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "75%",
  },
});

export default EventContainer;
