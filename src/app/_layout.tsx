import React, { useCallback, useEffect, useState } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import { PaperProvider } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';

import { store, persistor } from '../../src/common/store/reduxApiStore'
import { PersistGate } from 'redux-persist/integration/react';
import APIErrorProvider from '../common/providers/APIErrorProvider';

import { ThemeProvider, DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import { Slot } from 'expo-router';

// sauce for status bar code: https://github.com/expo/expo/issues/3874#issuecomment-481459231
StatusBar.setBarStyle('dark-content');
if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
}

export default () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
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
            <ThemeProvider value={DarkTheme}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <SafeAreaProvider>
                            <APIErrorProvider>
                                <PaperProvider>
                                    <Slot />
                                </PaperProvider>
                            </APIErrorProvider>
                        </SafeAreaProvider>
                    </PersistGate>
                </Provider>
            </ThemeProvider>
        </View>
    );
}
