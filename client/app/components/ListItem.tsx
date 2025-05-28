import React from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";

interface ListItemProps {
  texts: string[];
}

const ListItem: React.FC<ListItemProps> = ({ texts }) => {
  return (
    <View
      style={styles.items}
      accessible={true}
    >
        {texts && (texts.map((text) => (
          <Text>{text}</Text>
        )))}
    </View>
  );
};

const styles = StyleSheet.create({
  items: {
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ListItem;