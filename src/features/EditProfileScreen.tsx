import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { TextInput, ReusableStyles, FeatureContainer } from '../components';

import { Button, Snackbar, Text } from 'react-native-paper'

import { useDispatch } from 'react-redux';
import { logOut } from '../common/store/authSlice';
import { emptyObject, odooApi, useProductsQuery } from '../common/store/reduxApi';
import { FormProvider } from 'react-hook-form';
import useForm from '../common/hooks/useForm';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButtons';
import { useNavigation } from '@react-navigation/native';


export default ({ route }) => {
  const dispatch = useDispatch();
  const profileQuery = odooApi.useProfileQuery({});
  const record = profileQuery.data ?? emptyObject;
  const navigation = useNavigation()

  const rs = ReusableStyles;

  const onLogout = () => dispatch(logOut());

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
  };
  const fieldPhone = {
    name: 'phone',
    label: 'Phone',
    required: true,
    type: 'char',
  };
  const fieldCity = {
    name: 'city',
    label: 'City',
    required: true,
    type: 'char',
    accessor: record => record?.address?.city,
  };
  const fieldState = {
    name: 'state_id',
    label: 'State',
    required: true,
    type: 'm2o',
    accessor: record => record?.address?.state?.name,
  };
  const fieldCountry = {
    name: 'country_id',
    label: 'Country',
    required: true,
    type: 'm2o',
    accessor: record => record?.address?.country?.name,
  };
  let fields = [
    fieldName,
    fieldEmail,
    fieldPhone,
    fieldCity,
    fieldState,
    fieldCountry,
  ]

  const { formMethods } = useForm(fields, { record });
  const [submitQueryFn, submitQuery] = odooApi.useUpdateProfileMutation()
  const [snackbarData, setSnackbarData] = useState({
    visible: false,
    contentText: '',
  })

  async function submitFormAsync(data) {
    const response = await submitQueryFn(data)
    if (response.data?.is_success) {
      setSnackbarData({
        visible: true,
        contentText: 'Saved.',
      })
    }
  }

  const sharedInputProps = {
    disabled: submitQuery.isLoading
  }

  function goBack() {
    navigation.canGoBack() && navigation.goBack()
  }

  return (
    <FeatureContainer>
      <ScrollView contentContainerStyle={styles.formContainer}
        refreshControl={<RefreshControl refreshing={submitQuery.isLoading} />}
      >
        <FormProvider {...formMethods}>
          <TextInput field={fieldName} inputProps={sharedInputProps} />
          <TextInput field={fieldEmail} inputProps={sharedInputProps} />
          <TextInput field={fieldPhone} inputProps={sharedInputProps} />
          <TextInput field={fieldCity} inputProps={sharedInputProps} />
          <TextInput field={fieldState} inputProps={sharedInputProps} />
          <TextInput field={fieldCountry} inputProps={sharedInputProps} />

          <Button onPress={formMethods.handleSubmit(submitFormAsync)} icon='send'>Submit</Button>
          <Button onPress={profileQuery.refetch} icon='refresh'>reload</Button>



        </FormProvider>
      </ScrollView>
      <Snackbar
        visible={snackbarData.visible}
        onDismiss={goBack}
        action={{
          label: 'Close',
          onPress: goBack,
        }}>
        {snackbarData.contentText}
      </Snackbar>
    </FeatureContainer>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    margin: 8,
  },
});
