import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ImageBackground, Image, Keyboard, View, Pressable } from 'react-native';
import { CheckBox, Button, Input, Layout, StyleService, Text, useStyleSheet, Icon } from '@ui-kitten/components';

import { renderPasswordIcon, TextInput, Loading, FeatureContainer, ReusableStyles } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import * as yup from "yup";
import { useYupValidationResolver } from '../../common/utils/commonComponentLogic';
import { FormProvider, useForm } from 'react-hook-form';
import { getPassword, getUsername, savePassword, saveUsername } from '../../native-common/storage/secureStore';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLoginMutation } from '../../common/store/reduxApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, selectConfiguration, setAuth, setConfiguration } from '../../common/store/authSlice';
import DebugView from '../../components/DebugView';

export const PersonIcon = (style) => (
  <Icon {...style} name='person' />
);

export default ({ navigation }) => {
  console.log('#Render :: Login')
  const [loginMethod] = useLoginMutation()
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const rememberMe = useState(false);  // FIXME: move remember me into a reusable redux, and use it in the remember me component instead of passing it from every auth related page

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

  const styles = useStyleSheet(themedStyles);
  const rs = useStyleSheet(ReusableStyles);
  const { addError } = useAPIError();

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
      addError('Login failed\n' + ex);  // translate me
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
    style: [rs.formControl, rs.transparentFormControl],
    labelStyle: rs.transparentFormControlLabel,
    autoCapitalize: 'none',
    size: 'large',
    textStyle: rs.transparentFormControlLabel,
  }

  const updateUrl = (value) => {
    dispatch(setConfiguration({
      'baseUrl': value,
    }))
  }
  const updateDatabase = (value) => {
    dispatch(setConfiguration({
      'database': value,
    }))
  }

  const testAddError = () => addError({message: 'test error'})


  return (
    <FeatureContainer loading={isLoading}>
      <View
        style={rs.formContainer}
      >
        <FormProvider {...formMethods}>
          <TextInput name='base_url' label='URL' {...commonInputProps}
            onChangeCallBack={updateUrl}
            inputProps={{
              accessoryRight: PersonIcon,
              onSubmitEditing: () => passwordInput.current.focus(),
            }} />
          <TextInput name='database' label='Database' {...commonInputProps}
            onChangeCallBack={updateDatabase}
            inputProps={{
              accessoryRight: PersonIcon,
              onSubmitEditing: () => passwordInput.current.focus(),
            }} />

          <TextInput name='login' label='Email' {...commonInputProps}
            inputProps={{
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

        <Button disabled={isLoading} onPress={handleSubmit(onSignInButtonPress)} style={styles.submitButton}>Login</Button>
        <Button status='control' onPress={testAddError} style={styles.submitButton}>Test Error Modal</Button>
      </View>
    </FeatureContainer>
  );
};

const themedStyles = StyleService.create({
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
});

