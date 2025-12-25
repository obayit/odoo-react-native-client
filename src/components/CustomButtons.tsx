import { Button } from "react-native"

export function CustomButton(props){
    const { children, ...otherProps } = props
    return <Button {...otherProps} title={children} />
}
