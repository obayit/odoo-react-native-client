import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ImageBackground, Image, Keyboard, View, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';


import { TextInput, Loading, FeatureContainer, ReusableStyles } from '../components';

import useAPIError from '../common/hooks/useAPIError';
import * as yup from "yup";
import { getRtkErrorMessage, useYupValidationResolver } from '../common/utils/commonComponentLogic';
import { FormProvider, useWatch } from 'react-hook-form';
import { getPassword, getUsername, savePassword, saveUsername } from '../native-common/storage/secureStore';
import * as LocalAuthentication from 'expo-local-authentication';
import { odooApi, useLoginMutation } from '../common/store/reduxApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, selectConfiguration, setAuth, setConfiguration, updateAuth, updateConfiguration } from '../common/store/authSlice';
import DebugView from '../components/DebugView';
import { CustomButton } from '../components/CustomButtons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomSpacer, PasswordIcon } from '../components/Utils';
import { SettingsIcon } from '../components/icons';
import colors from '../components/colors';
import { Text, TextInput as TextInputPaper, Button } from 'react-native-paper';
import { ScreenNames } from '../navigation/navigation.constants';
import useForm from '../common/hooks/useForm';

export const PersonIcon = (style) => (
  <MaterialCommunityIcons {...style} name='person' />
);

export default ({ navigation }) => {
  const [signupFn, signupQuery] = odooApi.useSignupMutation()
  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [disablePasswordVisible, setDisablePasswordVisible] = React.useState(false);
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);


  const fieldName = {
    name: 'name',
    label: 'Name',
    required: true,
    type: 'char',
  };
  const fieldEmail = {
    name: 'email',
    label: 'Email',
    required: true,
    type: 'char',
    is_email: true,
  };
  const fieldPassword = {
    name: 'password',
    label: 'Password',
    required: true,
    type: 'char',
  };
  const fieldConfirmPassword = {
    name: 'confirm_password',
    label: 'Confirm Password',
    required: true,
    type: 'char',
  };
  const fields = [
    fieldName,
    fieldEmail,
    fieldPassword,
    fieldConfirmPassword,
  ]

  const { formMethods } = useForm(fields);
  const configuration = useSelector(selectConfiguration)
  const { handleSubmit, setValue } = formMethods;

  const rs = ReusableStyles;
  const errorApi = useAPIError();
  const { addError } = errorApi

  const onSubmit = async (data) => {
    setPasswordVisible(false);
    setIsLoading(true);
    try {
      const mutation_params = {
        login: data[fieldEmail.name].trim(),
        name: data[fieldName.name].trim(),
        password: data[fieldPassword.name],
        confirm_password: data[fieldConfirmPassword.name],
        // db: data.database
      }
      // NOTE: unwraps either returns the success response, or throws an error
      let authResponse = await signupFn(mutation_params).unwrap();  // use .unwrap() here?
      if (authResponse?.uid) {
        dispatch(updateAuth({ ...authResponse }))
      } else {
        addError('Signup Failed');  // translate me
      }
    } catch (ex) {
      const error_message = getRtkErrorMessage(ex)
      addError(`${error_message}`);  // translate me
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <FeatureContainer loading={isLoading}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >

        <Image
          style={styles.logo}
          source={require('../../assets/furnish-logo-nobg.png')}
          resizeMode='contain'
        />

        <FormProvider {...formMethods}>

          <TextInput field={fieldName} inputProps={{
            ref: nameInput,
            onSubmitEditing: () => emailInput.current.focus(),
            icon: 'account',
            mode: 'outlined',
            autoCapitalize: 'words',
          }} />
          <CustomSpacer height={8} />
          <TextInput field={fieldEmail}
            inputProps={{
              ref: emailInput,
              autoCapitalize: 'none',
              icon: 'email',
              onSubmitEditing: () => passwordInput.current.focus(),
              autoComplete: 'username',
              textContentType: 'username',
              importantForAutofill: 'yes',
              autoCorrect: false,
              mode: 'outlined',
            }} />
          {/* NOTE: see this to implement auto login on pressing enter, https://stackoverflow.com/a/35765465/3557761 */}
          <CustomSpacer height={8} />
          <TextInput field={fieldPassword}
            inputProps={{
              ref: passwordInput,
              autoCapitalize: 'none',
              onSubmitEditing: () => confirmPasswordInput.current.focus(),
              autoComplete: 'password',
              textContentType: 'password',
              importantForAutofill: 'yes',
              autoCorrect: false,
              mode: 'outlined',
              secureTextEntry: !passwordVisible,
              right: <TextInputPaper.Icon icon={passwordVisible ? 'eye' : 'eye-off'} onPress={onPasswordIconPress} />,
            }}
          />
          <CustomSpacer height={8} />
          <TextInput field={fieldConfirmPassword}
            inputProps={{
              ref: confirmPasswordInput,
              right: <TextInputPaper.Icon icon={passwordVisible ? 'eye' : 'eye-off'} onPress={onPasswordIconPress} />,
              secureTextEntry: disablePasswordVisible || !passwordVisible,
              onSubmitEditing: handleSubmit(onSubmit),
              mode: 'outlined',
              secureTextEntry: !passwordVisible,
            }} />

        </FormProvider>
        <DebugView />
        <Button mode='contained' disabled={isLoading} onPress={handleSubmit(onSubmit)} style={styles.submitButton}>Submit</Button>
        <Button mode='outlined' disabled={isLoading} onPress={() => navigation.navigate(ScreenNames.login)} style={styles.submitButton} >Login</Button>
        {/* <Button mode='outlined' disabled={isLoading} onPress={() => {
          formMethods.trigger()
        }} style={styles.submitButton}>Trigger</Button> */}
        {/* <Button mode='outlined' disabled={isLoading} onPress={() => {
          const rando = Math.floor(Math.random() * 90000) + 10000;
          formMethods.setValue(fieldName.name, `Obay Abdelgadir ${rando}`)
          formMethods.setValue(fieldEmail.name, `obayit+${rando}@gmail.com`)
          formMethods.setValue(fieldPassword.name, `1234567890abcd`)
          formMethods.setValue(fieldConfirmPassword.name, '1234567890abcd')
        }} style={styles.submitButton}>Autofill</Button> */}
        {/* <Text>{JSON.stringify(formMethods.formState.errors)}</Text> */}
        <Text>d={JSON.stringify(signupQuery.data)}</Text>
      </ScrollView>
    </FeatureContainer>
  );
};

const styles = StyleSheet.create({
  signInText: {
    marginBottom: 20,
    fontSize: 30,
  },
  rememberMeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  forgotPassword: {
    marginTop: 0,
  },
  submitButton: {
    marginTop: 10,
  },
  scrollContainer: {
    margin: 16,
  },
  settingsIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logo: {
    height: 200,
    width: '100%',
  },
});

/*

*/