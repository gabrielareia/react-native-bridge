import React, { useEffect, useState } from 'react';
import {
  Image,
  NativeModules,
  StyleProp,
  TextStyle,
  TouchableHighlight,
} from 'react-native';
import { IFilter } from '../../types/filter';
import { filterPLaceholder } from './constants';
import * as S from './styles';

interface IFilterPreviewProps {
  style?: StyleProp<TextStyle>;
  applyFilter: (filter: IFilter[]) => void;
  filter: IFilter[];
}

const { ReactCustomView } = NativeModules;

function FilterPreview({ style, applyFilter, filter }: IFilterPreviewProps) {
  const [filterImage, setFilterImage] = useState<string>();

  const updateImage = (data: string) => {
    setFilterImage(data);
  };

  const handleImageError = async (message: string) => {
    console.log(`ERROR IN FILTER: ${filter}, ${message}`);
  };

  useEffect(() => {
    ReactCustomView.loadFilter(
      filterPLaceholder.split(',')[1],
      JSON.stringify(filter),
      updateImage,
      handleImageError,
    );
  }, [filter]);

  return (
    <TouchableHighlight onPress={() => applyFilter(filter)} underlayColor='#ffffff00'>
      <S.Filter style={style}>
        <Image
          progressiveRenderingEnabled
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 100,
          }}
          resizeMode='contain'
          source={{ uri: filterImage }}
        />
      </S.Filter>
    </TouchableHighlight>
  );
}

export default FilterPreview;
