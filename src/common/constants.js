// NOTE: using DEV helps to avoid shipping test databases to production releases
export const get_db_name = () => process.env.REACT_APP_DEV_MODE ? process.env.REACT_APP_ODOO_DB : 'odoo';
export const get_odoo_url = () => {
    let res = '';
    if(process.env.REACT_APP_FORCE_ODOO_URL){
        // this is for portal website
        res = process.env.REACT_APP_FORCE_ODOO_URL;
    }
    else if(process.env.REACT_APP_DEV_MODE){
        // this is for development purposes
        if(process.env.REACT_APP_ODOO_URL){
            res = process.env.REACT_APP_ODOO_URL;
        }
    }else{
        // this is for mobile app
        res = 'http://192.168.143.130:8069';  // put your default odoo server url here
    }
    return res;
}
