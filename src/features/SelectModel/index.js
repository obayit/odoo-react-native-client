import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button, Input } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer, TextInput } from '../../components';

import * as yup from "yup";
import { useYupValidationResolver } from '../../common/utils/commonComponentLogic';
import { FormProvider, useForm } from 'react-hook-form';
import useLogout from '../../hooks/useLogout';


export default ({ navigation }) => {
    const rs = useStyleSheet(ReusableStyles);
    const styles = useStyleSheet(themedStyles);
    const logoutHelper = useLogout()

    const onPress = (data) => {
        navigation.navigate('Dynamic List', {model: data.model})
    }

    const yupSchema = yup.object().shape({
        model: yup.string().label('Model').required('Please enter model name')
    });
    const defaultValues = {
        model: 'res.users',
    }
    const resolver = useYupValidationResolver(yupSchema);
    const formMethods = useForm({ resolver, defaultValues });
    const { handleSubmit } = formMethods;

    return (
        <FeatureContainer>
            <View style={rs.formContainer}>
                <FormProvider {...formMethods}>
                    <Text>Please enter a model name that has a name field e.g: res.users</Text>
                    <TextInput label="Model" name='model'/>
                    <Button style={rs.searchButton} onPress={handleSubmit(onPress)}>Search</Button>
                    <Button style={styles.logoutButton} onPress={logoutHelper.logout} status='danger'>Logout</Button>
                </FormProvider>
            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({
    logoutButton: {

    },
});
