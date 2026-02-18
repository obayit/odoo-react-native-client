import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery, odooApi } from '../common/store/reduxApi';
import { Text, List, Button, Card, Avatar, Searchbar, Icon, SegmentedButtons, DataTable, Surface, Divider } from 'react-native-paper';
import DebugView from '../components/DebugView';
import { useSelector } from 'react-redux';
import { selectAuth } from '../common/store/authSlice';
import OdooImage, { useImageUrl } from '../components/OdooImage';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../navigation/navigation.constants';
import AmountText from '../components/AmountText';
import { displayDate, displayDateTime, groupList } from '../common/utils/commonComponentLogic';
import DataGrid from '../components/DataGrid';
import CustomSearch from '../components/CustomSearch';
import Pagination from '../components/Pagination';
import { CustomSpacer, PaginationData } from '../components/Utils';

export default ({ navigation, route }) => {
  return (
    <FeatureContainer insets='top'>
      <MyOrders />
    </FeatureContainer>
  );
};

function MyOrders() {
  const [page, setPage] = useState(0)
  const ordersQuery = odooApi.useOrdersQuery({
    page: page + 1,
  })

  const orders = ordersQuery.data?.orders_data?.orders
  const pagination = ordersQuery.data?.orders_data?.pager ? {
    page_size: ordersQuery.data?.orders_data?.ppg,
    page_count: ordersQuery.data?.orders_data?.pager.page_count,
  } as PaginationData
  : undefined

  if (ordersQuery.data?.orders_data?.orders?.length === 0) {
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image
          source={require('../../assets/no-data-nobg.png')}
          style={styles.emptyDataImage}
          resizeMode='contain'
        />
      </View>
    )
  }

  return (
    <>
      <FlatList
        data={orders}
        onRefresh={ordersQuery.refetch}
        refreshing={ordersQuery.isFetching || ordersQuery.isLoading}
        contentContainerStyle={{
          // borderWidth: 1, borderColor: 'green'
        }}
        numColumns={1}
        renderItem={props =>
          <OrderCard order={props.item} ordersQuery={ordersQuery}
            style={{
              flex: 1,
            }} />
        }
      />
      {pagination ? <Pagination page={page} setPage={setPage} pageCount={pagination.page_count} numberOfItemsPerPage={pagination.page_size} /> : null}
      {/* <Text>{JSON.stringify(ordersQuery.data, null, 2)}</Text> */}
      {/* {ordersQuery.error ?
        <ScrollView>
          <Text>{JSON.stringify(ordersQuery.data, null, 2)}</Text>
          <Text>{JSON.stringify(orders, null, 2)}</Text>
          <Text>{JSON.stringify(ordersQuery.error)}</Text>
          <Button onPress={ordersQuery.refetch} mode='outlined'>refetch</Button>
          <CustomSpacer />
        </ScrollView> : null} */}
      <DebugView />
    </>
  )
}

function OrderCard({ order, ordersQuery, style = undefined }) {
  const navigation = useNavigation()
  const currency_data = ordersQuery.data?.currency_data ?? {}
  function handleNavigateToDetails() {
    navigation.navigate(ScreenNames.OrderDetails, { recordId: order.id })
  }

  return (
    <Surface style={[{
      margin: 8,
      borderRadius: 16,
      padding: 16,
      // borderWidth: 1,
      // borderColor: 'purple',
    }, style]}
    >
      <TouchableOpacity onPress={handleNavigateToDetails}>
        <Text>{displayDateTime(order.date_order)}</Text>
        <CustomSpacer height={8} />
        <Divider />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
          marginHorizontal: 8,
        }}>
          <Text variant='titleMedium'>{order.name}</Text>
          <AmountText amount={order.amount_total} currencyData={order.currency_id} />
        </View>
      </TouchableOpacity>
    </Surface>
  )
}

const styles = StyleSheet.create({
  categoryButton: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  emptyDataImage: {
    height: 400,
    width: '100%',
    margin: 16,
  },
});

const MARGIN_HORIZONTAL = 8
