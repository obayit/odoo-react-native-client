import CustomText from "../components/CustomText";
import { ReusableStyles } from "../components/styles";

const InputLabel = ({label, labelStyle, ...props}) => {
  props.style?.push(labelStyle);
  return <CustomText {...props}>{label}</CustomText>;
}

export const useLabelStyle = (label, labelStyle) => {
  if(!label){
    return null;
  }
  const reusableStyles = ReusableStyles
  if(!labelStyle){
    labelStyle = reusableStyles.labelStyle;
    let strLabel = label;
    label = (props) => InputLabel({ label: strLabel, labelStyle, ...props })
  }
  return label;
}
