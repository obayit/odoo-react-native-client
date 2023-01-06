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

const baseQuery = fetchBaseQuery({ baseUrl: `http://192.168.113.179:8015` })  // TODO: read this from a configurable source!

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
    /* this method is created only to capture odoo specific errors.
    Since odoo return errors with http response 200, this is necessary.
    Another function that might be added here is to dispatch actions to addErrors,
    and to logout from the app in case of the session being ended (also clear all local data).
    */

    // console.debug('### we are in the beam of baseQueryWithInterceptor');
    // console.debug(args);
    const response = await baseQuery(args, api, extraOptions)
    // console.debug('response');
    // console.debug(response);
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
            query: (data) => (baseOdooRequest({
                url: '/web/session/authenticate',
                params: {
                    db: 'v15react',  // FIXME: make database name configurable
                    login: data.login,
                    password: data.password,
                },
            })),
            // Pick out data and prevent nested properties in a hook or selector
            // transformResponse: (response, meta, arg) => {
            //   return response;
            // },
        }),
        updateCart: builder.mutation({
            query: (data) => (baseOdooRequest({
                url: '/shop/cart/update_json',
                params: {
                    // TODO: continue from here
                    add_qty: 1,
                    force_create: true,
                    no_variant_attribute_values: "[]",
                    product_custom_attribute_values: "[]",
                    product_id: 12,
                    quantity: 1,
                    variant_values: [1, 3]
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
export const { useGetPartnersQuery, useWritePartnerMutation, useLoginMutation, useProductsQuery } = odooApi
