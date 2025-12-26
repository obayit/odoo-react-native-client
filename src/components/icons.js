// maybe put all app icons here?
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
// import Svg, { Text as SvgText } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './colors';

export const StatusCircleIcon = (props) => (
  <MaterialCommunityIcons name='circle' color={props.fill} size={props.height} style={props.style}/>
);

const textSvgProps = {
  fill: "#D9D9D9",
  fontSize: "16",
  fontWeight: 'bold',
  textAnchor: "middle",
}

// export const SvgTextIcon = (props) => (
//   // designed for a 3 character word (e.g: USD)
//   <Svg height="24" width="80">
//     <SvgText {...textSvgProps} x="35" y="18">
//       {props.name}
//     </SvgText>
//   </Svg>
// );

export function InfoIcon () {
  return <MaterialIcons name='info-outline' size={40} color={colors.color_primary_600}/>
}

export function SuccessIcon () {
  return <MaterialIcons name='check-circle-outline' size={40} color={colors.color_success_600}/>
}

export function ErrorIcon () {
  return <MaterialIcons name='error-outline' size={40} color={colors.color_danger_600}/>
}

export function DangerIcon () {
  return <MaterialIcons name='warning-amber' size={40} color={colors.color_danger_400}/>
}
