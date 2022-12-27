// Need to use the React-specific entry point to import createApi
import { FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isResponseOk } from '../api/odoo_request';

const defaultFields = ['id', 'name'];

function composeParams(model, options = {}){
  let domain = options.domain ? options.domain : [];
  let sort = options.sort ? options.sort : 'create_date desc';
  let limit = options.limit ? options.limit : 100;
  let fields = options.fields ? options.fields : [];
  if(!fields.length){
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

const baseQuery = fetchBaseQuery({ baseUrl: `http://192.168.43.130` })  // TODO: read this from a configurable source!

const baseQueryWithInterceptor  = async (args, api, extraOptions) => {
  /* this method is created only to capture odoo specific errors.
  Since odoo return errors with http response 200, this is necessary.
  Another function that might be added here is to dispatch actions to addErrors,
  and to logout from the app in case of the session being ended (also clear all local data).
  */
  
  console.debug('### we are in the beam of baseQueryWithInterceptor');
  const response = await baseQuery(args, api, extraOptions)
  console.debug(response);
  if(response.error){
    return response;
  }
  if(response.data){
    const responseStatus = isResponseOk(response.data);
    if(responseStatus.ok){
      console.debug('### responseStatus is ok, will return data');
      return {
        data: response.data.result.records
      }
    }else{
      return {
        status: 'CUSTOM_ERROR',
        data: responseStatus,
        error: responseStatus.message,
      }; // as FetchBaseQueryError;
    }
  }

}

// *****************************************************

function getCommonSearchQuery(objName){
  return {
      query: () => ({
        method: 'POST',
        url:'/web/dataset/search_read',
        body: {
          method: 'call',
          jsonrpc:"2.0",
          params: composeParams(objName),
        }
      }),
      // transformResponse: (response) => response.result.records,
    }
}

// Define a service using a base URL and expected endpoints
export const odooApi = createApi({
  reducerPath: 'odooApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getPartners: builder.query(getCommonSearchQuery('res.partner')),
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

    }
    )
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPartners, useWritePartnerMutation } = odooApi
