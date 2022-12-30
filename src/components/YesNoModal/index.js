import React, { useState } from 'react';
import { CheckBox, Card, Modal, Spinner, Input, Button, Text, Layout, useStyleSheet, StyleService, ButtonGroup } from '@ui-kitten/components';
import { Image, View } from 'react-native';
import { ReusableStyles } from '../styles';


// TODO: use the native Alert instead of a custom component, see showAlert() below
export default function YesNoModal({ showModal, setShowModal, parentOnYes, parentOnNo, header, body, confirmLabel, yesLabel, dangerText, type, onDone, style, hideOnBackdropPress }) {
  const styles = useStyleSheet(themedStyles);
  const reusableStyles = useStyleSheet(ReusableStyles);
  const [confirmChecked, setConfirmChecked] = useState(false);

  function onYes(){
    setConfirmChecked(false);
    parentOnYes();
    setShowModal(false);
  };
  function onNo(){
    setConfirmChecked(false);
    parentOnNo && parentOnNo();
    setShowModal(false);
  };

  let icon = require('../../../assets/images/icons/info.png');
  if(type === 'success'){
    icon = require('../../../assets/images/icons/success.png');
  }else if (type === 'danger'){
    icon = require('../../../assets/images/icons/danger.png');
  }else if (type === 'error'){
    icon = require('../../../assets/images/icons/error.png');
  }

  const onBackdropPress = () => {
    if(hideOnBackdropPress){
      setShowModal(false);
    }
  }

  const showAlert = () =>
  // TODO: use this method to show the Alert instead of using the UI Kitten modal
    Alert.alert(
      header,
      body,
      [
        {
          text: "Ok",
          onPress: () => Alert.alert("Ok Pressed"),
          style: "default",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );

  return (
    <Modal style={[styles.container, style]} backdropStyle={styles.backdrop} visible={showModal} onBackdropPress={onBackdropPress}>
        <Image source={icon} style={styles.icon}/>
        <Text textType='bold' style={[reusableStyles.largeText, styles.header]}>{header}</Text>
        {!!body &&
          <Text style={[reusableStyles.normalText, styles.bodyText]}>{body}</Text>
        }
        <View style={styles.buttonContainer}>
          {parentOnYes &&
          <>
            <Button onPress={onYes} style={styles.yesButton} disabled={confirmLabel ? !confirmChecked : false}>{yesLabel ? yesLabel : 'Yes'}</Button>
            <Button status='basic' onPress={onNo} style={[reusableStyles.subtleButton, styles.noButton]}>No</Button>
          </>
          }
          {onDone &&
            <Button status='primary' onPress={onDone} style={styles.doneButton} disabled={confirmLabel ? !confirmChecked : false}>{yesLabel ? yesLabel : 'Done'}</Button>
          }
        </View>
    </Modal>
  );
};

const themedStyles = StyleService.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  container:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxWidth: 300,
  },
  icon: {
    width: 40.83,
    height: 40.83,
    marginTop: 41.08,
  },
  header: {
    marginTop: 19.08,
  },
  bodyText: {
    marginTop: 24,
    marginHorizontal: 30,
  },
  buttonContainer:{
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',

    marginTop: 32,
    marginBottom: 26,
  },
  button: {
    marginHorizontal: 8,
  },
  yesButton: {
    minWidth: 100,
    maxWidth: 100,
    marginTop: 0,
    marginLeft: 0,
  },
  noButton: {
    minWidth: 100,
  },
  doneButton: {
    // height: 48,

    backgroundColor: 'color-primary-600',
    borderRadius: 24,
    borderWidth: 0,
    minWidth: 100,
    // color: '#121212',
  },
});
