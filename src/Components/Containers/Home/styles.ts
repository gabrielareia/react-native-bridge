import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Paragraph from '../../Text/Paragraph';
import Title from '../../Text/Title';

export const Screen = styled.View`
  height: 100%;
  width: 100%;
`;

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

export const Close = styled(TouchableOpacity)`
  position: absolute;
  left: 8px;
  top: 8px;
  height: 35px;
  width: 35px;
  padding: 0;
  margin: 0;
  z-index: 100;
`;

export const CloseIcon = styled.Text`
  transform: rotate(45deg);
  height: 35px;
  width: 35px;
  padding: 0;
  margin: 0;
  font-size: 60px;
  line-height: 65px;
  font-family: MuseoModerno-ExtraLight;
  color: #f8f8f8;
  text-shadow: 0px 0px 2px #000;
  z-index: 200;
`;

export const EffectsRack = styled.ScrollView`
  background-color: #404040;
  height: 80px;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 6px;
`;

export const Loader = styled.View`
  height: 100%;
  width: 100%;
  z-index: 50;
  flex: 1;
  justify-content: center;
`;
