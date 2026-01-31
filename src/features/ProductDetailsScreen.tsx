import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery, odooApi } from '../common/store/reduxApi';
import useSingleRecord from '../common/hooks/useSingleRecord';
import { CustomButton } from '../components/CustomButtons';
import colors from '../components/colors';
import { Button, Checkbox, RadioButton, TextInput } from 'react-native-paper';
import CustomText from '../components/CustomText';
import OdooImage from '../components/OdooImage';
import DebugView from '../components/DebugView';
import AmountText from '../components/AmountText';
import { Dropdown, Option as DropDownOption } from 'react-native-paper-dropdown';


interface ProductConfigurationData {
  variantId: number;
  // combination: Array<AttrValuePair>;
  _combination: Array<number>;
  qty: Number;
}

type AttrValuePair = {
  attribute_id: number
  value_id: number
}



export default function ProductDetailsScreen({ navigation, route }) {
  const rs = ReusableStyles;
  const passedRecord = route.params?.record
  const recordId = passedRecord?.id ?? route.params.recordId
  // const [attrChecked, _setAttrChecked] = useState<AttrValuePair[]>([])
  const [productConfig, setProductConfig] = useState<ProductConfigurationData>({
    variantId: 0,
    // combination: [],
    _combination: [],
    qty: 1,
  })
  const [combinationParams, setCombinationParams] = useState<any>({})
  const [firstCombinationParams, setFirstCombinationParams] = useState<any>({})
  const [debugText, setDebugText] = useState<any>({})

  const { record, query } = useSingleRecord({
    model: 'product.template',
    recordId,
    queryKwArgs: {
      specification: {
        id: {},
        name: {},
        list_price: {},
        currency_id: { fields: { display_name: {}, symbol: {}, position: {} } },
        description_sale: {},
        "valid_product_template_attribute_line_ids": attr_line_specs,
        // "attribute_line_ids": attr_line_specs,
      },
    },
  })
  const all_ptal = record.valid_product_template_attribute_line_ids
  const all_ptav = all_ptal?.flatMap(item => item.product_template_value_ids)
  const { query: variantDebugQuery } = useSingleRecord({
    model: 'product.product',
    recordId: productConfig.variantId,
    queryKwArgs: {
      specification: {
        id: {},
        name: {},
        product_template_variant_value_ids: {
          fields: {
            display_name: {}
          }
        }
      }
    }
  })
  const { query: productAttributes } = useSingleRecord({
    model: 'product.attribute',
    recordId: 1,
    queryKwArgs: {
      specification: {
        id: {},
        name: {},
        display_type: {}
      }
    }
  })
  // const [combinationQueryFn, combinationQuery] = odooApi.useLazyGetCombinationInfoQuery()
  const combinationQueryFn = () => { throw 'unimplemented combinationQueryFn' }
  const combinationQuery = odooApi.useGetCombinationInfoQuery({
    combination: productConfig._combination,
    params: {
      "product_template_id": recordId,
      "product_id": productConfig.variantId,
      // "combination": combinationStateToApi(productConfig.combination),
      "combination": productConfig._combination,
      "add_qty": productConfig.qty,
      "parent_combination": []  // ?what is this, combination of parent product when this product is an accessory?
    },
  }
    // todo: add skip here, when combination or recordId are empty
  )

  const extraPriceQuery = odooApi.useGetAttributeExtraPriceQuery({
    model: 'product.template.attribute.value',
    method: 'obi_app_get_extra_price',  // implement_backend
    // implementation:
    /*
    def obi_app_get_extra_price(self, combination_info):
        return [
            {"id": r.id, "extra_price": r._get_extra_price(combination_info)}
            for r in self
        ]
    */
    args: [all_ptav?.map(item => item.id)],
    kwargs: {
      // todo: find the correct combination_info, try to raise exception in the template to find out when it is being called, because i assume it is being initialized just like report data, somewhere just before rendering the template, they preprar the data and pass it there
      combination_info: combinationQuery.data,
    },
  }, {
    skip: !all_ptav?.length
  }
  )
  const [getFirstCombinationQueryFn, getFirstCombinationQuery] = odooApi.useLazyGetFirstCombinationQuery()

  function _initialize_combination() {
    getFirstCombinationAsync()
    // getCombinationInfoAsync()
  }

  useEffect(() => {
    if (record?.id) {
      _initialize_combination()
    }
  }, [record?.id])

  async function getCombinationInfoAsync({ combination = undefined, prevCombination = undefined, product_id = undefined } = {}) {
    if (true) {
      // don't use this, getCombinationInfo should be a query that auto calls when its arguments are changed, not lazy calling it.
      return
    }
    console.log('#getCombinationInfoAsync()');
    console.log(combination);
    // const combinationState = combination ?? productConfig.combination
    // const combinationApi = combinationStateToApi(combinationState)  // convert state format to api format
    const combinationApi = combination ?? productConfig._combination
    const combinationParams = {
      // combination: combinationState,
      params: {
        "product_template_id": recordId,
        "product_id": product_id ?? productConfig.variantId,
        "combination": combinationApi,
        "add_qty": productConfig.qty,
        "parent_combination": []  // ?what is this
      },
    }
    setCombinationParams(combinationParams)
    try {
      // const hi = 'combinationParams = '+JSON.stringify(combinationParams);
      const res = await combinationQueryFn(combinationParams).unwrap()
      // console.log(`#newConfig hi = ${hi}`);
      // const { carousel, product_tags, ...otherRes } = res
      // console.log(otherRes);
      let newVariantId = undefined
      let newCombination = undefined
      // console.log('#res __combinationQueryFn');
      // console.log(res);
      if (res.is_combination_possible) {
        if (res.product_id) {
          newVariantId = res.product_id
        }
        newCombination = combinationState
      } else {
        console.log('#prevCombination');
        console.log(prevCombination);
        if (prevCombination) {
          newCombination = prevCombination
        }
      }
      console.log('#newVariantId');
      console.log(newVariantId);
      console.log('#newCombination');
      console.log(newCombination);
      setProductConfig(prev => ({
        ...prev,
        variantId: newVariantId ?? prev.variantId,
        combination: newCombination ?? prev.combination,
      }))
    } catch (error) {
      console.log('#error');
      console.log(error);
    }
  }

  // useEffect(() => {
  //   if(!combinationQuery.data) return
  //   const res = combinationQuery.data
  //   try {
  //     let newVariantId = undefined
  //     let newCombination = undefined
  //     if (res.is_combination_possible) {
  //       if(res.product_id){
  //         newVariantId = res.product_id
  //       }
  //       newCombination = combinationState
  //     } else {
  //       console.log('#prevCombination');
  //       console.log(prevCombination);
  //       if(prevCombination){
  //         newCombination = prevCombination
  //       }
  //     }
  //     console.log('#newVariantId');
  //     console.log(newVariantId);
  //     console.log('#newCombination');
  //     console.log(newCombination);
  //     setProductConfig(prev => ({
  //       ...prev,
  //       variantId: newVariantId ?? prev.variantId,
  //       combination: newCombination ?? prev.combination,
  //     }))
  //   } catch (error) {
  //     console.log('#error');
  //     console.log(error);
  //   }
  // }, [combinationQuery.data])


  async function getFirstCombinationAsync(/* maybe we should pass attributes here as the user inputs them? or this is only for the first time to initialize default combination? */) {
    const combinationParams = {
      model: 'product.template',
      method: 'obi_app_get_first_possible_combination',  // implement_backend
      // implementation:
      /*
        def obi_app_get_first_possible_combination(self, *args, **kwargs):
            return self._get_first_possible_combination(*args, **kwargs).ids
      */
      args: [recordId],
      kwargs: {
        parent_combination: null,  // doc says: combination from which `self` is an optional or accessory product.
        necessary_values: null,  // whenever the user choses an attribute we should call this again, right?
      },
    }
    setFirstCombinationParams(combinationParams)
    try {
      const res = await getFirstCombinationQueryFn(combinationParams).unwrap()
      if (res?.length) {
        const newAttrCheckedState = combinationApiToState(record, res)
        setProductConfig({
          ...productConfig,
          // combination: newAttrCheckedState,
          _combination: res,
        })
        /// getCombinationInfoAsync({ combination: newAttrCheckedState, prevCombination: productConfig.combination })
      }
    } catch (error) {
      console.log('#error');
      console.log(error);
    }
  }

  useEffect(() => {
    if (combinationQuery.data) {
      // console.log(combinationQuery.data)
    }
  }, [combinationQuery.data])


  const { data, isLoading, refetch } = query

  function getOrderedAttributeValues(pairs: AttrValuePair[]) {
    const res = all_ptal.map(item => pairs.find(p => p.attribute_id === item.attribute_id.id)?.value_id)
    console.log('#pairs');
    console.log(pairs);
    console.log('#res @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(res);
    all_ptal.map(item => pairs.find(p => {
      console.log(`${p.attribute_id} === ${JSON.stringify(item.attribute_id.id)}`)
    }))
    if (res.some(item => !item)) {
      console.log('some attributes are not set, we are not returning ordered attributes array');
      return []
    }
    return res
  }

  /*
  useEffect(() => {
    console.log('#useEffect, combination');
    const attrChecked = productConfig.combination
    console.log(attrChecked?.length);
    if(attrChecked?.length){
      if(attrChecked?.length === record?.attribute_line_ids?.length){
        // todo: is it possible that backend have an attribute with no possible value? probably backend prevents this, and we here too won't try to getCombinationInfo unless all attributes have values
        // const newCombination = getOrderedAttributeValues(attrChecked)
        // console.log('#newCombination');
        // console.log(newCombination);
        // console.log('#!attrsEqual(productConfig.combination, newCombination)');
        // console.log(!attrsEqual(productConfig.combination, newCombination));
        if(!attrsEqual(productConfig.combination, attrChecked) ||true){
          console.log('#SETTING NEW PRODUCT CONFIG');
      // single source of truth is productConfig, no longer need to update it here
      // console.log('#setProductConfig #3');
      // console.log({
      //       ...productConfig,
      //       combination: newCombination,
      //   });
      //     setProductConfig({
      //       ...productConfig,
      //       combination: newCombination,
      //     })
          getCombinationInfoAsync({ combination: attrChecked })
        }
      }
    }
  }, [productConfig.combination])
  */


  const isAttributeChecked_ptav = (ptav_id) => combinationQuery.data?._ptav?.includes(ptav_id)

  useEffect(() => {
    // setSavedLoginInfo();  // FIXME: activate this later
  }, []);

  /*
  TODO:
  1. DONE:: change image when attributes change
  2. some attribute values prevent other attribute values, e.g: aluminum legs, prevent color to be black
  3. show extra price on attributres
  */

  /*
  wip:
    addons/website_sale/views/templates.xml:1381
    <t t-set="combination_info" t-value="variant_id._get_combination_info_variant(add_qty=add_qty)"/>
  */
  function getImageUrlQueryData() {
    // /web/image/product.product/12/image_1024/%5BFURN_0096%5D%20Customizable%20Desk%20%28Steel%2C%20White%29?unique=75a43b4
    const attrChecked = productConfig.combination
    if (attrChecked) {
      all_ptal?.map(item => {


      })
    }
    return ''
  }

  return (
    <FeatureContainer loading={isLoading}>
      <ScrollView>
        <AddToCart record={record} />
        <CustomButton onPress={query.refetch}>reload</CustomButton>
        <View style={{ flexDirection: 'row' }}>
          {/* <Text style={styles.debugSubtleText}>productConfig: {JSON.stringify(productConfig, null, 2)}{'\n'}{JSON.stringify(variantDebugQuery.data)}</Text> */}
          {/* <Text style={styles.debugSubtleText}>attrChecked: {JSON.stringify(attrChecked, null, 2)}</Text> */}
          {/* <Text style={styles.debugSubtleText}>combination: {JSON.stringify(stripHtmlDebug(combinationQuery.data), null, 2)}</Text> */}
          {/* <Text style={styles.debugSubtleText}>product_id: {combinationQuery.data?.product_id}</Text> */}
          {/* <Text style={styles.debugSubtleText}>extraPriceQuery: {JSON.stringify(extraPriceQuery.data, null, 2)}</Text> */}

          {/* {combinationQuery.error ? <Text style={styles.debugSubtleText}>combinationError: {JSON.stringify(combinationQuery.error, null, 2)}</Text> : null} */}
          {/* <Text style={styles.debugSubtleText}>firstCombination: {JSON.stringify(getFirstCombinationQuery.data, null, 2)}</Text> */}
          {/* <Text style={styles.debugSubtleText}>_ptav: {JSON.stringify(stripHtmlDebug(combinationQuery.data?._ptav), null, 2)}</Text> */}
          {/* <Text style={styles.debugSubtleText}>_combination: {JSON.stringify(combinationQuery.data?._combination, null, 2)}</Text> */}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {/* <Text style={styles.debugSubtleText}>_pc._combination: {JSON.stringify(productConfig._combination)}</Text> */}
        </View>
        {/* <Text style={styles.debugSubtleText}>combinationParams: {JSON.stringify(combinationParams, null, 2)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>firstCombinationParams: {JSON.stringify(firstCombinationParams, null, 2)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>debugText: {JSON.stringify(debugText, null, 2)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>{JSON.stringify(record, null, 2)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>product_id:: {JSON.stringify(combinationQuery.data?.product_id)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>all_ptal:: {JSON.stringify(all_ptal, null, 2)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>all_ptav:: {JSON.stringify(all_ptav)}</Text> */}
        {/* <Text style={styles.debugSubtleText}>productAttributes:: {JSON.stringify(productAttributes.data)}</Text> */}

        <OdooImage
          model={combinationQuery.data?.product_id ? 'product.product' : 'product.template'}
          recordId={combinationQuery.data?.product_id ? combinationQuery.data?.product_id : record.id}
          field_name='image_512'
          style={styles.image}
        />
        <Text style={rs.textDebug}>{JSON.stringify(query.error)}</Text>
        {record.description_sale ? <CustomText>{record.description_sale}</CustomText> : null}
        <AmountText amount={record?.list_price} currencyData={record.currency_id} />
        {combinationQuery.data?.price_extra ? <>
          <Text>+</Text>
          <AmountText amount={combinationQuery.data?.price_extra} currencyData={record.currency_id} />
        </>
          : null}
        <ProductTemplateAttributes record={record} productConfig={productConfig} setProductConfig={setProductConfig} combinationQuery={combinationQuery} />
        <AddToCart record={record} />
        {/* <DebugView/> headersMap*/}
      </ScrollView>
    </FeatureContainer>
  );
};

function ProductTemplateAttributes({ record, productConfig, setProductConfig, combinationQuery }) {
  const all_ptal = record.valid_product_template_attribute_line_ids ?? []
  const all_ptav = all_ptal?.flatMap(item => item.product_template_value_ids) ?? []
  function setAttrCheckedBulk(ptal, pairs: AttrValuePair[]) {
    // this was originally needed to accept bulk edits, but now it is not needed
    // if after finishing this component we found there is no need for bulk edits, we can simplify the code to accept only a single pair of AttrValuePair
    const isSingleValue = ['radio'].includes(ptal.attribute_id.display_type)
    const uncheckable = ['multi'].includes(ptal.attribute_id.display_type)  // user can clicks to remove the item instead of adding it
    const output: AttrValuePair[] = []
    const output_array: number[] = []

    const valuesToRemove_array = []
    let removableIds: number[] = []

    for (const { attribute_id, value_id } of pairs) {
      output.push({
        attribute_id,
        value_id,
      })
      output_array.push(value_id)
      if (isSingleValue) {
        removableIds = all_ptav.filter(ptav => ptav.attribute_id.id === attribute_id).map(ptav => ptav.id)
      }
    }

    // var newAttrCheckedState = []  // note: this value will be set to a useState, so, don't change it after it is set there with _setAttrChecked
    var newAttrCheckedState_array = []

    setProductConfig(prev => {
      // merge two arrays and remove duplicates
      // newAttrCheckedState = [
      //   ...output,
      //   ...removeDuplicateAttributes(output, prev.combination),
      // ]
      newAttrCheckedState_array = [
        ...output_array.filter(item => {
          if (uncheckable) {
            console.log('#uncheckable ,,,,,,,,,,,,');
            console.log(`!${JSON.stringify(prev._combination)}.find(prev_item => prev_item === ${item})`);
            console.log(!prev._combination.find(prev_item => prev_item === item));
            // only remove the item if it is uncheckable and it exists in previous state
            if (prev._combination.find(prev_item => prev_item === item)) {
              removableIds.push(item)
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        }),
        ...prev._combination.filter(item => !removableIds.includes(item)),
      ]
      return {
        ...prev,
        // combination: newAttrCheckedState,
        _combination: newAttrCheckedState_array,
      }
    })
    // if (newAttrCheckedState?.length && newAttrCheckedState?.length === all_ptal?.length) {
    //getCombinationInfoAsync({ combination: newAttrCheckedState })
    // }
  }

  function isAttributeChecked_array(valueId) {
    return productConfig._combination.includes(valueId)
  }

  function isAttributeChecked(attribute_id, value_id) {
    return isAttributeChecked_array(value_id)
    // const attrChecked = productConfig.combination
    const attrChecked = combinationQuery.data?._combination
    if (!attrChecked?.find) {
      console.log('#attrChecked ____________________________________');
      console.log(attrChecked);
      return
    }
    return Boolean(attrChecked.find(item => item.attribute_id === attribute_id && item.value_id === value_id))
  }

  return (
    <>
      {all_ptal?.map(ptal => {
        // display_type can be: radio, pills, select, color, multi
        const isRadio = ['radio', 'pills'].includes(ptal.attribute_id.display_type)
        const isSingleValue = ['radio'].includes(ptal.attribute_id.display_type)
        const isCheckbox = ptal.attribute_id.display_type === 'multi'
        const isDropdown = ptal.attribute_id.display_type === 'select'
        const dropDownOptions: DropDownOption[] = ptal.product_template_value_ids.map(ptav => ({ label: ptav.name, value: ptav.id + '' }))
        const dropDownValue = productConfig._combination.find(item => ptal.product_template_value_ids.map(ptav => ptav.id).includes(item)) + ''
        const setDropdown = value => {
          const ptav = ptal.product_template_value_ids.find(ptav => ptav.id + '' === value)
          if (ptav?.id) {
            setAttrCheckedBulk(ptal, [{ attribute_id: ptal.attribute_id.id, value_id: ptav.id }])
          }
        }
        return (
          <View key={ptal.id}>
            <Text style={styles.attrNameText}>{ptal.attribute_id?.display_name} ::{ptal.attribute_id?.display_type}</Text>

            {isDropdown ? <Dropdown
              label={ptal.attribute_id?.display_name}
              placeholder="Select an Option"
              options={dropDownOptions}
              value={dropDownValue}
              onSelect={setDropdown}
            /> : null}

            {isRadio ? ptal.product_template_value_ids?.map(ptav => {
              function handleChange() {
                console.log('#setAttrCheckedBulk #1')
                console.log(ptal);
                setAttrCheckedBulk(ptal, [{ attribute_id: ptal.attribute_id.id, value_id: ptav.id }])
              }
              return (<TouchableOpacity style={styles.attrContainer} key={ptav.id} onPress={handleChange}>
                {isRadio ?
                  <RadioButton
                    value={`${ptal.attribute_id.id}.${ptav.id}`}
                    status={isAttributeChecked_array(ptav.id) ? 'checked' : 'unchecked'} onPress={handleChange}
                  /> : null}
                {isCheckbox ?
                  <Checkbox
                    status={isAttributeChecked_array(ptav.id) ? 'checked' : 'unchecked'} onPress={handleChange}
                  /> : null}
                <CustomText>{ptav.display_name} @{ptav.id}.{ptav.name}</CustomText>
              </TouchableOpacity>)
            }) : null}
          </View>
        )
      })}
    </>
  )
}

function AddToCart({ record }) {
  const [qty, setQty] = useState(1)
  function makeDiff(diff) {
    const newValue = Number(qty) + diff
    if (newValue < 1) {
      setQty(1)
    } else {
      setQty(newValue)
    }
  }
  return (
    <View style={styles.addToCartContainer}>
      <Button style={styles.minusButton} labelStyle={styles.minusButtonText} onPress={() => makeDiff(-1)}>-</Button>
      <View style={styles.qtyInputContainer}>
        <TextInput style={styles.qtyInput} value={qty + ''} onChangeText={value => setQty(Number(value))} />
      </View>
      <Button style={styles.plusButton} labelStyle={styles.plusButtonText} onPress={() => makeDiff(1)}>+</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  attrNameText: {
    color: colors.color_primary_600,
  },
  attrContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    // borderWidth: 4, borderColor: 'purple',
  },
  addToCartContainer: {
    margin: 25,
    flexDirection: 'row',
    // height: 42,
  },
  minusButton: {
    // height: 42,
    borderWidth: 1,
    borderColor: colors.color_primary_600,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  minusButtonText: {
    fontSize: 28,
  },
  qtyInput: {
    backgroundColor: '#FFF',
    height: 40,
    borderWidth: 0,
    borderRadius: 0,
  },
  qtyInputContainer: {
    height: 42,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.color_primary_600,
    backgroundColor: colors.color_primary_600,
    borderRadius: 0,
  },
  plusButton: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.color_primary_600,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  plusButtonText: {
    fontSize: 28,
  },
  debugSubtleText: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'black',
  },
});

const og_web_read = {
  "id": 12,
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "model": "product.template",
    "method": "web_read",
    "args": [
      [
        23
      ]
    ],
    "kwargs": {
      "context": {
        "lang": "en_US",
        "tz": "Africa/Cairo",
        "uid": 2,
        "allowed_company_ids": [
          1
        ],
        "bin_size": true,
        "params": {
          "id": 9,
          "cids": 1,
          "menu_id": 195,
          "action": 328,
          "model": "product.template",
          "view_type": "form"
        },
        "sale_multi_pricelist_product_template": 1
      },
      "specification": {
        "product_variant_count": {},
        "service_type": {},
        "visible_expense_policy": {},
        "is_product_variant": {},
        "attribute_line_ids": {
          "fields": {
            "value_count": {},
            "sequence": {},
            "attribute_id": {
              "fields": {
                "display_name": {}
              }
            },
            "value_ids": {
              "fields": {
                "display_name": {},
                "color": {}
              },
              "context": {
                "show_attribute": false
              }
            }
          },
          "limit": 40,
          "order": "sequence ASC, id ASC"
        },
        "type": {},
        "company_id": {
          "fields": {}
        },
        "fiscal_country_codes": {},
        "pricelist_item_count": {},
        "product_document_count": {},
        "is_published": {},
        "sales_count": {},
        "uom_name": {},
        "id": {},
        "image_1920": {},
        "write_date": {},
        "priority": {},
        "name": {},
        "sale_ok": {},
        "purchase_ok": {},
        "active": {},
        "detailed_type": {},
        "invoice_policy": {},
        "expense_policy": {},
        "product_tooltip": {},
        "list_price": {},
        "tax_string": {},
        "taxes_id": {
          "fields": {
            "display_name": {}
          },
          "context": {
            "default_type_tax_use": "sale",
            "search_default_sale": 1
          }
        },
        "standard_price": {},
        "categ_id": {
          "fields": {
            "display_name": {}
          }
        },
        "default_code": {},
        "valid_product_template_attribute_line_ids": {},
        "barcode": {},
        "product_tag_ids": {
          "fields": {
            "display_name": {}
          }
        },
        "currency_id": {
          "fields": {}
        },
        "cost_currency_id": {
          "fields": {}
        },
        "product_variant_id": {
          "fields": {}
        },
        "product_properties": {},
        "description": {},
        "optional_product_ids": {
          "fields": {
            "display_name": {},
            "color": {}
          }
        },
        "accessory_product_ids": {
          "fields": {
            "display_name": {}
          }
        },
        "alternative_product_ids": {
          "fields": {
            "display_name": {}
          }
        },
        "website_url": {},
        "website_id": {
          "fields": {
            "display_name": {}
          }
        },
        "website_sequence": {},
        "public_categ_ids": {
          "fields": {
            "display_name": {}
          }
        },
        "website_ribbon_id": {
          "fields": {
            "display_name": {}
          }
        },
        "product_template_image_ids": {
          "fields": {
            "id": {},
            "name": {},
            "image_1920": {},
            "sequence": {},
            "write_date": {}
          },
          "limit": 40,
          "order": "sequence ASC"
        },
        "description_sale": {},
        "supplier_taxes_id": {
          "fields": {
            "display_name": {}
          },
          "context": {
            "default_type_tax_use": "purchase",
            "search_default_purchase": 1
          }
        },
        "display_name": {}
      }
    }
  }
}

const example_response_for__get_combination_info = {
  "allow_out_of_stock_order": true,
  "available_threshold": 5,
  "base_unit_name": "Units",
  "base_unit_price": 750,
  "carousel": `
    <div id="o-carousel-product" class="carousel slide position-sticky mb-3 overflow-hidden" data-bs-ride="carousel" data-bs-interval="0" data-name="Product Carousel">
      <div class="o_carousel_product_outer carousel-outer position-relative flex-grow-1 overflow-hidden">
        <div class="carousel-inner h-100">
          <div class="carousel-item h-100 text-center active">
            <div class="position-relative d-inline-flex overflow-hidden m-auto h-100">
              <span class="o_ribbon  z-index-1" style=""></span>
              <div class="d-flex align-items-start justify-content-center h-100 oe_unmovable" data-oe-xpath="/t[1]/div[2]/div[1]" data-oe-model="product.product" data-oe-id="12" data-oe-field="image_1920" data-oe-type="image" data-oe-expression="product_image.image_1920"><img src="/web/image/product.product/12/image_1024/%5BFURN_0096%5D%20Customizable%20Desk%20%28Steel%2C%20White%29?unique=75a43b4" class="img img-fluid oe_unmovable product_detail_img mh-100" alt="Customizable Desk" loading="lazy"/></div>
            </div>
          </div>
        </div>
      </div>
      <div class="o_carousel_product_indicators pt-2 overflow-hidden">
    </div>
    </div>`,
  "cart_qty": 0,
  "compare_list_price": null,
  "display_image": false,
  "display_name": "[FURN_0096] Customizable Desk (Steel, White)",
  "free_qty": 45,
  "has_discounted_price": false,
  "has_stock_notification": false,
  "is_combination_possible": true,
  "list_price": 750,
  "out_of_stock_message": false,
  "parent_exclusions": {},
  "prevent_zero_price_sale": false,
  "price": 750,
  "price_extra": 0,
  "product_id": 12,
  "product_tags": `
        <div class="o_product_tags o_field_tags d-flex flex-wrap align-items-center gap-2">
        </div>`,
  "product_template_id": 9,
  "product_type": "product",
  "show_availability": false,
  "stock_notification_email": "",
  "uom_name": "Units",
  "uom_rounding": 0.01
}

const arraysEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const attrsEqual = (a: AttrValuePair[], b: AttrValuePair[]) => {
  console.log('#attrsEqual()');
  console.log(a);
  console.log(b);
  const hasValuesAndSameLength = a.length && a.length === b.length
  if (hasValuesAndSameLength) {
    return a.every((v, i) => v.value_id === b.find(b_item => b_item.attribute_id === v.attribute_id).value_id);
  } else {
    return false
  }
}

const removeDuplicateAttributes = (newValue: AttrValuePair[], oldValue: AttrValuePair[]) => {
  console.log('#removeDuplicateAttributes()');
  console.log('#oldValue');
  console.log(oldValue);
  console.log('#newValue');
  console.log(newValue);
  const res = oldValue.filter(old_item => !newValue.find(new_item => old_item.attribute_id === new_item.attribute_id))
  console.log('#res');
  console.log(res);
  return res
}

const combinationApiToState = (record, combinationApi): AttrValuePair[] => {
  console.log('#combinationApiToState()');
  const all_ptal = record.valid_product_template_attribute_line_ids
  const hasValuesAndSameLength = (all_ptal?.length && all_ptal?.length === combinationApi?.length)
  if (hasValuesAndSameLength) {
    const res = all_ptal.map((attrObject, i) => ({ attribute_id: attrObject.attribute_id.id, value_id: combinationApi[i] }))
    console.log('#res ');
    console.log(res);
    return res
  } else {
    return []
  }
}

const combinationStateToApi = (state: AttrValuePair[]) => state?.length ? state.map(item => item.value_id) : []

const stripHtmlDebug = data => {
  if (data) {
    const { display_name, carousel, product_tags, ...otherRes } = data
    return otherRes
  }
  return undefined
}

const attr_line_specs = {
  "fields": {
    "value_count": {},
    "sequence": {},
    "attribute_id": {
      "fields": {
        "display_name": {},
        display_type: {},
      }
    },
    "value_ids": {
      "fields": {
        "display_name": {},
        "color": {}
      },
      "context": {
        "show_attribute": false
      }
    },
    "product_template_value_ids": {
      fields: {
        id: {},
        name: {},
        is_custom: {},
        attribute_id: {
          fields: {
            id: {},
            name: {},
          }
        },
      }
    }
  },
  "limit": 40,
  "order": "sequence ASC, id ASC"
}
