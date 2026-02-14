import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { TextInput, ReusableStyles, FeatureContainer } from '../../components';

import { useDispatch } from 'react-redux';
import { logOut } from '../../common/store/authSlice';
import { useProductsQuery } from '../../common/store/reduxApi';
import { FormProvider } from 'react-hook-form';
import useForm from '../../common/hooks/useForm';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from '../../components/CustomButtons';

export const PersonIcon = (style) => (
    <MaterialIcons {...style} name='person' />
);


export default ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { record } = route.params;
    const { data, isLoading } = useProductsQuery();

    const rs = ReusableStyles;

    const onLogout = () => dispatch(logOut());

    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    const fieldName = {
        name: 'name',
        label: 'Name',
        required: true,
        type: 'char',
    };
    const fieldBarcode = {
        name: 'barcode',
        label: 'Barcode',
        required: false,
        type: 'char',
    };
    let fields = [
        fieldName,
        fieldBarcode,
    ]

    const { formMethods } = useForm(fields, {record});

    return (
        <FeatureContainer>
            <View style={rs.listContainer}>
                <FormProvider {...formMethods}>
                    <TextInput field={fieldName} />
                    <TextInput field={fieldBarcode} />

                    <CustomButton onPress={onLogout}>Logout</CustomButton>

                </FormProvider>
            </View>
        </FeatureContainer>
    );
};

const styles = StyleSheet.create({
});
