import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button, Input } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer, Loading } from '../../components';

import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../common/store/authSlice';
import { injectQuery } from '../../common/store/reduxApi';
import { displayDate, displayM2o, fLCapital } from '../../common/utils/commonComponentLogic';
import OrderLineItems from '../../components/OrderLineItems';

const Item2 = ({ item: record }) => {
    const styles = useStyleSheet(ReusableStyles)
    return <ListItem title={`${record?.id}: ${record?.create_date}`} style={styles.listItem}/>
}

const State = ({ state }) => {
  const rs = useStyleSheet(ReusableStyles)
  let status = 'default'
  if(state === 'sale'){
    status = 'success'
  }else if(state === 'draft'){
    status = 'info'
  }
  return (
    <Text status={status} style={rs.textTopRight}>{fLCapital(state)}</Text>
  )
}

const Item = ({ item: record }) => {
    const rs = useStyleSheet(ReusableStyles)
    return (
    <View style={rs.listItem}>
        <View style={rs.containerRawSpaceBetween}>
            <Text>{record.name}</Text>
            <State state={record.state}/>
        </View>
        {record?.order_line?.length && <OrderLineItems recordIds={record.order_line} orderId={record.id}/>}
    </View>
    )
}

export default ({ navigation, route }) => {
    const dispatch = useDispatch();

    const rs = useStyleSheet(ReusableStyles);

    const onLogout = () => dispatch(logOut());
    const { useQuery } = injectQuery('sale.order', { fields: [
        'id',
        'name',
        'state',
        'order_line',
        'create_date',
    ]});
    const { data, isLoading, refetch } = useQuery();


    useEffect(() => {
        // setSavedLoginInfo();  // FIXME: activate this later
    }, []);

    return (
        <FeatureContainer loading={isLoading}>
            <View style={rs.listContainer}>
                {/* refresh with pull down */}
                <List
                    style={rs.list}
                    data={data?.records}
                    renderItem={props => <Item {...props}/>}
                />
            </View>
        </FeatureContainer>
    );
};

const themedStyles = StyleService.create({

});
