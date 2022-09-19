import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';

const CustomView = requireNativeComponent('ReactCustomView');

export interface IBridgeCustomView extends ViewProps {
  color?: string;
}

function BridgeCustomView({ ...rest }: IBridgeCustomView) {
  return (
    <CustomView {...rest} />
  );
}

export default BridgeCustomView;
