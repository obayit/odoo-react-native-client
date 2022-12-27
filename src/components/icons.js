// maybe put all app icons here?
import React from 'react';
import { Icon } from '@ui-kitten/components';
import Svg, { Text as SvgText } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const StatusCircleIcon = (props) => (
  <MaterialCommunityIcons name='circle' color={props.fill} size={props.height} style={props.style}/>
);

const textSvgProps = {
  fill: "#D9D9D9",
  fontSize: "16",
  fontWeight: 'bold',
  textAnchor: "middle",
}

export const SvgTextIcon = (props) => (
  // designed for a 3 character word (e.g: USD)
  <Svg height="24" width="80">
    <SvgText {...textSvgProps} x="35" y="18">
      {props.name}
    </SvgText>
  </Svg>
);
