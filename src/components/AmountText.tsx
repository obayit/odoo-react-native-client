import { StyleSheet } from 'react-native'
import colors from './colors'
import { Text } from 'react-native-paper'

export default function AmountText({ amount, currencyData }) {
    let currency_after = ''
    let currency_before = ''
    const currency_display_value = currencyData?.symbol || currencyData?.name || ''
    if (currency_display_value) {
        if (currencyData?.position === 'after') {
            currency_after = ` ${currency_display_value}`
        } else {
            // defaults to before
            currency_before = `${currency_display_value} `
        }
    }
    return (
        <Text>
            {currency_before ? <Text variant='titleMedium' style={styles.currencyText}>{currency_before}</Text> : null}
            <Text variant='titleMedium' style={styles.numberText}>{(Math.round(amount * 100) / 100).toFixed(2)}</Text>
            {currency_after ? <Text variant='titleMedium' style={styles.currencyText}>{currency_after}</Text> : null}
        </Text>
    )
}

const styles = StyleSheet.create({
    currencyText: {
        color: colors.color_primary_600,
    },
    numberText: {
        color: colors.color_info_600,
    },
})
