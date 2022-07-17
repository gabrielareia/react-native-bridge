import React, { ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import * as S from './styles';

interface ITitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

function Title({ children, style }: ITitleProps) {
  return (
    <S.Text style={style}>
      {children}
    </S.Text>
  )
}

export default Title;
