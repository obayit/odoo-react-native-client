import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../common/store/authSlice';
import { injectQuery } from '../../common/store/reduxApi';
import { CustomButton } from '../../components/CustomButtons';

const Item = ({ item: record }) => {
    const styles = ReusableStyles
    return (
        <View>
            <Text style={styles.listItem}>{`${record?.id}: ${record?.name}`}</Text>
        </View>
    )
}

export default ({ navigation, route }) => {
    const dispatch = useDispatch();

    const rs = ReusableStyles;

    const onLogout = () => dispatch(logOut());
    const { useQuery } = injectQuery(route.params.model);
    const { data, isLoading, refetch } = useQuery();


    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    return (
        <FeatureContainer loading={isLoading}>
            <View style={rs.listContainer}>
                <FlatList
                    style={rs.list}
                    data={data?.records}
                    renderItem={props => <Item {...props}/>}
                />
                <CustomButton onPress={onLogout}>Logout</CustomButton>
                <CustomButton onPress={refetch} status='info'>Reload Data</CustomButton>

            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleSheet.create({

});
