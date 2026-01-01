import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ImageBackground, Image, Keyboard, View, Pressable, StyleSheet, Text, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';


import { renderPasswordIcon, TextInput, Loading, FeatureContainer, ReusableStyles } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import * as yup from "yup";
import { getRtkErrorMessage, useYupValidationResolver } from '../../common/utils/commonComponentLogic';
import { FormProvider, useForm } from 'react-hook-form';
import { getPassword, getUsername, savePassword, saveUsername } from '../../native-common/storage/secureStore';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLoginMutation } from '../../common/store/reduxApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, selectConfiguration, setAuth, updateConfiguration } from '../../common/store/authSlice';
import DebugView from '../../components/DebugView';
import { CustomButton } from '../../components/CustomButtons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomSpacer } from '../../components/Utils';
import { SettingsIcon } from '../../components/icons';

export const PersonIcon = (style) => (
  <MaterialCommunityIcons {...style} name='person' />
);

export default ({ navigation }) => {
  const [loginMethod, loginMutationQuery] = useLoginMutation()
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const rememberMe = useState(false);  // FIXME: move remember me into a reusable redux, and use it in the remember me component instead of passing it from every auth related page
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [disablePasswordVisible, setDisablePasswordVisible] = React.useState(false);
  const passwordInput = useRef(null);

  const yupSchema = yup.object().shape({
    base_url: yup.string().label('URL'),
    database: yup.string().label('Database').required('Please Database name'),
    login: yup.string().label('Login').required('Please enter your login'),
    password: yup.string().label('Password').required('Please enter your password')
  });
  const configuration = useSelector(selectConfiguration)
  const defaultValues = {
    base_url: configuration.baseUrl,
    database: configuration.database,
    login: 'admin',
    password: 'admin',
  }
  const resolver = useYupValidationResolver(yupSchema);
  const formMethods = useForm({ resolver, defaultValues });
  const { handleSubmit, setValue } = formMethods;

  const rs = ReusableStyles;
  const errorApi = useAPIError();
  const { addError } = errorApi

  const onSignInButtonPress = async (data) => {
    setPasswordVisible(false);
    setIsLoading(true);
    const password = data.password;
    let login = data.login;
    try {
      login = login.trim();
      // NOTE: unwraps either returns the success response, or throws an error
      let auth = await loginMethod({ login, password, db: data.database }).unwrap();  // use .unwrap() here?
      dispatch(setAuth({ ...auth }))
      const response = {};
      if (response) {  // response is uid
        if (rememberMe) {
          saveUsername(login);
          savePassword(password);
        } else {
          // clear the old username and password in case the user wants this devices to forget his info
          savePassword('');
        }
      }
    } catch (ex) {
      const error_message = getRtkErrorMessage(ex)
      addError(`Login failed:\n${error_message}`);  // translate me
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpButtonPress = () => {
    Keyboard.dismiss();
    navigation && navigation.navigate('Sign Up');
  };

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggle_remember_me = () => { }  // TODO: dispatch redux action

  const setSavedLoginInfo = async () => {
    if (rememberMe) {
      const username = await getUsername();
      const password = await getPassword();
      if (username) {
        setValue('login', username);
      }
      if (password) {
        const localAuth = await LocalAuthentication.authenticateAsync();
        if (localAuth.success) {
          setValue('password', password);
          // setDisablePasswordVisible(true);
          handleSubmit(onSignInButtonPress)();
        }
      }
    }
  }

  useEffect(() => {
    // setSavedLoginInfo();  // FIXME: activate this later
    // handleSubmit(onSignInButtonPress);
  }, []);

  const commonInputProps = {
    required: true,
    // style: [rs.formControl, rs.transparentFormControl],
    // labelStyle: rs.transparentFormControlLabel,
    autoCapitalize: 'none',
    size: 'large',
    textStyle: rs.transparentFormControlLabel,
  }

  const updateUrl = (value) => {
    if (value !== undefined) {
      dispatch(updateConfiguration({
        'baseUrl': value,
      }))
    }
  }
  const updateDatabase = (value) => {
    if (value !== undefined) {
      dispatch(updateConfiguration({
        'database': value,
      }))
    }
  }

  const testAddError = () => addError('test error')


  return (
    <FeatureContainer loading={isLoading}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >
        <FormProvider {...formMethods}>

          <View style={styles.settingsIconContainer}>
            <CustomButton onPress={() => setSettingsVisible(!settingsVisible)} icon={() => <SettingsIcon />} />
          </View>
          {settingsVisible ?
            <Animated.View
              key={'uniqueKey'}
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              // exiting animation doesn't work, at least on debugging mode, maybe it will work in production
            >
              <TextInput name='base_url' label='URL' {...commonInputProps}
                onChangeCallBack={updateUrl}
                inputProps={{
                  autoCapitalize: 'none',
                  accessoryRight: PersonIcon,
                  onSubmitEditing: () => passwordInput.current.focus(),
                }} />
              <TextInput name='database' label='Database' {...commonInputProps}
                onChangeCallBack={updateDatabase}
                inputProps={{
                  autoCapitalize: 'none',
                  accessoryRight: PersonIcon,
                  onSubmitEditing: () => passwordInput.current.focus(),
                }} />
              <CustomSpacer height={40}/>
            </Animated.View>
            : null}
          <TextInput name='login' label='Login' {...commonInputProps}
            inputProps={{
              autoCapitalize: 'none',
              accessoryRight: PersonIcon,
              onSubmitEditing: () => passwordInput.current.focus(),
            }} />
          {/* NOTE: see this to implement auto login on pressing enter, https://stackoverflow.com/a/35765465/3557761 */}
          <TextInput name='password' label='Password' {...commonInputProps}
            inputProps={{
              ref: passwordInput,
              accessoryRight: disablePasswordVisible ? null : (props) => renderPasswordIcon({ onPress: onPasswordIconPress, passwordVisible, ...props }),
              secureTextEntry: disablePasswordVisible || !passwordVisible,
              onSubmitEditing: handleSubmit(onSignInButtonPress),
            }} />

        </FormProvider>
        <DebugView />
        <CustomButton disabled={isLoading} onPress={handleSubmit(onSignInButtonPress)} style={styles.submitButton} icon='login'>Login</CustomButton>
        {/* <CustomButton status='control' onPress={testAddError} style={styles.submitButton}>Test Error Modal</CustomButton>
        <CustomButton status='control' onPress={() => errorApi.addError('hi', { type: 'info' })} style={styles.submitButton}>Test Info Modal</CustomButton>
        <CustomButton status='control' onPress={() => errorApi.addError('hi', { type: 'success' })} style={styles.submitButton}>Test Success Modal</CustomButton>
        <CustomButton status='control' onPress={() => errorApi.addError('hi', { type: 'danger' })} style={styles.submitButton}>Test Danger Modal</CustomButton>
        <CustomButton status='control' onPress={errorApi.removeError} style={styles.submitButton}>remove errors</CustomButton> */}
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
});

