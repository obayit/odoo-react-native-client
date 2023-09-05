import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectAuth, setAuth } from '../../common/store/authSlice';
import { useProductsQuery, useUpdateCartMutation } from '../../common/store/reduxApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { displayM2O } from '../../common/utils/parseData';
import { useNavigation } from '@react-navigation/native'

export const PersonIcon = (style) => (
    <Icon {...style} name='person' />
);


const ProductItem = ({ item: product }) => {
    const navigation = useNavigation()
    const [updateCart, updateCartResult] = useUpdateCartMutation()
    const styles = useStyleSheet(ReusableStyles)
    const addProductToCart = () => {
        // use the updateCart mutation here :)
        updateCart({product_id: product.id});
    }
    const ProductRightAccessory = () => {
        return (
            <MaterialCommunityIcons name='cart-plus' color='black' size={24} onPress={addProductToCart} />
        );
    }
    const navigateToProductEdit = () => {
        navigation.navigate('Edit Product', {record: product});
    }
    return (
        <ListItem title={`${product?.name}: ${product?.list_price} ${displayM2O(product?.currency_id)}`} accessoryRight={ProductRightAccessory} onPress={navigateToProductEdit} style={styles.listItem}/>
    );
}


export default ({ navigation }) => {
    const dispatch = useDispatch();

    const { data, isLoading } = useProductsQuery();

    const styles = useStyleSheet(ReusableStyles);

    const onLogout = () => dispatch(logOut());

    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    return (
        <FeatureContainer>
            <View style={styles.listContainer}>
                <Loading isLoading={isLoading} />

                <List
                    style={styles.list}
                    data={data?.records}
                    renderItem={props => <ProductItem {...props}/>}
                />
                <Button onPress={onLogout} style={styles.submitButton}>Logout</Button>

            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({
});
