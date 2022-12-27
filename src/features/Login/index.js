import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ImageBackground, Image, Keyboard, View, Pressable } from 'react-native';
import { CheckBox, Button, Input, Layout, StyleService, Text, useStyleSheet, Icon } from '@ui-kitten/components';

import { renderPasswordIcon, TextInput, Loading, LoginContainer, ReusableStyles  } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import * as yup from "yup";
import { useYupValidationResolver } from '../../common/utils/commonComponentLogic';
import { FormProvider, useForm } from 'react-hook-form';
import { getPassword, getUsername, savePassword, saveUsername } from '../../native-common/storage/secureStore';
import * as LocalAuthentication from 'expo-local-authentication';

export const PersonIcon = (style) => (
  <Icon {...style} fill="#CFD6E2" name='person' />
);

export default ({ navigation }) => {
  const rememberMe = useState(false);  // FIXME: move remember me into a reusable redux, and use it in the remember me component instead of passing it from every auth related page

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [disablePasswordVisible, setDisablePasswordVisible] = React.useState(false);
  const passwordInput = useRef(null);

  const yupSchema = yup.object().shape({
    login: yup.string().label('Login').required('Please enter your login'),
    password: yup.string().label('Password').required('Please enter your password')
  });
  const defaultValues = {
    login: 'admin',
    password: 'admin',
  }
  const resolver = useYupValidationResolver(yupSchema);
  const formMethods = useForm({ resolver, defaultValues });
  const { handleSubmit, setValue } = formMethods;

  const styles = useStyleSheet(themedStyles);
  const reusableStyles = useStyleSheet(ReusableStyles);
  const { addError } = useAPIError();

  const onSignInButtonPress = async (data) => {
    setPasswordVisible(false);
    setIsLoading(true);
    const password = data.password;
    let login = data.login;
    if(!login.includes('@') && login && login[0] === 's'){
      login = login[0].toUpperCase() + login.slice(1);
    }
    try{
      login = login.trim();
      // TODO: ACTUALLY CALL AUTH METHOD
      // const response = await Auth(addError, login, password, getDefaultDatabase());
      const response = {};
      setIsLoading(false);
      if(response){  // response is uid
          // dispatch(updateLoginInfoAction({isLoggedIn: true, auth: response}));  // TODO: call mutation here
          if(rememberMe){
            saveUsername(login);
            savePassword(password);
          }else{
            // clear the old username and password in case the user wants this devices to forget his info
            savePassword('');
          }
      }
    }catch (ex){
      addError('Login failed\n' + ex);  // translate me
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

  const toggle_remember_me = () => {}  // TODO: dispatch redux action

  const setSavedLoginInfo = async () => {
    if(rememberMe){
      const username = await getUsername();
      const password = await getPassword();
      if(username){
        setValue('login', username);
      }
      if(password){
        const localAuth = await LocalAuthentication.authenticateAsync();
        if(localAuth.success){
          setValue('password', password);
          // setDisablePasswordVisible(true);
          handleSubmit(onSignInButtonPress)();
        }
      }
    }
  }

  useEffect(() => {
    // setSavedLoginInfo();  // FIXME: activate this later
  }, []);

  const commonInputProps = {
    required: true,
    style: [reusableStyles.formControl, reusableStyles.transparentFormControl],
    labelStyle: reusableStyles.transparentFormControlLabel,
  }

  return (
    <LoginContainer>
      <View
        style={styles.formContainer}
        >
        {/* <TestBanner/> */}
        <Text
          // category='h3'
          textType='bold'
          lightText={true}
          style={styles.signInText}
          status='control'>
          Sign in
        </Text>
        <FormProvider {...formMethods}>
          <TextInput name='login' label='Email' {...commonInputProps}
          inputProps={{
            accessoryRight: PersonIcon,
            autoCapitalize: 'none',
            size: 'large',
            textStyle: reusableStyles.transparentFormControlLabel,
            onSubmitEditing: () => passwordInput.current.focus(),
            }}/>
            {/* NOTE: see this to implement auto login on pressing enter, https://stackoverflow.com/a/35765465/3557761 */}
          <TextInput name='password' label='Password' {...commonInputProps}
          inputProps={{
            ref: passwordInput,
            accessoryRight: disablePasswordVisible ? null : (props) => renderPasswordIcon({onPress: onPasswordIconPress, passwordVisible, ...props}),
            autoCapitalize: 'none',
            secureTextEntry: disablePasswordVisible || !passwordVisible,
            size: 'large',
            textStyle: reusableStyles.transparentFormControlLabel,
            onSubmitEditing: handleSubmit(onSignInButtonPress),
            }}/>
          {isLoading && <Loading status='control'/>}
        </FormProvider>
        <Button disabled={isLoading} onPress={handleSubmit(onSignInButtonPress)}>Login</Button>
      </View>
    </LoginContainer>
  );
};

const themedStyles = StyleService.create({
  formContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#71639E',
  },
  signInText: {
    marginBottom: 44,
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
  }
});

