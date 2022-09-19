import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  NativeModules,
} from 'react-native';
import { Animated } from 'react-native';
import { colorsFilter } from '../../../filters/colors';
import { sepiaFilter } from '../../../filters/sepia';
import { squareBorderFilter } from '../../../filters/squareBorder';
import { IFilter } from '../../../types/filter';
import * as S from './styles';

enum TextStatus {
  WELCOME_ANIMATION = 'welcome',
  START_ANIMATION = 'start',
  READY = 'ready',
}

function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [textStatus, setTextStatus] = useState(TextStatus.WELCOME_ANIMATION);
  const [imageProps, setImageProps] = useState({
    position: {
      x: 0,
      y: 0,
    },
    scale: 1,
    width: 0,
    height: 0,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageUri, setImageUri] = useState<string>();
  const [imageData, setImageData] = useState<string>();
  const [originalImageData, setOriginalImageData] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [initialScaleTouch, setInitialScaleTouch] = useState<
    number | undefined
  >(undefined);
  const [loadingFilter, setLoadingFilter] = useState({
    loading: false,
    filter: '',
  });

  const { ReactCustomView } = NativeModules;

  const handleError = (msg: string) => {
    console.log('IMAGE ERROR:', msg);
    setImageUri(undefined);
    fadeInStart();
    setLoading(false);
  };

  function fadeInWelcome() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 1000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        fadeOutWelcome();
      }
    });
  }

  function fadeOutWelcome() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      delay: 2000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setTextStatus(TextStatus.START_ANIMATION);
        fadeInStart();
      }
    });
  }

  function fadeInStart() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setTextStatus(TextStatus.READY);
      }
    });
  }

  function fadeOutStart() {
    if (textStatus !== TextStatus.READY || imageUri) {
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setLoading(true);
        ReactCustomView.pickImage(
          async (uri: string) => {
            setImageUri(uri);
          },
          async (message: string) => {
            handleError(message);
          },
        );
      }
    });
  }

  const discardImage = () => {
    setImageData(undefined);
    setOriginalImageData(undefined);
    setImageUri(undefined);
    setImageProps((old) => ({
      ...old,
      position: {
        x: 0,
        y: 0,
      },
      scale: 1,
      width: 0,
      height: 0,
    }));
    fadeInStart();
  };

  const setLoadedImage = async (data: string, width: number, height: number) => {
    console.log(width, height)
    setImageData(data);
    setOriginalImageData(data);
    setLoading(false);
  };

  const handleImageError = async (message: string) => {
    handleError(message);
    setLoading(false);
    setLoadingFilter({ loading: false, filter: '' });
  };

  useEffect(() => {
    fadeInWelcome();
  }, []);

  useEffect(() => {
    if (imageUri) {
      ReactCustomView.loadImage(imageUri, setLoadedImage, handleImageError);
    }
  }, [imageUri]);

  const onMoveResponder = (event: GestureResponderEvent) => {
    const { changedTouches, pageX, pageY } = event.nativeEvent;

    if (initialScaleTouch && changedTouches.length === 2) {
      const newX = changedTouches[0].pageX - changedTouches[1].pageX;
      const newY = changedTouches[0].pageY - changedTouches[1].pageY;

      const dist = newX * newX + newY * newY;

      const scale = dist / initialScaleTouch;

      setImageProps((old) => ({
        ...old,
        position: {
          x: pageX + newX / 2 - offset.x,
          y: pageY + newY / 2 - offset.y,
        },
        scale: scale || 0.0001,
      }));

      return true;
    }

    setImageProps((old) => ({
      ...old,
      position: {
        x: pageX - offset.x,
        y: pageY - offset.y,
      },
    }));

    return false;
  };

  const setResponder = (event: GestureResponderEvent) => {
    fadeOutStart();

    const { touches, pageX, pageY } = event.nativeEvent;

    if (touches.length === 2) {
      const newX = touches[0].pageX - touches[1].pageX;
      const newY = touches[0].pageY - touches[1].pageY;

      setOffset({
        x: pageX + newX / 2 - imageProps.position.x,
        y: pageY + newY / 2 - imageProps.position.y,
      });

      const dist = newX * newX + newY * newY;
      setInitialScaleTouch(dist / imageProps.scale || 0.0001);
      return true;
    }

    setOffset({
      x: pageX - imageProps.position.x,
      y: pageY - imageProps.position.y,
    });

    return false;
  };

  const releaseResponder = (event: GestureResponderEvent) => {
    const { touches } = event.nativeEvent;
    if (touches.length === 2) {
      setInitialScaleTouch(undefined);

      return true;
    }
    return false;
  };

  const updateImage = (data: string) => {
    setImageData(data);
    setLoadingFilter({ loading: false, filter: '' });
  };

  const applyEffect = (filter: IFilter[]) => {
    setLoadingFilter({ loading: true, filter: JSON.stringify(filter) });
  };

  useEffect(() => {
    if (loadingFilter.loading) {
      setTimeout(
        () =>
          ReactCustomView.loadFilter(
            originalImageData?.split(',')[1],
            loadingFilter.filter,
            updateImage,
            handleImageError,
          ),
        100,
      );
    }
  }, [loadingFilter]);

  return (
    <S.Screen>
      <S.Wrapper
        onStartShouldSetResponder={setResponder}
        onMoveShouldSetResponder={onMoveResponder}
        onResponderMove={onMoveResponder}
        onResponderRelease={releaseResponder}>
        {imageData && (
          <S.Close onPressIn={discardImage}>
            <S.CloseIcon>+</S.CloseIcon>
          </S.Close>
        )}
        {loading ? (
          <S.Start>Loading...</S.Start>
        ) : imageData ? (
          <>
            {loadingFilter.loading && (
              <S.Loader>
                <ActivityIndicator size='large' color='#fff' />
              </S.Loader>
            )}
            <Image
              progressiveRenderingEnabled
              
              style={{
                width: '100%',
                height: '100%',
                margin: 'auto',
                position: 'absolute',
                left: imageProps.position.x,
                top: imageProps.position.y,
                transform: [
                  {
                    scale: imageProps.scale,
                  },
                ],
              }}
              resizeMode='contain'
              source={{ uri: imageData }}
            />
          </>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {textStatus === TextStatus.WELCOME_ANIMATION && (
              <S.Welcome>Welcome</S.Welcome>
            )}
            {(textStatus === TextStatus.START_ANIMATION ||
              textStatus === TextStatus.READY) && (
              <S.Start>{'Tap on the screen\nto select an image'}</S.Start>
            )}
          </Animated.View>
        )}
      </S.Wrapper>
      {imageData && (
        <S.EffectsRack>
          <S.Effect onTouchStart={() => applyEffect(sepiaFilter)} />
          <S.Effect onTouchStart={() => applyEffect(squareBorderFilter)} />
          <S.Effect onTouchStart={() => applyEffect(colorsFilter)} />
        </S.EffectsRack>
      )}
    </S.Screen>
  );
}

export default Home;
