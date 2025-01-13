import React, {useMemo} from 'react';
import {View, ViewStyle} from 'react-native';

interface SpacerProps {
  style?: ViewStyle;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
}

const Spacer: React.FC<SpacerProps> = props => {
  const {width, height, backgroundColor} = props;
  const style: ViewStyle = useMemo(() => {
    return {
      width: width,
      height: height,
      backgroundColor: backgroundColor,
    };
  }, [width, height, backgroundColor]);
  return <View style={props.style ?? style} />;
};

export default Spacer;
