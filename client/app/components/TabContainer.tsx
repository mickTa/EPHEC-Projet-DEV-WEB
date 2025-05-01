import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import {userDataFetcher} from "../misc/userDataFetcher";
import{useState,useEffect}from"react";
import { useRouter,usePathname } from "expo-router";


const router = useRouter();

const TabContainer: React.FC = () => {
    const [buttonTwo,setButtonTwo]=useState(<></>);
    const pathname=usePathname();
    useEffect(()=>{
        const fetchData=async()=>{
            const userData=await userDataFetcher();
            if(userData&&userData.role=="ORGANIZER"){
                setButtonTwo(<Pressable onPress={pathname=="/EventFormScreen"?null:()=>{router.push("/EventFormScreen")}}><Image source={require("../img/timetable-icon.png")} style={styles.icon} /></Pressable>)
            }
            if(userData&&userData.role=="USER"){
                setButtonTwo(<Pressable onPress={pathname=="/WalletQRCodeScreen"?null:()=>{router.push("/WalletQRCodeScreen")}}><Image source={require("../img/timetable-icon.png")} style={styles.icon} /></Pressable>)
            }
        }
        fetchData();
    },[])
    return (
        <View style={styles.tabsBox}>
            <Pressable onPress={pathname=="/HomeScreen"?null:()=>{router.push("/HomeScreen")}}>
                <Image source={require("../img/home-icon.png")} style={styles.icon} />
            </Pressable>
            {buttonTwo}
            <Pressable onPress={pathname=="/ProfileScreen"?null:()=>{router.push("/ProfileScreen")}}>
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