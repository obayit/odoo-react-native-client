import { emptyObject, injectQuery } from "../store/reduxApi";

type TSingleRecordParams = {
  model: string
  recordId?: number
  injectOptions?: any
  queryOptions?: any
  queryKwArgs?: any
}

export default function ({ model, recordId, injectOptions={}, queryOptions={}, queryKwArgs={} }: TSingleRecordParams) {
  const finalInjectOptions = {
    searchOptions: {
        method: 'web_read',
    },
    ...injectOptions,
  }
  const { useQuery } = injectQuery(model, finalInjectOptions);
  if(Array.isArray(recordId) && recordId.length){
    recordId = recordId[0]
  }
  const query = useQuery(
    {
      args: [[recordId]],
      kwargs: {
        ...queryKwArgs,
      },
    },
    {
      skip: !recordId,
      ...queryOptions,
    }
  );
  const record = query.data?.length ? query.data[0] : emptyObject

  return { 
    query,
    isLoading: query.isLoading,
    record,
  }
}

/*
{
  "id": 24,
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "model": "account.move",
    "method": "web_read",
    "args": [
      [
        6
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
        "default_move_type": "in_invoice",
        "display_account_trust": true
      },
      "specification": {
        "authorized_transaction_ids": {},
        "name": {},
        "display_name": {}
      }
    }
  }
}
 "url": "/web/dataset/call_kw/product.template/web_read",
  "method": "POST",
  "body": {
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "product.template",
      "method": "web_read",
      "args": [],
      "kwargs": {
        "domain": [
          [
            "id",
            "=",
            23
          ]
        ],
        "specification": {
          "id": {},
          "name": {},
          "list_price": {},
          "currency_id": {
            "fields": {
              "display_name": {},
              "symbol": {},
              "position": {}
            }
          }
        }
      }
    }
  }
}


*/
