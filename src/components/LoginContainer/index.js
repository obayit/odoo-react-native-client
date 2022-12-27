import React from 'react';
import { Text, useStyleSheet, StyleService } from '@ui-kitten/components';
import { ImageBackground, Image, View } from 'react-native';
import { FeatureContainer } from '../FeatureContainer';
import useVersion from '../../hooks/useVersion';
import { KeyboardAvoidingView } from '../3rd-party';

export default function LoginContainer ({children, logoStyle}) {
    const styles = useStyleSheet(themedStyles);
    let imageStyle = [styles.headerContainer];
    if(logoStyle){
      imageStyle.push(logoStyle);
    }
    useVersion();  // this is necessary to force upgrade
    return (
      <FeatureContainer>
        <View style={imageStyle}>
          <Image source={require('../../../assets/images/logo_for_login_page.png')} style={styles.photo}/>
          <Text
            category='h1' style={styles.headerText}
            status='control'>
            Ant Client
          </Text>
        </View>
        <KeyboardAvoidingView style={{backgroundColor: 'transparent'}}>
        {children}
        </KeyboardAvoidingView>
      </FeatureContainer>
    );
};

const themedStyles = StyleService.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  photo: {
    alignSelf: 'center',
    marginTop: 50,
    width: 112,
    height: 112,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00A09D',
  },
  headerText: {
    marginTop: 20,
    // fontWeight: 500,  // NOTE: android does not accept fontWeight :( you must provide full font family name, see MainText
  },
});
