import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import { useDispatch } from 'react-redux';
import { logOut } from '../../common/store/authSlice';
import { useProductsQuery, useUpdateCartMutation } from '../../common/store/reduxApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { displayM2O } from '../../common/utils/parseData';
import { useNavigation } from '@react-navigation/native'
import CustomListItem from '../../components/CustomListItem';
import { CustomButton } from '../../components/CustomButtons';

export const PersonIcon = (style) => (
    <MaterialCommunityIcons {...style} name='person' />
);


const ProductItem = ({ item: product }) => {
    const navigation = useNavigation()
    const [updateCart, updateCartResult] = useUpdateCartMutation()
    const styles = ReusableStyles
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
        <CustomListItem title={`${product?.name}: ${product?.list_price} ${displayM2O(product?.currency_id)}`} accessoryRight={ProductRightAccessory} onPress={navigateToProductEdit} style={styles.listItem}/>
    );
}


export default ({ navigation }) => {
    const dispatch = useDispatch();

    const { data, isLoading } = useProductsQuery();

    const styles = ReusableStyles

    const onLogout = () => dispatch(logOut());

    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    return (
        <FeatureContainer>
            <View style={styles.listContainer}>
                <Loading isLoading={isLoading} />

                <FlatList
                    style={styles.list}
                    data={data?.records}
                    renderItem={props => <ProductItem {...props}/>}
                />
                <CustomButton onPress={onLogout} style={styles.submitButton}>Logout</CustomButton>

            </View>
        </FeatureContainer>
    );
};
