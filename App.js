import React, { useCallback, useEffect, useState } from 'react';
import { mapping, light, dark } from '@eva-design/eva';
import { View, Platform, StatusBar } from 'react-native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './src/navigation/app.navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import APIErrorProvider from './src/common/providers/APIErrorProvider';
import { default as theme } from './theme/theme.json'; // <-- Import app theme
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';


import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { store, persistor } from './src/common/store/reduxApiStore'
import { PersistGate } from 'redux-persist/integration/react';

// sauce for status bar code: https://github.com/expo/expo/issues/3874#issuecomment-481459231
StatusBar.setBarStyle('dark-content');
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}

export default () => {
    const [appIsReady, setAppIsReady] = useState(false);

    const customMapping = {
        ...mapping,
        strict: {
            ...mapping.strict,
            'text-font-family': 'Roboto_400Regular'
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({
                    Roboto_100Thin,
                    Roboto_100Thin_Italic,
                    Roboto_300Light,
                    Roboto_300Light_Italic,
                    Roboto_400Regular,
                    Roboto_400Regular_Italic,
                    Roboto_500Medium,
                    Roboto_500Medium_Italic,
                    Roboto_700Bold,
                    Roboto_700Bold_Italic,
                    Roboto_900Black,
                    Roboto_900Black_Italic,
                });
            }
            catch {
                // handle error, maybe notify the user that he needs internet connection to use this app, or use a default font.
            }
            finally {
                setAppIsReady(true);
            }
        })();
    }, []);

    const onLayout = useCallback(() => {
        if (appIsReady) {
            SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View style={{ width: '100%', height: '100%' }} onLayout={onLayout}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider mapping={customMapping} theme={{ ...light, ...theme }}>
                        <SafeAreaProvider>
                            {/* <PersistGate loading={null} persistor={persistor}> */}
                            <APIErrorProvider>
                                <AppNavigator />
                            </APIErrorProvider>
                            {/* </PersistGate> */}
                        </SafeAreaProvider>
                    </ApplicationProvider>
                </PersistGate>
            </Provider>
        </View>
    );
}
