import React, { ReactNode } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

interface TabContainerProps {
  onPressEventTab1: () => void;
  onPressEventTab2: () => void;
  onPressEventTab3: () => void;
  onPressEventTab4: () => void;
  onPressEventTab5: () => void;
}

const TabContainer: React.FC<TabContainerProps> = ({
  onPressEventTab1,
  onPressEventTab2,
  onPressEventTab3,
  onPressEventTab4,
  onPressEventTab5,
}) => {
  return (
    <View style={styles.tabsBox}>
      <Pressable onPress={onPressEventTab1}>
        <Image source={require("../img/home-icon.png")} style={styles.icon} />
      </Pressable>
      <Pressable onPress={onPressEventTab2}>
        <Image
          source={require("../img/timetable-icon.png")}
          style={styles.icon}
        />
      </Pressable>
      <Pressable onPress={onPressEventTab3}>
        <Image source={require("../img/wallet-icon.png")} style={styles.icon} />
      </Pressable>
      <Pressable onPress={onPressEventTab4}>
        <Image
          source={require("../img/scanQrCode-icon.png")}
          style={styles.icon}
        />
      </Pressable>
      <Pressable onPress={onPressEventTab5}>
        <Image
          source={require("../img/profile-icon.png")}
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsBox: {
    width: "100%",
    backgroundColor: "gray",
    minHeight: 60,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 0,
  },
  icon: {
    height: 40,
    width: 40,
  },
});

export default TabContainer;
