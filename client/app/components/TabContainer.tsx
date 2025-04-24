import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";

interface TabContainerProps {
    onPressEventTab1: () => void;
    onPressEventTab2: () => void;
    onPressEventTab3: () => void;
}

const TabContainer: React.FC<TabContainerProps> = ({ onPressEventTab1, onPressEventTab2, onPressEventTab3 }) => {
    return (
        <View style={styles.tabsBox}>
            <Pressable onPress={onPressEventTab1}>
                <Image source={require("../img/home-icon.png")} style={styles.icon} />
            </Pressable>
            <Pressable onPress={onPressEventTab2}>
                <Image source={require("../img/timetable-icon.png")} style={styles.icon} />
            </Pressable>
            <Pressable onPress={onPressEventTab3}>
                <Image source={require("../img/profile-icon.png")} style={styles.icon} />
            </Pressable>
        </View>
    )
};

// "../../assets/images/react-logo.png"

const styles = StyleSheet.create({
    tabsBox: {
      width: "100%",
      backgroundColor: "gray",
      minHeight: 60, //change to fixed value
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 0
    },
    icon: {
        height: 40,
        width: 40
    }
});

export default TabContainer;