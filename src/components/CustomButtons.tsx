import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import colors from './colors';

export function CustomButton(props){
    return <Button style={styles.button} {...props} />
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.color_info_300,
    },
})
