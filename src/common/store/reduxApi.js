// Need to use the React-specific entry point to import createApi
import { FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isResponseOk } from '../api/odoo_request';

const defaultFields = ['id', 'name'];
const KEEP_UNUSED_DATA_FOR = 60  // cache time in seconds (60, is the default value)

// *****************************************************

const baseQuery = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: api.getState().configuration?.baseUrl,
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
  if (response.error) {
    return response;
  }
  if (response.data) {
    // console.log('# we are in the beam of !!response.data')
    const responseStatus = isResponseOk(response.data);
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
      return {
        meta: {
          status: 'CUSTOM_ERROR',
        },
        // data: responseStatus,
        error: responseStatus.message,
      }; // as FetchBaseQueryError;
    }
  }

}

// *****************************************************

function baseOdooRequest({ url, params }) {
  return {
    url,
    method: 'POST',
    body: {
      jsonrpc: "2.0",
      method: "call",
      params,
    },
  }
}

// function getCommonSearchQuery(model: OdooModel, options: any = {}) {
function getCommonSearchQuery(
  model: OdooModel,
) {
  return {
    query: (params: any = {}) => {
      const args = { ...params.args };
      args.model = model
      args.domain = args.domain ?? [];
      args.fields = args.fields ?? defaultFields;
      return baseOdooRequest({
        url: '/web/dataset/search_read',
        params: args ,
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
  }),
});

const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

export const injectQuery = (model, options={}) => {
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
        ...getCommonSearchQuery(model),
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
