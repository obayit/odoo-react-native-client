import { useEffect, useMemo, useState } from "react";
import { Image as NativeImage /* native image doesn't send headers in android */, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from "react-redux";
import { selectAuth, selectConfiguration } from "../common/store/authSlice";
import * as Clipboard from 'expo-clipboard';
import { CustomButton } from "./CustomButtons";
import { Image } from 'expo-image'
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../navigation/navigation.constants";

export default function AppHeader() {
    const navigation = useNavigation()
    function navigateToCart(){
        navigation.navigate(ScreenNames.Cart)
    }
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <IconButton icon='cart' onPress={navigateToCart}/>
        </View>
    )
}

const styles = StyleSheet.create({
})
