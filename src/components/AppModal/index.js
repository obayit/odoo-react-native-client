import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { ReusableStyles } from '../styles';
import { CustomButton } from '../CustomButtons';
import colors from '../colors';
import { DangerIcon, ErrorIcon, InfoIcon, SuccessIcon } from '../icons';
import { CustomSpacer } from '../Utils';

export default ({ showModal, setShowModal, parentOnYes, parentOnNo, header, body, confirmLabel, yesLabel, dangerText, type, onDone, style, hideOnBackdropPress }) => {
  const reusableStyles = ReusableStyles
  const [confirmChecked, setConfirmChecked] = useState(false);

  function onYes(){
    setConfirmChecked(false);
    parentOnYes();
    setShowModal(false);
  }
  function onNo(){
    setConfirmChecked(false);
    parentOnNo && parentOnNo();
    setShowModal(false);
  }

  let IconComponent = InfoIcon;
  if(type === 'success'){
    IconComponent = SuccessIcon;
  }else if (type === 'danger'){
    IconComponent = DangerIcon;
  }else if (type === 'error'){
    IconComponent = ErrorIcon;
  }

  const onBackdropPress = () => {
    if(hideOnBackdropPress){
      setShowModal(false);
    }
  }

  return (
    // style={[styles.container, style]} backdropStyle={styles.backdrop}
    <Portal>
    <Modal visible={showModal} onDismiss={onBackdropPress} contentContainerStyle={styles.containerStyle}>
    {/* <Modal 
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onBackdropPress}> */}
        <CustomSpacer height={40} />
        <IconComponent />
        <Text style={styles.header}>{header}</Text>
        {body ?
          <Text style={[reusableStyles.normalText, styles.bodyText]}>{body}</Text>
        : null }
        <View style={styles.buttonContainer}>
          {parentOnYes ?
          <>
            <CustomButton onPress={onYes} style={styles.yesButton} disabled={confirmLabel ? !confirmChecked : false}>{yesLabel ? yesLabel : 'Yes'}</CustomButton>
            <CustomButton status='basic' onPress={onNo} style={[reusableStyles.subtleButton, styles.noButton]}>No</CustomButton>
          </>
          : null }
          <>
          {onDone ?
            <CustomButton status='primary' onPress={onDone} style={styles.doneButton} disabled={confirmLabel ? !confirmChecked : false}>{yesLabel ? yesLabel : 'Done'}</CustomButton>
          : null }
          </>
        </View>
    </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  container:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 0.5,
    borderColor: colors.color_primary_600,
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
    marginTop: 18,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyText: {
    marginTop: 24,
    marginHorizontal: 30,
  },
  buttonContainer:{
    // flex: 1,
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

    backgroundColor: colors.color_primary_600,
    borderRadius: 24,
    borderWidth: 0,
    minWidth: 100,
    // color: '#121212',
  },
});

/*
{
  "error": {
    "code": 200,
    "data": {
      "arguments": [Array],
      "context": [Object],
      "debug": "Traceback (most recent call last):
  File \"/home/obayit/src/vs/odoo16/odoo/modules/registry.py\", line 64, in __new__
  ...
psycopg2.OperationalError: connection to server on socket \"/var/run/postgresql/.s.PGSQL.5432\" failed: FATAL:  database \"v16general\" does not exist",
      "message": "connection to server on socket \"/var/run/postgresql/.s.PGSQL.5432\" failed: FATAL:  database \"v16general\" does not exist",
      "name": "psycopg2.OperationalError"
    },
    "message": "Odoo Server Error"
  },
  "id": null,
  "jsonrpc": "2.0"
}
*/