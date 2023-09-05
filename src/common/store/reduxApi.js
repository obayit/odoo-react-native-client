// Need to use the React-specific entry point to import createApi
import { FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isResponseOk } from '../api/odoo_request';

const defaultFields = ['id', 'name'];

function composeParams(model, options = {}) {
  let domain = options.domain ? options.domain : [];
  let sort = options.sort ? options.sort : 'create_date desc';
  let limit = options.limit ? options.limit : 100;
  let fields = options.fields ? options.fields : [];
  if (!fields.length) {
    switch (model) {
      case 'res.partner':
        fields = defaultFields;
        break;

      default:
        fields = defaultFields;
        break;
    }
  }
  return {
    model,
    domain,
    limit,
    sort,
    fields,
  }
}

// *****************************************************

const baseQuery = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: api.getState().configuration?.baseUrl || `http://192.168.112.179:8015`,
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
        status: 'CUSTOM_ERROR',
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

function getCommonSearchQuery(objName, options) {
  return {
    query: () => (baseOdooRequest({
      url: '/web/dataset/search_read',
      params: composeParams(objName, options),
    })),
    // transformResponse: (response) => response.result.records,
  }
}

// Define a service using a base URL and expected endpoints
export const odooApi = createApi({
  reducerPath: 'odooApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getPartners: builder.query(getCommonSearchQuery('res.partner')),
    products: builder.query(getCommonSearchQuery('product.product', { fields: ['id', 'name', 'list_price', 'currency_id'] })),
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
        params: {
          db: 'v15react',  // FIXME: make database name configurable
          login: data.login,
          password: data.password,
        },
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

export const injectQuery = (model, options) => {
  let defaultOptions = {
    fields: ['id', 'name'],
  }
  options = { ...defaultOptions, ...(options || {}) }
  const { fields } = options;

  let queryName = '';
  model.split('.').map(part => queryName += capitalize(part));
  const api = odooApi.injectEndpoints({
    endpoints: (builder) => ({
      [queryName]: builder.query(getCommonSearchQuery(model, { fields })),
    }),
    overrideExisting: true,  // TODO: put correct value for thisk
  });
  return {
    useQuery: api.endpoints[queryName].useQuery,
  }
}

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPartnersQuery, useWritePartnerMutation, useLoginMutation, useProductsQuery, useUpdateCartMutation } = odooApi

const meh = {
  "auth": {
    "_persist": {
      "rehydrated": true,
      "version": -1
    },
    "active_ids_limit": 20000,
    "cache_hashes": {
      "assets_discuss_public": "7db29ad7d4c5da1b989fce1382ba9eafee4abfbb3fd770cf8e32219eadae34ed",
      "load_menus": "6476c4ed8312ff36ea86fe14034e9f747e5e38fd91a052109a633aab874eba19",
      "qweb": "5f0312acf4a02e82fdb2e10c5617c0223420438f0cc0bee99b40d15f12beb289",
      "translations": "5227498d9df4b403b0244c75aac21e0c091e50ce"
    },
    "company_id": 1,
    "currencies": {
      "1": [Object],
      "2": [Object]
    },
    "db": "v15react",
    "display_switch_company_menu": false,
    "home_action_id": false,
    "iap_company_enrich": false,
    "is_admin": true,
    "is_system": true,
    "max_file_upload_size": 134217728,
    "name": "Mitchell Admin",
    "notification_type": "email",
    "odoobot_initialized": true,
    "partner_display_name":
      "YourCompany, Mitchell Admin",
    "partner_id": 3,
    "profile_collectors": null,
    "profile_params": null,
    "profile_session": null,
    "server_version": "15.0",
    "server_version_info": [15, 0, 0, "final", 0, ""],
    "show_effect": "True",
    "support_url": "https://www.odoo.com/buy", "tour_disable": true, "uid": 2, "user_companies": { "allowed_companies": [Object], "current_company": 1 }, "user_context": { "lang": "en_US", "tz": "Africa/Khartoum", "uid": 2 }, "user_id": [2], "username": "admin", "web.base.url": "http://usr5:8015", "web_tours": []
  }, "odooApi": { "config": { "focused": true, "keepUnusedDataFor": 60, "middlewareRegistered": true, "online": true, "reducerPath": "odooApi", "refetchOnFocus": false, "refetchOnMountOrArgChange": false, "refetchOnReconnect": false }, "mutations": {}, "provided": {}, "queries": { "products(undefined)": [Object] }, "subscriptions": {} }
}
