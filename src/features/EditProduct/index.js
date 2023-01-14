import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button } from '@ui-kitten/components';

import { TextInput, ReusableStyles, FeatureContainer, Loading } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectAuth, setAuth } from '../../common/store/authSlice';
import { useProductsQuery } from '../../common/store/reduxApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { displayM2O } from '../../common/utils/parseData';
import { FormProvider } from 'react-hook-form';
import useForm from '../../common/hooks/useForm';

export const PersonIcon = (style) => (
    <Icon {...style} name='person' />
);


export default ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { record } = route.params;
    const { data, isLoading } = useProductsQuery();

    const styles = useStyleSheet(themedStyles);
    const rs = useStyleSheet(ReusableStyles);

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

                    <Button onPress={onLogout}>Logout</Button>

                </FormProvider>
            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({
});
