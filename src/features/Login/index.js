import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ImageBackground, Image, Keyboard, View, Pressable } from 'react-native';
import { CheckBox, Button, Input, Layout, StyleService, Text, useStyleSheet, Icon } from '@ui-kitten/components';

import { renderPasswordIcon, TextInput, Loading, FeatureContainer, ReusableStyles  } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import * as yup from "yup";
import { useYupValidationResolver } from '../../common/utils/commonComponentLogic';
import { FormProvider, useForm } from 'react-hook-form';
import { getPassword, getUsername, savePassword, saveUsername } from '../../native-common/storage/secureStore';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLoginMutation } from '../../common/store/reduxApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setAuth } from '../../common/store/authSlice';

export const PersonIcon = (style) => (
  <Icon {...style} name='person' />
);

export default ({ navigation }) => {
  const [loginMethod, loginResult] = useLoginMutation()
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
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
      // NOTE: unwraps either returns the success response, or throws an error
      let auth = await loginMethod({login, password}).unwrap();  // use .unwrap() here?
      dispatch(setAuth({ ...auth }))
      const response = {};
      if(response){  // response is uid
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
    }finally{
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
    handleSubmit(onSignInButtonPress);
  }, []);

  const commonInputProps = {
    required: true,
    style: [reusableStyles.formControl, reusableStyles.transparentFormControl],
    labelStyle: reusableStyles.transparentFormControlLabel,
    autoCapitalize: 'none',
    size: 'large',
    textStyle: reusableStyles.transparentFormControlLabel,
  }

  return (
    <FeatureContainer>
      <View
        style={styles.formContainer}
        >
        <FormProvider {...formMethods}>
          <TextInput name='login' label='Email' {...commonInputProps}
          inputProps={{
            accessoryRight: PersonIcon,
            onSubmitEditing: () => passwordInput.current.focus(),
            }}/>
            {/* NOTE: see this to implement auto login on pressing enter, https://stackoverflow.com/a/35765465/3557761 */}
          <TextInput name='password' label='Password' {...commonInputProps}
          inputProps={{
            ref: passwordInput,
            accessoryRight: disablePasswordVisible ? null : (props) => renderPasswordIcon({onPress: onPasswordIconPress, passwordVisible, ...props}),
            secureTextEntry: disablePasswordVisible || !passwordVisible,
            onSubmitEditing: handleSubmit(onSignInButtonPress),
            }}/>
          <Text>isLoading: {JSON.stringify(isLoading)}</Text>
          <Loading status='control' isLoading={isLoading}/>
        </FormProvider>

        <Button disabled={isLoading} onPress={handleSubmit(onSignInButtonPress)} style={styles.submitButton}>Login</Button>
      </View>
    </FeatureContainer>
  );
};

const themedStyles = StyleService.create({
  formContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-1',
  },
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

