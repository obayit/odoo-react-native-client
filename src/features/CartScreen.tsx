import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { TextInput, ReusableStyles, FeatureContainer } from '../components';

import { Button, IconButton, SegmentedButtons, Snackbar, Surface, Text, useTheme } from 'react-native-paper'

import { useDispatch } from 'react-redux';
import { emptyList, emptyObject, odooApi, useProductsQuery } from '../common/store/reduxApi';
import { useNavigation } from '@react-navigation/native';
import OdooImage from '../components/OdooImage';
import colors from '../components/colors';
import { CustomSpacer, SectionHeader } from '../components/Utils';
import AmountText from '../components/AmountText';
import { ScreenNames } from '../navigation/navigation.constants';
import AmountLine from '../components/AmountLine';


export default ({ route }) => {
  const dispatch = useDispatch();
  const profileQuery = odooApi.useProfileQuery({});
  const cartQuery = odooApi.useCartQuery({});
  const cart = cartQuery.data?.cart_data ?? emptyObject;
  const navigation = useNavigation()
  const lines = cart?.website_sale_order?.website_order_line
  const currency = cart?.currency

  const [paymentLoading, SetPaymentLoading] = useState(false)
  const [fakePaymentQueryFn, fakePaymentQuery] = odooApi.useSkipPaymentMutation()

  async function handleCheckout() {
    SetPaymentLoading(true)
    const response = await fakePaymentQueryFn({}).unwrap()
    setTimeout(() => {
      SetPaymentLoading(false)
      if(response?.order_id){
        navigation.navigate(ScreenNames.OrderDetails, { recordId: response.order_id})
      }
    }, 1500);
  }

  return (
    <FeatureContainer style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.formContainer}
        refreshControl={<RefreshControl refreshing={cartQuery.isLoading || cartQuery.isFetching} onRefresh={cartQuery.refetch} />}
      >
        {lines?.map(line => <OrderLine key={line.id} line={line} currencyData={currency} />)}
        {/* <Text>={JSON.stringify(lines, null, 2)}</Text> */}
        {/* <Text>{JSON.stringify(cart, null, 2)}</Text> */}
        {/* <Text>{JSON.stringify(cart?.website_sale_order, null, 2)}</Text> */}
        {/* <Text>{JSON.stringify(cart?.website_sale_order?.website_order_line, null, 2)}</Text> */}
        {/* {cartQuery.error ? <Text>{JSON.stringify(cartQuery.error, null, 2)}</Text> : null} */}
        <View style={{
          margin: 16,
        }}>
          <AmountLine title='Subtotal' amount={cart?.website_sale_order?.amount_untaxed} currencyData={currency}/>
          <AmountLine title='Taxes' amount={cart?.website_sale_order?.amount_tax} currencyData={currency}/>
          <AmountLine title='Total' amount={cart?.website_sale_order?.amount_total} currencyData={currency}/>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 8,
        }}>
          <Button onPress={handleCheckout} mode='contained' icon='credit-card' loading={paymentLoading}>Pay</Button>
        </View>
      </ScrollView>
    </FeatureContainer>
  );
};

function OrderLine({ line, currencyData }) {
  const theme = useTheme()
  const line_update = {
    "line_id": 70,
    "product_id": 21,
    "set_qty": 2,
    "display": true
  }
  function handleDeleteLine() {
    // todo: implement me
  }

  return (
    <Surface style={{
      // borderWidth: 1, borderColor: colors.color_grey_600,
      flexDirection: 'row',
      padding: 16,
      borderRadius: 24,
      marginVertical: 8,
      // backgroundColor: theme.color
    }}>
      <OdooImage
        model='product.product'
        recordId={line.product_id}
        field_name='image_512'
        style={styles.image}
      />
      <CustomSpacer width={8} />
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Text>{line.name_short}</Text>
        <CustomSpacer height={8} />
        <AddToCart line={line} />
        <CustomSpacer height={8} />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <AmountText amount={line.product_price} currencyData={currencyData} />
          <IconButton icon='delete' onPress={handleDeleteLine} iconColor={theme.colors.error} mode='contained' />
        </View>
      </View>
    </Surface>
  )
}

type AddCartStateType = 'subtract' | 'qty' | 'add'

function AddToCart({ line }) {
  const [loading, setLoading] = useState(false)
  const qty = line.displayed_quantity ?? 0
  const [value, setValue] = React.useState<AddCartStateType>('add');
  const [updateCartQueryFn, updateCartQuery] = odooApi.useUpdateCartMutation()

  function makeDiff(diff) {
    const newValue = Number(qty) + diff
    if (newValue < 1) {
      return 1
    } else {
      return newValue
    }
  }

  function handleOnPress(value: AddCartStateType) {
    setValue(value)
    let newValue = undefined
    if (value === 'subtract') {
      newValue = makeDiff(-1)
    } else if (value === 'add') {
      newValue = makeDiff(1)
    }
    if (newValue !== undefined) {
      handleAddAsync(newValue)
    }
  }

  async function handleAddAsync(newQty) {
    setLoading(true)
    try {
      const params = {
        "line_id": line.id,
        "product_id": line.product_id,
        "set_qty": newQty,
        "display": true
      }
      console.log('#params');
      console.log(params);
      const response = await updateCartQueryFn(params).unwrap()
      console.log('#response');
      console.log(JSON.stringify(response, null, 2));
    } finally {
      setLoading(false)
    }
  }

  const disableButtons = loading

  return (
    <View style={styles.addToCartContainer}>
      <SegmentedButtons
        value={value}
        onValueChange={handleOnPress}
        style={{
          width: 230,  // width must be specified, because otherwise it 
          marginHorizontal: 5,
        }}
        buttons={[
          {
            value: 'subtract',
            label: '-',
            labelStyle: styles.qtyButton,
            disabled: disableButtons,
          },
          {
            value: 'qty',
            label: qty + '',
            labelStyle: styles.qtyText,
            disabled: disableButtons,
          },
          {
            value: 'add',
            label: '+',
            labelStyle: styles.qtyButton,
            disabled: disableButtons,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    margin: 8,
    paddingBottom: 72, // Add padding so content doesn't hide behind button
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
  },

  addToCartContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    // height: 42,
  },
  qtyButton: {
    color: colors.color_primary_600,
    fontSize: 24,
  },
  qtyText: {
    fontSize: 18,
  },
});
