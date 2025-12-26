import React, { useEffect, useState } from 'react';
import useAPIError from '../../common/hooks/useAPIError';
import { actions } from '../../common/providers/APIErrorProvider';
import { useNavigation } from '@react-navigation/native';
import { View, Platform, Linking, Alert } from 'react-native'
import * as Application from 'expo-application';
import AppModal from '../AppModal';
import { clearErrors, flagShown, selectErrors } from '../../common/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';


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
  const errors = useSelector(selectErrors)
  const error = errors?.length ? errors[errors.length - 1] : false
  const navigation = useNavigation();
  const dispatch = useDispatch()

  let type = 'error';
  let header = 'Error';
  const headerData = {
    'error': 'Error',
    'info': 'Info',
    'danger': 'Danger',
    'success': 'Success',
  }

  const { message, ...options } = error;

  if(options){
    if(options.type){
      type = options.type;
      if(headerData[type]){
        header = headerData[type]
      }
    }
    if(options.header){
      header = options.header;
    }
  }

  const removeError = () => {
    // NOTE: should we remove all errors
    dispatch(clearErrors())
  }

  const profile = {}; // TODO: use user profile here

  useEffect(() => {
    // TODO: Move this to its own component
    if(profile.force_reset_password === true){
      navigation.navigate('Change Password');
    }
  }, [profile]);

  const onCancel = () => {
    removeError()
  }

  const onOk = () => {
    if(error?.action === actions.updateRequired){
      openStoreLink();
    }else{
      removeError()
    }
    if(options.navigateTo){
      navigation.navigate(options.navigateTo, options.navigationOptions);
    }
  }

  let buttonText = 'OK';

  return (
    <AppModal showModal={Boolean(error)} setShowModal={onOk} type={type}
    header={header} body={message} yesLabel={buttonText}
    onDone={onOk}
    />
  );
}
