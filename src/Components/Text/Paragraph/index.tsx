import React, { ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import * as S from './styles';

interface IParagraphProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

function Paragraph({ children, style }: IParagraphProps) {
  return (
    <S.Text style={style}>
      {children}
    </S.Text>
  )
}

export default Paragraph;
