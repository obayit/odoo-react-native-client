import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button, Input } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../common/store/authSlice';
import { injectQuery } from '../../common/store/reduxApi';

const Item = ({ item: record }) => {
    const styles = useStyleSheet(ReusableStyles)
    return <ListItem title={`${record?.id}: ${record?.name}`} style={styles.listItem}/>
}

export default ({ navigation, route }) => {
    const dispatch = useDispatch();

    const rs = useStyleSheet(ReusableStyles);

    const onLogout = () => dispatch(logOut());
    const { useQuery } = injectQuery(route.params.model);
    const { data, isLoading, refetch } = useQuery();


    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    return (
        <FeatureContainer loading={isLoading}>
            <View style={rs.listContainer}>
                <List
                    style={rs.list}
                    data={data?.records}
                    renderItem={props => <Item {...props}/>}
                />
                <Button onPress={onLogout}>Logout</Button>
                <Button onPress={refetch} status='info'>Reload Data</Button>

            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({

});
