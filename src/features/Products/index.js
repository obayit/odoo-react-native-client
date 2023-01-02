import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectAuth, setAuth } from '../../common/store/authSlice';
import { useProductsQuery } from '../../common/store/reduxApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { displayM2O } from '../../common/utils/parseData';

export const PersonIcon = (style) => (
    <Icon {...style} name='person' />
);


const PartnerItem = ({ item: product }) => {
    const addProductToCart = () => {
        // use the updateCart mutation here :)
        console.log(`#Adding "${product?.name}" to cart`);
    }
    const ProductRightAccessory = () => {
        return (
            <MaterialCommunityIcons name='cart-plus' color='black' size={24} onPress={addProductToCart} />
        );
    }
    let currencyName = product?.currency_id;
    return (
        <ListItem title={`${product?.name}: ${product?.list_price} ${displayM2O(product?.currency_id)}`} accessoryRight={ProductRightAccessory} />
    );
}


export default ({ navigation }) => {
    const dispatch = useDispatch();

    const { data, isLoading } = useProductsQuery();

    const styles = useStyleSheet(themedStyles);
    const rs = useStyleSheet(ReusableStyles);

    const onLogout = () => dispatch(logOut());

    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    return (
        <FeatureContainer>
            <View style={rs.listContainer}>
                <Loading isLoading={isLoading} />

                <List
                    style={styles.container}
                    data={data?.records}
                    renderItem={PartnerItem}
                />
                <Button onPress={onLogout}>Logout</Button>

            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({
});
