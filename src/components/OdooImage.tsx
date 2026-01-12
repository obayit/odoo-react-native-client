import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from "react-redux";
import { selectAuth, selectConfiguration } from "../common/store/authSlice";
import * as Clipboard from 'expo-clipboard';
import { CustomButton } from "./CustomButtons";
import { Image } from 'expo-image'

export function useImageUrl({ model, recordId, field_name, appendUrl = '' }) {
    const configuration = useSelector(selectConfiguration)
    //   const clientInfo = useSelector(selectClientInfo)
    //   const cacheKey = `${model}.img.${field_name}.${recordId}`
    const UNIQUE_ID = useMemo(() =>
        Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000,
        [/*clientInfo[cacheKey]*/]
    );
    const oldVersionUrl = `${configuration.baseUrl}/web/image?model=${model}&id=${recordId}&field=${field_name}&unique=${UNIQUE_ID}`
    const newVersionUrl = `${configuration.baseUrl}/web/image/${model}/${recordId}/${field_name}${appendUrl}?unique=${UNIQUE_ID}`
    // http://localhost:8017/web/image/product.template/23/image_512/%5BFURN_6666%5D%20Acoustic%20Bloc%20Screens?unique=93a52a6
    const imageUrl = recordId
        ? newVersionUrl
        : undefined;
    return {
        imageUrl,
        // cacheKey,
    }
}

export default function OdooImage({ model, recordId, field_name = 'image_medium', appendUrl = '', style }) {
    const { imageUrl } = useImageUrl({
        model,
        recordId,
        field_name,
        appendUrl,
    })
    function debugCopy() {
        if (imageUrl) {
            Clipboard.setStringAsync(imageUrl);
        }

    }
    const auth = useSelector(selectAuth)
    async function debugDownloadAsync() {
        const res = await fetch(imageUrl)
        console.log('#res');
        console.log(res);
        console.log(res.status);
        console.log(res.statusText);
        const blob = await res.blob();
        console.log(blob); // image data
    }
    const headers = {
        // if you don't want to store session_id in redux for security reasons,
        // you will have to implement your own Image logic including the following:
        // caching images, (where to store files and when to delete them)
        // fetching images only when the component is visible in the screen (or close in the scroll view)
        'cookie': `session_id=${auth.session_id}`,
    }
    const debugImage = true

    if (debugImage) {
        return (
            <View style={styles.debugContainer}>
                <Image source={{
                    uri: imageUrl,
                    headers
                }} style={style ?? styles.image} contentFit="scale-down" />

                <TouchableOpacity onPress={debugCopy}>
                    <Text>Image URL: {JSON.stringify(imageUrl)}</Text>
                </TouchableOpacity>
                <CustomButton onPress={debugDownloadAsync}>download</CustomButton>
            </View>
        )
    } else {
        return (
            <Image source={{
                uri: imageUrl,
                headers
            }} style={style ?? styles.image} contentFit="scale-down" />
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 150,
    },
    debugContainer: {
        borderWidth: 1, borderColor: 'yellow',
        marginVertical: 8,
        backgroundColor: '#888',
    },
})

/*

2026-01-04 12:41:13,370 118531 ERROR v17dash odoo.http: Exception during request handling. 
Traceback (most recent call last):
  File "/home/obayit/src/vs/odoo17/odoo/http.py", line 2208, in __call__
    response = request._serve_db()
  File "/home/obayit/src/vs/odoo17/odoo/http.py", line 1783, in _serve_db
    return service_model.retrying(self._serve_ir_http, self.env)
  File "/home/obayit/src/vs/odoo17/odoo/service/model.py", line 133, in retrying
    result = func()
  File "/home/obayit/src/vs/odoo17/odoo/http.py", line 1810, in _serve_ir_http
    response = self.dispatcher.dispatch(rule.endpoint, args)
  File "/home/obayit/src/vs/odoo17/odoo/http.py", line 1927, in dispatch
    return self.request.registry['ir.http']._dispatch(endpoint)
  File "/home/obayit/src/vs/odoo17/addons/website/models/ir_http.py", line 235, in _dispatch
    response = super()._dispatch(endpoint)
  File "/home/obayit/src/vs/odoo17/odoo/addons/base/models/ir_http.py", line 222, in _dispatch
    result = endpoint(**request.params)
  File "/home/obayit/src/vs/odoo17/odoo/http.py", line 759, in route_wrapper
    result = endpoint(self, *args, **params_ok)
  File "/home/obayit/src/vs/odoo17/addons/web/controllers/binary.py", line 169, in content_image
    raise Exception('hi')


*/
