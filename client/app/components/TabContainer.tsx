import React, { ReactNode } from "react";
//import { IconType } from "react-icons";
import { View, Text, StyleSheet, Image } from "react-native";

const TabContainer = () => {
    return (
        <View style={styles.tabsBox}>
            <Image source={require("../img/react-logo.png")} style={styles.icon} />
            <Image source={require("../img/react-logo.png")} style={styles.icon} />
            <Image source={require("../img/react-logo.png")} style={styles.icon} />
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
        height: 30,
        width: 30
    }
});

export default TabContainer;