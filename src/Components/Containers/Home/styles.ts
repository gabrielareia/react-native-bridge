import { Animated } from 'react-native';
import styled, { css } from 'styled-components/native';
import Paragraph from '../../Text/Paragraph';
import Title from '../../Text/Title';

export const Wrapper = styled.View`
  background-color: white;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Welcome = styled(Title)`
  color: black;
`;

export const Start = styled(Paragraph)`
  color: black;
`;
