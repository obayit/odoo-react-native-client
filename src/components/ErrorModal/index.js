import React, { useEffect, useState } from 'react';
import useAPIError from '../../common/hooks/useAPIError';
import { useStyleSheet, StyleService } from '@ui-kitten/components';
import { actions } from '../../common/providers/APIErrorProvider';
import { useNavigation } from '@react-navigation/native';
import { View, Platform, Linking } from 'react-native'
import * as Application from 'expo-application';
import YesNoModal from '../YesNoModal';


export function getStoreLink(){
  // TODO: test this on android and on ios.
  const appId = Application.applicationId;
  if(Platform.OS === 'ios'){
    return `itms://itunes.apple.com/app/id${appId}`
  }{
    return `market://details?id=${appId}`
  }
}


export function openLink(link){
  Linking.canOpenURL(link).then(
    (supported) => {
      supported && Linking.openURL(link);
    },
    (err) => console.log(err)
  );
}

export function openStoreLink(){
  openLink(getStoreLink());
}

export function openContactWhatsapp(number){
  openLink(`https://wa.me/${number}`);
}

export function callNumber(number){  // TODO: test this
  Linking.openURL(`tel://${number}`);  // directly opening, because canOpenURL returns false on android
}

export function openContactEmail(email){
  openLink(`mailto:${email}`);
}


export default function ErrorModal() {
  const { error, removeError } = useAPIError();
  const navigation = useNavigation(); 

  if(error && error.action === actions.sessionInvalid){
    // dispatch(updateLoginInfoAction(null));  // TODO: trigger logout redux action here
  }

  let type = 'error';
  let header = 'Error';

  let options = {};
  if(error && error.options){
    options = error.options;
  }

  if(options){
    if(options.type){
      type = options.type;
      if(type === 'success'){
        header = 'Success'
      }
    }
    if(options.header){
      header = options.header;
    }
  }

  const profile = {}; // TODO: use user profile here

  useEffect(() => {
    if(profile.force_reset_password === true){
      navigation.navigate('Change Password');
    }
  }, [profile]);

  const onOk = () => {
    if(error && error.action === actions.updateRequired){
      openStoreLink();
    }else{
      removeError()
    }
    if(options.navigateTo){
      navigation.navigate(options.navigateTo, options.navigationOptions);
    }
  }
  let buttonText = 'OK';
  if(error && error.action === actions.updateRequired){
    buttonText = 'Upgrade';
  }

  return (
    <YesNoModal showModal={error} setShowModal={onOk} type={type}
    header={header} body={(error && error.message) ? error.message : ''} yesLabel={buttonText}
    onDone={onOk}
    />
  );
}
