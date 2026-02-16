import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, View, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { emptyObject, injectQuery, odooApi } from '../common/store/reduxApi';
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
import AmountLine from '../components/AmountLine';
import ContactWidget from '../components/ContactWidget';
import ShippingSection from '../components/ShippingSection';

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

  // Use example_order if no real data is present
  const order = orderQuery.data?.order_data?.sale_order ?? emptyObject
  const shipping_data = orderQuery.data?.order_data?.shipping_data ?? emptyObject
  const is_same_invoice_and_shipping = orderQuery.data?.order_data?.customer_info?.is_same_invoice_and_shipping
  const invoicing_partner = orderQuery.data?.order_data?.customer_info?.partner_invoice_id
  const shipping_partner = orderQuery.data?.order_data?.customer_info?.partner_shipping_id


  return (
    <ScrollView style={{ padding: 16 }}
      refreshControl={< RefreshControl onRefresh={orderQuery.refetch} refreshing={orderQuery.isFetching || orderQuery.isLoading} />}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text variant="titleMedium">{`Order# ${order.name}`}</Text>
        <Text variant="titleMedium">{displayDateTime(order.date_order, { hideSeconds: true })}</Text>
      </View>
      <CustomSpacer height={8} />
      <Divider />
      <CustomSpacer height={8} />
      <AmountLine title='Untaxed Amount' amount={order?.amount_untaxed} currencyData={order.currency_id} />
      {/* TODO: add taxes total description (aka: Tax 15% on $ 0.00) see web view, above total */}
      <AmountLine title='Taxes' amount={order?.amount_tax} currencyData={order.currency_id} />
      <AmountLine title='Total' amount={order.amount_total} currencyData={order.currency_id} />
      {is_same_invoice_and_shipping ?
        <ContactWidget {...invoicing_partner} title='Shipping & Billing Address' />
        :
        <>
          <ContactWidget {...invoicing_partner} title='Billing Address' />
          <ContactWidget {...shipping_partner} title='Shipping Address' />
        </>
      }
      <ShippingSection shippingData={shipping_data}/>
      {order.lines?.length ? <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>Items</Text>
        : null}
      <ScrollView style={{
        paddingHorizontal: 8,  // surface needs this padding to not clip through parent
      }} nestedScrollEnabled>
        {order.lines?.map(line => (
          <OrderLineCard key={line.id} line={line} order={order} />
        ))}
      </ScrollView>
      {orderQuery.error && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: 'red' }}>{JSON.stringify(orderQuery.error)}</Text>
          <Button onPress={orderQuery.refetch} mode='outlined'>Refetch</Button>
        </View>
      )}
      {/* <Text>{JSON.stringify(order, null, 2)}</Text> */}
      {/* <Text>{JSON.stringify(shipping_data, null, 2)}</Text> */}
    </ScrollView>
  );
}

function OrderLineCard({ line, order }) {
  const qty_text = `${line.product_uom_qty} ${line.product_uom?.name || ""}`
  return (
    <Surface style={{
      padding: 16,
      borderRadius: 16,
      marginVertical: 8,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text>{line.product_name}</Text>
        <Text>{qty_text}</Text>
      </View>
      <CustomSpacer height={8} />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <AmountText amount={line.subtotal} currencyData={order.currency_id} />
      </View>
    </Surface>
  )
}

function DebugOrder({ orderQuery, order, recordId }) {
  return (
    <ScrollView refreshControl={< RefreshControl onRefresh={orderQuery.refetch} refreshing={orderQuery.isFetching || orderQuery.isLoading} />}>
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
        <Text>
          ID: {recordId}
        </Text>
      </View>
      {/* <Text>{JSON.stringify(orderQuery.data, null, 2)}</Text> */}
      <Text>{JSON.stringify(order, null, 2)}</Text>
      {
        orderQuery.error ?
          <>
            <Text>{JSON.stringify(orderQuery.error)}</Text>
            <Button onPress={orderQuery.refetch} mode='outlined'>refetch</Button>
            <CustomSpacer />
          </> : null
      }
      <DebugView />
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  categoryButton: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: 16,
    borderWidth: 1, borderColor: 'red',
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
