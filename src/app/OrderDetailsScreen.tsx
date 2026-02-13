import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, View, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';

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
import { CustomSpacer } from '../components/Utils';


const example_order = {
}

export default ({ navigation, route }) => {
  const recordId = route.params.recordId
  return (
    <FeatureContainer>
      <Order recordId={recordId} />
    </FeatureContainer>
  );
};

function Order({ recordId }) {
  const [page, setPage] = useState(0)
  const orderQuery = odooApi.useOrderQuery({
    order_id: recordId,
  })

  const order = orderQuery.data?.order_data?.sale_order

  return (
    <ScrollView refreshControl={<RefreshControl onRefresh={orderQuery.refetch} refreshing={orderQuery.isFetching || orderQuery.isLoading} />}>
      <View style={{
        alignItems: 'center',
        marginTop: 16,
      }}>
        <Text variant='headlineLarge' style={{
          backgroundColor: 'turquoise',
          padding: 16,
        }}>TODO</Text>
        <Text variant='titleLarge'>{order.name}</Text>
        <CustomSpacer />
        <Text>
          Subtotal: <AmountText amount={order?.amount_untaxed} currencyData={order.currency_id} />
        </Text>
        <Text>
          Taxes: <AmountText amount={order?.amount_tax} currencyData={order.currency_id} />
        </Text>
        <Text>
          Total: <AmountText amount={order?.amount_total} currencyData={order.currency_id} />
        </Text>
      </View>
      {/* <Text>{JSON.stringify(orderQuery.data, null, 2)}</Text> */}
      {/* <Text>{JSON.stringify(orders, null, 2)}</Text> */}
      {orderQuery.error ?
        <>
          <Text>{JSON.stringify(orderQuery.error)}</Text>
          <Button onPress={orderQuery.refetch} mode='outlined'>refetch</Button>
          <CustomSpacer />
        </> : null}
      <DebugView />
    </ScrollView>
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
      padding: 8,
      // borderWidth: 1,
      // borderColor: 'lime',
    }, style]}>
      <TouchableOpacity onPress={handleNavigateToDetails}>
        <Text>{displayDateTime(order.date_order)}</Text>
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
});

const MARGIN_HORIZONTAL = 8

type PaginationData = {
  current_page: number
  total_pages: number
  page_size: number
  total_count: number
  has_next: Boolean
  has_prev: Boolean
}
