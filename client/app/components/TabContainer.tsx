import React from "react";
import { IconType } from "react-icons";
import { View, Text, StyleSheet } from "react-native";

interface TabContainerProps {
    tab1: IconType;
    tab2: IconType;
    tab3: IconType;
    onPressTab: () => {}
}

const TabContainer: React.FC<TabContainerProps> = ({ tab1, tab2, tab3, onPressTab }) => {
    return (
        <View style={styles.tabsBox}>
            <p>Icon1</p>
            <p>Icon2</p>
            <p>Icon3</p>
        </View>
    )
};

const styles = StyleSheet.create({
    tabsBox: {
      width: "100%",
      backgroundColor: "lightgray",
      maxHeight: "7%", //change to fixed value
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center"
    }
});

export default TabContainer;