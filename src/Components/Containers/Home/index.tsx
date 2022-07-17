import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import * as S from './styles';

enum TextStatus {
  WELCOME_ANIMATION = 'welcome',
  START_ANIMATION = 'start',
  READY = 'ready',
}

function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [textStatus, setTextStatus] = useState(TextStatus.WELCOME_ANIMATION);

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
      delay: 1000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setTextStatus(TextStatus.READY);
      }
    });
  }

  function fadeOutStart() {
    if (textStatus !== TextStatus.READY) {
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    fadeInWelcome();
  }, []);

  return (
    <TouchableOpacity activeOpacity={1} onPressIn={fadeOutStart}>
      <S.Wrapper>
        <Animated.View style={{ opacity: fadeAnim }}>
          {textStatus === TextStatus.WELCOME_ANIMATION ? (
            <S.Welcome>Welcome</S.Welcome>
          ) : (
            <S.Start>Tap on the screen to start</S.Start>
          )}
        </Animated.View>
      </S.Wrapper >
    </TouchableOpacity>
  );
}

export default Home;
