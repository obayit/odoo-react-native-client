import { Text, useStyleSheet } from "@ui-kitten/components";
import { ReusableStyles } from "../components/styles";

const InputLabel = ({label, labelStyle, ...props}) => {
  props.style.push(labelStyle);
  return <Text {...props}>{label}</Text>;
}

export const useLabelStyle = (label, labelStyle) => {
  if(!label){
    return null;
  }
  const reusableStyles = useStyleSheet(ReusableStyles);
  if(!labelStyle){
    labelStyle = reusableStyles.labelStyle;
    let strLabel = label;
    label = (props) => InputLabel({ label: strLabel, labelStyle, ...props })
  }
  return label;
}
