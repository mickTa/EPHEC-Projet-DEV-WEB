import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import { View, Text, StyleSheet } from "react-native";

interface TabContainerProps {
    tab1URL: string;
    tab2URL: string;
    tab3URL: string;
    onPressTab: () => {}
}

const TabContainer: React.FC<TabContainerProps> = ({ tab1URL, tab2URL, tab3URL, onPressTab }) => {
    return (
        <View style={styles.tabsBox}>
            <img src={tab1URL} height={"25px"} width={"25px"} onClick={onPressTab} />
            <img src={tab2URL} height={"25px"} width={"25px"} onClick={onPressTab} />
            <img src={tab3URL} height={"25px"} width={"25px"} onClick={onPressTab} />
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
    }
});

export default TabContainer;