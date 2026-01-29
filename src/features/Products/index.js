import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper'

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectAuth, selectConfiguration } from '../../common/store/authSlice';
import { injectQuery, odooApi, useProductsQuery, useUpdateCartMutation } from '../../common/store/reduxApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { displayM2O } from '../../common/utils/parseData';
import { useNavigation } from '@react-navigation/native'
import CustomListItem from '../../components/CustomListItem';
import { CustomButton } from '../../components/CustomButtons';
import OdooImage from '../../components/OdooImage';
import colors from '../../components/colors';
import AmountText from '../../components/AmountText';
import DebugView from '../../components/DebugView';
import { ScreenNames } from '../../navigation/navigation.constants';

export const PersonIcon = (style) => (
    <MaterialCommunityIcons {...style} name='person' />
);


const ProductItem = ({ item: product }) => {
    const navigation = useNavigation()
    const [updateCart, updateCartResult] = useUpdateCartMutation()
    const addProductToCart = () => {
        // use the updateCart mutation here :)
        updateCart({ product_id: product.id });
    }
    const navigateToProductEdit = () => {
        navigation.navigate('Edit Product', { record: product });
    }
    const navigateToProductDetails = () => {
        navigation.navigate(ScreenNames.ProductDetails, { record: product });
    }
    return (
        <TouchableOpacity style={styles.productCard} onPress={navigateToProductDetails}>
            <OdooImage model='product.template' recordId={product.id} field_name='image_512' style={styles.image} />
            <Text>{JSON.stringify(product)}</Text>
            <Text style={styles.title}>{product?.name}</Text>
            <AmountText amount={product?.list_price} currencyData={product.currency_id} />
            <CustomButton onPress={navigateToProductEdit} icon='cart'>Add to Cart</CustomButton>
            <DebugView />
        </TouchableOpacity>
    );
}


export default ({ navigation }) => {
    const dispatch = useDispatch();

    const { useQuery } = injectQuery('product.template')
    const query = useQuery({
        kwargs: {
            specification: {
                id: {},
                name: {},
                list_price: {},
                currency_id: { fields: { display_name: {}, symbol: {}, position: {} } },
            },
            domain: [],
        },
    })
    const { data, isLoading, refetch } = query
    const config = useSelector(selectConfiguration)
    const stuff = useSelector(selectAuth)

    const styles = ReusableStyles

    const onLogout = () => dispatch(logOut());

    const [sessionQueryFn, sessionQuery] = odooApi.useLazyControllerQuery()
    async function do_s() {
        const sessionResult = await sessionQueryFn({
            url: '/web/session/get_session_info',
            params: {},
        }).unwrap()
        console.log('#sessionResult');
        console.log(sessionResult);
        console.log(JSON.stringify(sessionResult, null, 2));
    }


    return (
        <FeatureContainer>
            <FlatList
                refreshing={query.isLoading || query.isFetching}
                onRefresh={query.refetch}
                style={styles.list}
                data={data?.records}
                renderItem={props => <ProductItem {...props} />}
            />
            {query.error ? <Text>{JSON.stringify(query.error)}</Text> : null}
            {/* <Text>data: {JSON.stringify(data)}</Text> */}
            {/* <Text>config: {JSON.stringify(config, null, 2)}</Text> */}
            <CustomButton onPress={onLogout} style={styles.submitButton}>Logout</CustomButton>
            <CustomButton onPress={do_s} style={styles.submitButton}>Get Session Info</CustomButton>
            <DebugView/>

            {/* <Text>hello</Text>
            <ScrollView>
                <Text>{JSON.stringify(stuff, null, 2)}</Text>
            </ScrollView> */}
        </FeatureContainer >
    );
};

export const styles = StyleSheet.create({
    productCard: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#eee',
        margin: 16,
        padding: 16,
    },
    list: {
        backgroundColor: '#AA2233',
    },
    submitButton: {
        borderRadius: 15,
        margin: 5,
    },
    image: {
        width: '100%',
        height: 150,
        // borderWidth: 4, borderColor: 'purple',
    },
    title: {
        fontSize: 18,
    },
    priceAmount: {
        color: colors.color_primary_600,
    },
})
