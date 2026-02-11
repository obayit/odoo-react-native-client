// Need to use the React-specific entry point to import createApi
import { EndpointBuilder, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isResponseOkAsync } from '../api/odoo_request';
import { logOut, updateAuth } from './authSlice';
import slug from '../utils/slug';

const defaultFields = ['id', 'name'];
const KEEP_UNUSED_DATA_FOR = 60  // cache time in seconds (60, is the default value)
export const emptyList = []
export const emptyObject = {}
const newOdooVersion = true

const emptyJsonRpcBody = {
  jsonrpc: "2.0",
  method: "call",
  params: {},
}

const baseQuery = async (args, api, extraOptions) => {
  const baseUrl = api.getState().configuration?.baseUrl
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
  })
  return rawBaseQuery(args, api, extraOptions)
}

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  /* this method is created only to capture odoo specific errors.
  Since odoo return errors with http response 200, this is necessary.
  Another function that might be added here is to dispatch actions to addErrors,
  and to logout from the app in case of the session being ended (also clear all local data).
  */

  // console.debug('### we are in the beam of baseQueryWithInterceptor');
  // console.debug(args);
  const response = await baseQuery(args, api, extraOptions)
  const headersMap = response?.meta?.response?.headers?.map
  if(headersMap && args.url === '/web/session/authenticate'){
    if(headersMap['set-cookie']){
      headersMap['set-cookie']
      .split('; ')
      .map(cookie => {
        const [name, ...rest] = cookie.split('=');
        const value = decodeURIComponent(rest.join('='))
        if(name === 'session_id'){
          // we have to store session_id in redux state because Image component doesn't use fetch, and  there is no other way to authenticate Image requests, if you removed this, only public images will be displayed, and only when the odoo server has only 1 database
          api.dispatch(updateAuth({ 'session_id': value }))
        }
        return [name, value];  // unused return
      })


    }
  }
  if(response?.meta?.response?.status === 404){
    const sessionResult = await baseQuery(
      { url: '/web/session/get_session_info', method: 'POST' },
      api,
      extraOptions
    )
    if (sessionResult?.meta?.response?.status === 404) {
      api.dispatch(logOut())
    }
  }
  if (response.error) {
    return response;
  }
  if (response.data) {
    // console.log('# we are in the beam of !!response.data')
    const responseStatus = await isResponseOkAsync(response.data, args, api, extraOptions);
    if (responseStatus.ok) {
      // console.debug('### responseStatus is ok, will return data');
      const res = {
        data: response.data.result,
      }
      // console.debug('# res');
      // console.debug(res);
      return res;
    } else {
      // console.debug('### responseStatus is error');
      // console.debug(JSON.stringify(response, null, 2));
      return {
        meta: {
          status: 'CUSTOM_ERROR',
        },
        // data: responseStatus,
        error: {
          message: responseStatus.message,
          data: response.data?.error?.data,
        }
      }; // as FetchBaseQueryError;
    }
  }

}

// *****************************************************

function baseOdooRequest({ url, params }) {
  // console.log('#baseOdooRequest ... ... ...');
  const res = {
    url,
    method: 'POST',
    body: {
      jsonrpc: "2.0",
      method: "call",
      params,
    },
  }
  // console.log('#res');
  // console.log(JSON.stringify(res, null, 2));
  return res
}

// function getCommonSearchQuery(model: OdooModel, options: any = {}) {
function getCommonSearchQuery_old(
  model  // : OdooModel,
) {
  return {
    query: (params = {}) => {
      const args = { ...params.args };
      args.model = model
      args.domain = args.domain ?? [];
      args.fields = args.fields ?? defaultFields;
      if(newOdooVersion){
        args.method = 'search_read'
        args.args = 'search_read'
      }
      const url_version_new = `web/dataset/call_kw/${model}/search_read`
      const url_version_old = '/web/dataset/search_read'
      return baseOdooRequest({
        url: url_version_new,

        params: args ,
      });
    },
    // transformResponse: (response) => response.result.records,
  };
}

function getCommonSearchQuery(
  model: any,
  options: any,
) {
  // only works on 17.0 and above, but can be fixed
  const method = options?.method ?? "web_search_read"
  return {
    query: (params: any = {}) => {
      const passedKwArgs = { ...params.kwargs };
      const fixedParams: any = {}

      // filling required args
      fixedParams.model = model
      fixedParams.method = method
      fixedParams.args = params.args ?? []
      const kwargs: any = {}

      const specMethods = ["web_search_read"];
      const fieldMethods = ["search_read"];
      // console.log('#passedKwArgs');
      // console.log(JSON.stringify(passedKwArgs, null, 2));
      if (specMethods.includes(method)) {
        if(!passedKwArgs.specification){
          let manualSpec = {}
          if(passedKwArgs.fields){
            passedKwArgs.fields.map(item => manualSpec[item]={})
            delete passedKwArgs.fields
          }
          passedKwArgs.specification = manualSpec
        }
      }
      if (fieldMethods.includes(method) || specMethods.includes(method)) {
        passedKwArgs.context = passedKwArgs.context
          ? passedKwArgs.context
          : {
              // todo: get language from user loginInfo
              // lang: "ar_001",
            };
        passedKwArgs.domain = passedKwArgs.domain ?? [];
      }

      fixedParams.kwargs = passedKwArgs
      return baseOdooRequest({
        url: `/web/dataset/call_kw/${model}/${method}`,
        params: fixedParams,
      });
    },
    // transformResponse: (response) => response.result.records,
  };
}

// Define a service using a base URL and expected endpoints
export const odooApi = createApi({
  reducerPath: 'odooApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getPartners: builder.query(getCommonSearchQuery('res.partner')),
    products: builder.query(getCommonSearchQuery('product.product')),
    writePartner: builder.mutation({
      query: (data) => ({
        url: '/TODO/write_api_here',
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params: data,
        }
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
    }),
    login: builder.mutation({
      query: (data) => {
        return (baseOdooRequest({
        url: '/web/session/authenticate',
        params: data,
      }))},
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response, meta, arg) => {
      //   return response;
      // },
    }),
    updateCart: builder.mutation({
      query: ({ product_id, quantity = 1 }) => (baseOdooRequest({
        url: '/shop/cart/update_json',
        params: {
          // TODO: continue from here
          add_qty: 1,
          force_create: true,
          no_variant_attribute_values: [],  // see Attributes and values in the product form
          product_custom_attribute_values: [],
          product_id,
          quantity,  // what dis?
          variant_values: [],  // what dis?
        },
      })),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response, meta, arg) => {
      //   return response;
      // },
    }),
    controller: builder.query({
      query: ({ url, params }) => ({
        url,
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params,
        }
      }),
    }),
    // Dedicated endpoints for website/product combination APIs so they have
    // independent cache entries (instead of sharing the generic `controller` endpoint).
    getCombinationInfo: builder.query({
      query: (arg) => ({
        url: '/website_sale/get_combination_info',
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params: arg.params,
        }
      }),
      transformResponse: (response, meta, arg) => {
        if(response?.is_combination_possible === true){
          response._combination = arg.combination  // not used for now, we use productConfig._combination
          response._ptav = arg.params.combination  // not used for now, we use productConfig._combination
        }
        return response
      }
    }),
    getFirstCombination: builder.query({
      query: (params) => ({
        url: '/web/dataset/call_kw',
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params,
        }
      }),
    }),
    getAttributeExtraPrice: builder.query({
      query: (params) => ({
        url: '/web/dataset/call_kw',
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params,
        }
      }),
    }),
    shop: builder.query({
      query: (arg) => ({
        url: composeShopUrl(arg),
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params: {
            // categoryId: arg.selectedCategory.id,
          },
        }
      }),
    }),
    productsHome: builder.query({
      query: (arg) => ({
        // url: composeProductsHomeUrl(arg),
        url: '/obi_app/products/home',
        method: 'POST',
        body: {
          jsonrpc: "2.0",
          method: "call",
          params: {
            categoryId: arg.selectedCategory.id,
            search: arg.search,
            page: arg.page,
          },
        }
      }),
    }),
    profile: builder.query({
      query: (arg) => ({
        // url: composeProductsHomeUrl(arg),
        url: '/obi_app/profile',
        method: 'POST',
        body: emptyJsonRpcBody,
      }),
    }),
    updateProfile: builder.mutation({
      query: (args) => (baseOdooRequest({
        url: '/obi_app/profile/edit',
        params: args,
      })),
    }),
    updateProfileData: builder.query({
      query: (args) => (baseOdooRequest({
        url: '/obi_app/profile/edit/data',
        params: args,
      })),
    }),
  }),
});

function composeShopUrl(arg){
  let res = '/obi_dashboard/shop'
  if(arg.selectedCategory?.id){
    res += `/category/${slug(arg.selectedCategory)}`
  }
  return res
}

function composeProductsHomeUrl(arg){
  let res = '/obi_app/products/home'
  if(arg.selectedCategory?.id){
    res += `/category/${slug(arg.selectedCategory)}`
  }
  return res
}


const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

export const injectQuery = (model, options: any = {}) => {
  let queryName = model;
  if (options?.reduxNameSuffix) {
    queryName += options.reduxNameSuffix;
    delete options.reduxNameSuffix;
  }
  const tags = [queryName];
  const customTags = options.customTags || [];
  tags.push(...customTags);
  odooApi.enhanceEndpoints({ addTagTypes: tags });
  const api = odooApi.injectEndpoints({
    endpoints: (builder) => ({
      [queryName]: builder.query({
        ...getCommonSearchQuery(model, options?.searchOptions),
        providesTags: (result, error, arg) => {
          const res = result?.records?.map
            ? [
                ...result.records.map(({ id }) => ({
                  type: model,
                  id,
                })),
                queryName,
              ]
            : [queryName];
          tags.map((item) => !res.includes(item) && res.push(item));
          return res;
        },
        keepUnusedDataFor: KEEP_UNUSED_DATA_FOR,
      }),
    }),
    overrideExisting: true, // TODO: put correct value for this
  });
  return {
    useQuery: api.endpoints[queryName].useQuery,
    useLazyQuery: api.endpoints[queryName].useLazyQuery,
  };
};

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPartnersQuery, useWritePartnerMutation, useLoginMutation, useProductsQuery, useUpdateCartMutation } = odooApi
