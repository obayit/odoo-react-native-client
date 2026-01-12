import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery, odooApi } from '../common/store/reduxApi';
import useSingleRecord from '../common/hooks/useSingleRecord';
import { CustomButton } from '../components/CustomButtons';
import colors from '../components/colors';
import { Button, RadioButton, TextInput } from 'react-native-paper';
import CustomText from '../components/CustomText';
import OdooImage from '../components/OdooImage';
import DebugView from '../components/DebugView';
import AmountText from '../components/AmountText';


interface ProductConfigurationData {
  variantId: Number;
  combination: Array<Number>;
  qty: Number;
}


export default function ProductDetailsScreen({ navigation, route }) {
  const rs = ReusableStyles;
  const passedRecord = route.params?.record
  const recordId = passedRecord?.id ?? route.params.recordId
  const [attrChecked, _setAttrChecked] = useState<AttrCheckedMap>({})
  const [productConfig, setProductConfig] = useState<ProductConfigurationData>({
    variantId: 0,
    combination: [],
    qty: 1,
  })

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
      },
    },
  })
  const [combinationQueryFn, combinationQuery] = odooApi.useLazyControllerQuery()

  function getCombinationInfo({ combination }) {
    combinationQueryFn({
      url: '/website_sale/get_combination_info',
      params: {
        "product_template_id": recordId,
        "product_id": productConfig.variantId,
        "combination": combination ?? productConfig.combination,
        "add_qty": productConfig.qty,
        "parent_combination": []  // ?what is this
      },
    })
  }

  useEffect(() => {
    if (combinationQuery.data) {
      console.log(combinationQuery.data)
    }
  }, [combinationQuery.data])


  const { data, isLoading, refetch } = query

  function setAttrChecked(attribute_id, value_id) {
    const output = Object.entries(attrChecked)
      .filter(([k, v]) => {
        // first remove all(should be only one at most) keys that target the same attribute, since only one can be selected at a time
        return !k.startsWith(`${attribute_id}.`); // some irrelevant conditions here
      })
      .reduce((accum, [k, v]) => {
        accum[k] = v; // reduce returns other attribute/value as is
        return accum;
      }, {});
    output[`${attribute_id}.${value_id}`] = true // assign true to the current selected attribute/value
    _setAttrChecked(output)

    const newCombination = Object.keys(output).map(key => Number(key.split('.')[1]))
    setProductConfig({
      ...productConfig,
      combination: newCombination,
    })

    const allAttributesAreSet = newCombination.length === record?.attribute_line_ids?.length
    console.log('#allAttributesAreSet');
    console.log(allAttributesAreSet);
    console.log('#newCombination.length === record?.attribute_line_ids?.length');
    console.log(`${newCombination.length} === ${record?.attribute_line_ids?.length}`);
    if (allAttributesAreSet) {
      getCombinationInfo({ combination: newCombination })
    }
  }


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
    if (attrChecked) {
      record.attribute_line_ids?.map(item => {


      })
    }
    return ''
  }

  return (
    <FeatureContainer loading={isLoading}>
      <ScrollView>
        <AddToCart record={record} />
        <CustomButton onPress={query.refetch}>reload</CustomButton>
        <CustomButton onPress={getCombinationInfo}>getCombination info</CustomButton>
        <Text>productConfig: {JSON.stringify(productConfig, null, 2)}</Text>
        {/* <Text>combination: {JSON.stringify(combinationQuery.data, null, 2)}</Text> */}
        {/* <Text>{JSON.stringify(record, null, 2)}</Text> */}
        <Text>product_id:: {JSON.stringify(combinationQuery.data?.product_id)}</Text>
        <OdooImage
          model={combinationQuery.data?.product_id ? 'product.product' : 'product.template'}
          recordId={combinationQuery.data?.product_id ? combinationQuery.data?.product_id : record.id}
          field_name='image_512'
          style={styles.image}
        />
        <Text style={rs.textDebug}>{JSON.stringify(query.error)}</Text>
        {record.description_sale ? <CustomText>{record.description_sale}</CustomText> : null}
        <AmountText amount={record?.list_price} currencyData={record.currency_id} />
        {record?.attribute_line_ids?.map(attr => <View key={attr.id}>
          <Text style={styles.attrNameText}>{attr.attribute_id?.display_name}</Text>
          {attr.value_ids?.map(attrValue => {
            function handleChange() {
              setAttrChecked(attr.id, attrValue.id)
            }
            return (<TouchableOpacity style={styles.attrContainer} key={attrValue.id} onPress={handleChange}>
              <RadioButton
                value={`${attr.id}.${attrValue.id}`}
                status={attrChecked[`${attr.id}.${attrValue.id}`] ? 'checked' : 'unchecked'} onPress={handleChange}
              />
              <CustomText>{attrValue.display_name}</CustomText>
            </TouchableOpacity>)
          })}
        </View>)}
        <AddToCart record={record} />
        {/* <DebugView/> headersMap*/}
      </ScrollView>
    </FeatureContainer>
  );
};

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

interface AttrCheckedMap {
  [key: string]: boolean;  // key includes attribute_id and value_id
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