import React from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";

interface ListItemProps {
  texts: string[];
}

const ListItem: React.FC<ListItemProps> = ({ texts }) => {
  return (
    <View
      style={styles.item}
      accessible={true}
    >
        {texts && (texts.map((text) => (
          <p>{text}</p>
        )))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "100%",
  }
});

export default ListItem;