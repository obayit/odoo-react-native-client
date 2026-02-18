import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { TextInput, ReusableStyles, FeatureContainer } from '../components';

import { Button, Snackbar, Text } from 'react-native-paper'

import { useDispatch } from 'react-redux';
import { logOut } from '../common/store/authSlice';
import { emptyList, emptyObject, odooApi, useProductsQuery } from '../common/store/reduxApi';
import { FormProvider, useWatch } from 'react-hook-form';
import useForm from '../common/hooks/useForm';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButtons';
import { useNavigation } from '@react-navigation/native';
import SelectionInput from '../components/SelectionInput';
import { CustomSpacer, SectionHeader } from '../components/Utils';
import AppHeader from '../components/AppHeader';


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
    accessor: record => record?.address?.state?.id,
  };
  const fieldCountry = {
    name: 'country_id',
    label: 'Country',
    required: true,
    type: 'm2o',
    accessor: record => record?.address?.country?.id,
  };
  const fields = [
    fieldName,
    fieldEmail,
    fieldPhone,
    fieldCity,
    fieldState,
    fieldCountry,
  ]

  const { formMethods } = useForm(fields, { record });
  const watchedCountryId = useWatch({ name: 'country_id', control: formMethods.control })
  const [submitQueryFn, submitQuery] = odooApi.useUpdateProfileMutation()
  const editDataQuery = odooApi.useUpdateProfileDataQuery({
    countryId: watchedCountryId,
  })
  const editData = editDataQuery.data ?? emptyList
  const [snackbarData, setSnackbarData] = useState({
    visible: false,
    contentText: '',
  })

  async function submitFormAsync(data) {
    const dataToSubmit = {...data}
    fields.map(field => {
      if(['m2o'].includes(field.type)){
        if(dataToSubmit[field.name]){
          dataToSubmit[field.name] = Number(dataToSubmit[field.name])
        }
      }
    })
    const response = await submitQueryFn(dataToSubmit)
    if (response.data?.is_success) {
      setSnackbarData({
        visible: true,
        contentText: 'Saved.',
      })
    }
  }

  const sharedInputProps = {
    disabled: submitQuery.isLoading || profileQuery.isLoading
  }

  function goBack() {
    navigation.canGoBack() && navigation.goBack()
  }

  return (
    <FeatureContainer style={{ flex: 1 }}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.formContainer}
        refreshControl={<RefreshControl refreshing={submitQuery.isLoading} />}
      >
        <FormProvider {...formMethods}>
          <SectionHeader title='Personal Information' />
          <TextInput field={fieldName} inputProps={sharedInputProps} />
          <TextInput field={fieldEmail} inputProps={sharedInputProps} />
          <TextInput field={fieldPhone} inputProps={sharedInputProps} />
          <SectionHeader title='Address' />
          <TextInput field={fieldCity} inputProps={sharedInputProps} />
          <SelectionInput field={fieldState} inputProps={sharedInputProps}
            data={editData} optionsExtractor={data => data?.states?.map(country => ({ label: country.name, value: country.id + '' }))}
          />
          <SelectionInput field={fieldCountry} inputProps={sharedInputProps}
            data={editData} optionsExtractor={data => data?.countries?.map(country => ({ label: country.name, value: country.id + '' }))}
          />
          <CustomSpacer />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
            <Button mode='contained' onPress={formMethods.handleSubmit(submitFormAsync)} icon='content-save'>Save</Button>
          </View>
          {/* <Button onPress={() => {profileQuery.refetch(); editDataQuery.refetch()}} icon='refresh'>reload</Button> */}

          {/* <Text>{JSON.stringify(editData)}</Text> */}
          {/* {editDataQuery.error ? <Text>{JSON.stringify(editDataQuery.error)}</Text> : null } */}
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
    paddingBottom: 72, // Add padding so content doesn't hide behind button
  },
});
