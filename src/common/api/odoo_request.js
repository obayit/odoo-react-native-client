import { actions } from '../providers/APIErrorProvider';

export async function isResponseOkAsync(response, args, api, extraOptions) {
    let error_result = {
        ok: false
    }
    let success_result = {
        ok: true
    }
    let is_success = true;
    if ('error' in response){
        is_success = false;
        if (response.error.code == 100){
            // TODO: redirect to login page
            error_result.message = 'Session expired, please login again'  // translate me
            error_result.action = actions.sessionInvalid;
        }
        else if(response.error.code == 200){  // Odoo Server Error
            if (response.error.data.name === 'odoo.exceptions.AccessError'){
                error_result.message = 'Access Denied'  // translate me
                const findModelName = response.error.data.debug.split('');
                if (findModelName.length > 1){
                    error_result.message += findModelName[1].substring(0, findModelName[1].indexOf(")"));
                }
            }
        }
        else if(response.error.code == 404){
            // TODO: redirect to login page
            error_result.message = 'Make sure you are logged in!'  // translate me
            error_result.action = actions.sessionInvalid;  // FIXME: maybe we do not want this behavior! just say 404 not found, maybe!
        }
    }
        // console.log('#response =================================== ');
        // console.log(response);
        // console.log(response?.error)
        // console.log(response?.error?.message)
        // console.log('-----------------------------------------------');
    // checking for custom api errors
    if (response && response.result && response.result.success === false){
        // console.debug('@@@ about to flag error in isResponseOk');
        is_success = false;
        error_result.errorCode = response.result.error;
        if(response.result.message){
            error_result.message = response.result.message  // translate me
        }else{
            // TODO: make sure this general error message is ok
            error_result.message = 'Something went wrong!'  // translate me
        }
    }
    if (response?.error?.message){
        error_result.message = response?.error?.message
    }
    if (is_success){
        return success_result
    }else{
        if(!error_result.message){
             error_result.message = 'Something went wrong!'  // translate me
        }
        return error_result;
    }
}
