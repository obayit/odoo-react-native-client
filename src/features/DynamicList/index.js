import React, { useEffect } from 'react';
import { View } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../common/store/authSlice';
import { injectQuery } from '../../common/store/reduxApi';

const Item = ({ item: record }) => <ListItem title={`${record?.id}: ${record?.name}`}/>

export default ({ navigation }) => {
    const dispatch = useDispatch();

    const styles = useStyleSheet(themedStyles);
    const rs = useStyleSheet(ReusableStyles);

    const onLogout = () => dispatch(logOut());
    const { useQuery } = injectQuery('res.users');
    const { data, isLoading, refetch } = useQuery();


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
                    renderItem={Item}
                />
                <Button onPress={onLogout}>Logout</Button>
                <Button onPress={refetch} status='info'>Reload Data</Button>

            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({

});
