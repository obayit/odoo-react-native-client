// post processing of fields
function currencyFormat(num) {
    if(!num){
        return '';
    }
    if(typeof num === 'string' || num instanceof String){
        num = Number(num);
    }
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function displayM2O(value){
    if(value && value.length === 2){
        return value[1];
    }
    else{
        return null;
    }
}

export { currencyFormat, displayM2O }
