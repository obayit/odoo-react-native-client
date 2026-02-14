import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery, odooApi } from '../common/store/reduxApi';
import { Text, List, Button, Card, Avatar, Searchbar, Icon, SegmentedButtons } from 'react-native-paper';
import DebugView from '../components/DebugView';
import { useSelector } from 'react-redux';
import { selectAuth } from '../common/store/authSlice';
import OdooImage, { useImageUrl } from '../components/OdooImage';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../navigation/navigation.constants';
import AmountText from '../components/AmountText';
import { groupList } from '../common/utils/commonComponentLogic';
import DataGrid from '../components/DataGrid';
import CustomSearch from '../components/CustomSearch';
import Pagination from '../components/Pagination';

const Item = ({ item }) => {
  const rs = ReusableStyles
  return (
    <View style={rs.listItem}>
      <View style={rs.containerRawSpaceBetween}>
        <Text>{item.name}</Text>
        {/* <Text>{JSON.stringify(item)}</Text> */}
      </View>
    </View>
  )
}

export default ({ navigation, route }) => {
  return (
    <FeatureContainer>
      <CategoriesNew />
    </FeatureContainer>
  );
};

function Categories() {
  const { useQuery } = injectQuery('product.category');
  // http://localhost:8017/shop/category/furnitures-2
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    display_name: '',
    name: '',
  })
  const shopQuery = odooApi.useShopQuery({
    selectedCategory,
  })

  return (
    <>
      <FlatList
        horizontal={true}
        data={shopQuery.data?.categories}
        onRefresh={shopQuery.refetch}
        refreshing={shopQuery.isFetching}
        style={{ height: 50 }}
        contentContainerStyle={{
          height: 50,
          // borderWidth: 1, borderColor: 'red',
        }}
        renderItem={props =>
          <View style={styles.categoryButtonContainer}>
            <Button style={styles.categoryButton} key={props.item.id}
              mode={selectedCategory.id === props.item.id ? 'contained' : 'outlined'}
              onPress={() => setSelectedCategory(props.item)}
            >{props.item.display_name}</Button>
          </View>
        }
      />
      {shopQuery.error ? <Text>{JSON.stringify(shopQuery.error)}</Text> : null}
      <ScrollView>
        {selectedCategory?.id ? <Text>{JSON.stringify(shopQuery.data?.categories, null, 2)}</Text> : null}
      </ScrollView>
      <DebugView />
    </>
  )
}

function CategoriesNew() {
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    display_name: '',
  })
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = useState(0)
  const productsHomeQuery = odooApi.useProductsHomeQuery({
    selectedCategory,
    search: searchTerm,
    page: page + 1,
  })

  const productsList = productsHomeQuery.data?.products
  const pagination = productsHomeQuery.data?.pagination as PaginationData
  // const productsList = groupList(productsHomeQuery.data?.products)

  return (
    <>
      <CustomSearch
        style={{
          marginHorizontal: MARGIN_HORIZONTAL,
          marginVertical: 8,
        }}
        handleSearch={term => setSearchTerm(term)}
      />
      <View
        style={{ height: 50 }}
      >
        <FlatList
          horizontal={true}
          data={productsHomeQuery.data?.categories}
          onRefresh={productsHomeQuery.refetch}
          refreshing={productsHomeQuery.isFetching}
          contentContainerStyle={{
            height: 50,
            // borderWidth: 1, borderColor: 'red',
          }}
          renderItem={props =>
            <View style={styles.categoryButtonContainer}>
              <Button style={styles.categoryButton} key={props.item.id}
                mode={selectedCategory.id === props.item.id ? 'contained' : 'outlined'}
                onPress={() => setSelectedCategory(props.item)}
              >{props.item.name}</Button>
            </View>
          }
        />
      </View>
      {/* <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      <FlatList
        data={productsList}
        onRefresh={productsHomeQuery.refetch}
        refreshing={productsHomeQuery.isFetching}
        contentContainerStyle={{
          // borderWidth: 1, borderColor: 'green'
        }}
        numColumns={2}
        renderItem={props =>
          // <ProductCardDouble products={props.item} productsHomeQuery={productsHomeQuery} />
          <ProductCard product={props.item} productsHomeQuery={productsHomeQuery}
            style={{
              flex: 1,
            }} />
        }
      />
      {/* {productsHomeQuery.data?.products?.length ? <ProductCard product={productsHomeQuery.data?.products[0]} productsHomeQuery={productsHomeQuery} /> : null} */}
      {pagination ? <Pagination page={page} setPage={setPage} totalLength={pagination.total_count} numberOfItemsPerPage={pagination.page_size} /> : null}
      {productsHomeQuery.error ?
        <ScrollView>
          <Text>{JSON.stringify(productsHomeQuery.error)}</Text>
          <Button onPress={productsHomeQuery.refetch} mode='outlined'>refetch</Button>
        </ScrollView> : null}
      {selectedCategory?.id ?
        <ScrollView>
          <Text>{JSON.stringify(productsHomeQuery.data?.categories, null, 2)}</Text>
        </ScrollView>
        : null}
      <DebugView />
    </>
  )
}

function Pagination2() {
  return (
    <SegmentedButtons
      value={'prev'}
      onValueChange={undefined}
      style={{
        width: 230,  // width must be specified, because otherwise it 
        marginHorizontal: 5,
      }}
      buttons={[
        {
          value: 'first',
          label: '<<',
        },
        {
          value: 'prev',
          label: '<',
        },
        {
          value: 'info',
          label: '',
        },
        {
          value: 'next',
          label: '>',
        },
        {
          value: 'last',
          label: '>>',
        },
      ]}
    />
  )
}

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

function ProductCardDouble({ products, productsHomeQuery }) {
  return (
    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'red', }}>
      {products.map(item =>
        <ProductCard product={item} productsHomeQuery={productsHomeQuery}
          style={{
            width: '100%',
          }}
        />)}
    </View>
  )
}
function ProductCard({ product, productsHomeQuery, style = undefined }) {
  const navigation = useNavigation()
  const { imageUrl, headers } = useImageUrl({
    model: 'product.template',
    recordId: product.id,
    field_name: 'image_512',
    // appendUrled
  })
  const products_prices = productsHomeQuery.data?.products_prices ?? {}
  const currency_data = productsHomeQuery.data?.currency_data ?? {}
  function handleNavigateToDetails() {
    navigation.navigate(ScreenNames.ProductDetails, { recordId: product.id })
  }

  return (
    <Card style={[{
      margin: 8,
      // borderWidth: 1,
      // borderColor: 'lime',
    }, style]} onPress={handleNavigateToDetails}>
      <Card.Title title={product.name} subtitle={
        <AmountText amount={products_prices[product.id + '']?.price_reduce} currencyData={currency_data} />
      } />
      <Card.Cover
        source={{
          uri: imageUrl,
          headers,  // fyi: this won't work on android because react-native's Image is broken there, must patch it to use expo-image instead.
        }}
        contentFit='contain'  // we override this with expo-image which supports contentFit instead of resizeMode
      />
    </Card>

  )
}

const Search = ({ searchTerm, setSearchTerm }) => {

  return (
    <Searchbar
      style={{
        marginHorizontal: 8,
        marginVertical: 8,
      }}
      placeholder="Search"
      onChangeText={setSearchTerm}
      autoCapitalize='none'
      value={searchTerm}
      clearIcon={props => <Icon {...props} source='delete' />}
    />
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
});

const meh = {
  "search": "",
  "original_search": false,
  "order": "",
  "category": "product.public.category()",
  "attrib_values": [],
  "attrib_set": "set()",
  "pager": {
    "page_count": 2,
    "offset": 0,
    "page": {
      "url": "/shop?",
      "num": 1
    },
    "page_first": {
      "url": "/shop?",
      "num": 1
    },
    "page_start": {
      "url": "/shop?",
      "num": 1
    },
    "page_previous": {
      "url": "/shop?",
      "num": 1
    },
    "page_next": {
      "url": "/shop/page/2?",
      "num": 2
    },
    "page_end": {
      "url": "/shop/page/2?",
      "num": 2
    },
    "page_last": {
      "url": "/shop/page/2?",
      "num": 2
    },
    "pages": [
      {
        "url": "/shop?",
        "num": 1
      },
      {
        "url": "/shop/page/2?",
        "num": 2
      }
    ]
  },
  "pricelist": "product.pricelist(2,)",
  "fiscal_position": "account.fiscal.position()",
  "add_qty": 1,
  "products": "product.template(9, 33, 29, 16, 18, 7, 19, 23, 24, 25, 22, 27, 26, 8, 5, 6, 10, 11, 12, 13)",
  "search_product": "product.template(9, 33, 29, 16, 18, 7, 19, 23, 24, 25, 22, 27, 26, 8, 5, 6, 10, 11, 12, 13, 14, 15, 17, 21, 34, 37)",
  "search_count": 26,
  "bins": [
    [
      {
        "product": "product.template(9,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(33,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(29,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(16,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      }
    ],
    [
      {
        "product": "product.template(18,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(7,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(19,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(23,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      }
    ],
    [
      {
        "product": "product.template(24,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(25,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(22,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(27,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      }
    ],
    [
      {
        "product": "product.template(26,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(8,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(5,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(6,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      }
    ],
    [
      {
        "product": "product.template(10,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(11,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(12,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      },
      {
        "product": "product.template(13,)",
        "x": 1,
        "y": 1,
        "ribbon": "product.ribbon()"
      }
    ]
  ],
  "ppg": 20,
  "ppr": 4,
  "categories": "product.public.category(1, 2, 3, 4, 5, 6, 7, 8, 9)",
  "attributes": "product.attribute(1, 7, 8, 9, 3)",
  "keep": "<odoo.addons.website.controllers.main.QueryURL object at 0x7f547cf61060>",
  "search_categories_ids": [],
  "layout_mode": "grid",
  "products_prices": {
    "5": {
      "price_reduce": 70
    },
    "6": {
      "price_reduce": 40
    },
    "7": {
      "price_reduce": 280
    },
    "8": {
      "price_reduce": 450
    },
    "9": {
      "price_reduce": 750
    },
    "10": {
      "price_reduce": 147
    },
    "11": {
      "price_reduce": 320
    },
    "12": {
      "price_reduce": 15.8
    },
    "13": {
      "price_reduce": 1799
    },
    "16": {
      "price_reduce": 33
    },
    "18": {
      "price_reduce": 85
    },
    "19": {
      "price_reduce": 25
    },
    "22": {
      "price_reduce": 885
    },
    "23": {
      "price_reduce": 295
    },
    "24": {
      "price_reduce": 110.5
    },
    "25": {
      "price_reduce": 2350
    },
    "26": {
      "price_reduce": 4000
    },
    "27": {
      "price_reduce": 1500
    },
    "29": {
      "price_reduce": 12
    },
    "33": {
      "price_reduce": 20
    }
  },
  "get_product_prices": "<function WebsiteSale.shop.<locals>.<lambda> at 0x7f547cf5a9e0>",
  "float_round": "<function float_round at 0x7f5489267d90>",
  "all_tags": "product.tag()",
  "tags": {}
}

const meh2 = [
  {
    "model": "product.template",
    "base_domain": [
      [
        "&",
        [
          "sale_ok",
          "=",
          true
        ],
        [
          "website_id",
          "in",
          [
            false,
            1
          ]
        ]
      ]
    ],
    "search_fields": [
      "name",
      "default_code",
      "product_variant_ids.default_code",
      "description",
      "description_sale"
    ],
    "fetch_fields": [
      "id",
      "name",
      "website_url",
      "description",
      "description_sale"
    ],
    "mapping": {
      "name": {
        "name": "name",
        "type": "text",
        "match": true
      },
      "default_code": {
        "name": "default_code",
        "type": "text",
        "match": true
      },
      "product_variant_ids.default_code": {
        "name": "product_variant_ids.default_code",
        "type": "text",
        "match": true
      },
      "website_url": {
        "name": "website_url",
        "type": "text",
        "truncate": false
      },
      "image_url": {
        "name": "image_url",
        "type": "html"
      },
      "description": {
        "name": "description_sale",
        "type": "text",
        "match": true
      },
      "detail": {
        "name": "price",
        "type": "html",
        "display_currency": "res.currency(1,)"
      },
      "detail_strike": {
        "name": "list_price",
        "type": "html",
        "display_currency": "res.currency(1,)"
      },
      "extra_link": {
        "name": "category",
        "type": "html"
      }
    },
    "icon": "fa-shopping-cart",
    "results": "product.template(9, 33, 29, 16, 18, 7, 19, 23, 24, 25, 22, 27, 26, 8, 5, 6, 10, 11, 12, 13, 14, 15, 17, 21, 34, 37, 2, 1, 28, 3, 4, 20)",
    "count": 32
  }
]

/*
35] "GET /web/image/product.template/23/image_medium?unique=3462180741641 HTTP/1.1" 200 - 3 0.001 0.005
38] "GET /web/image/product.template/23/image_512?unique=1181843860331 HTTP/1.1" 404 - 1 0.002 0.004

*/

const MARGIN_HORIZONTAL = 8

type PaginationData = {
  current_page: number
  total_pages: number
  page_size: number
  total_count: number
  has_next: Boolean
  has_prev: Boolean
}