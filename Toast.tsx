import React, {useCallback, useImperativeHandle, useState} from 'react';

import {Pressable, StyleSheet, Text} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface ToastRef {
  onShowToast: () => void;
}

interface ToastProps {
  toastRef: React.MutableRefObject<ToastRef | undefined>;
}

export const Toast: React.FC<ToastProps> = ({toastRef}) => {
  const [showToast, setShowToast] = useState(true);
  const context = useSharedValue(0);

  const toastTopAnimation = useSharedValue(-100);
  const TOP_VALUE = 60;

  const onShowToast = useCallback(() => {
    setShowToast(true);
    toastTopAnimation.value = withSequence(
      withTiming(TOP_VALUE),
      withDelay(
        2000,
        withTiming(-100, undefined, finish => {
          if (finish) {
            runOnJS(setShowToast)(false);
          }
        }),
      ),
    );
  }, [toastTopAnimation]);

  const onHideToast = useCallback(() => {
    toastTopAnimation.value = withSequence(
      withTiming(-TOP_VALUE),
      withDelay(
        2000,
        withTiming(-100, undefined, finish => {
          if (finish) {
            runOnJS(setShowToast)(false);
          }
        }),
      ),
    );
  }, [toastTopAnimation]);

  useImperativeHandle(
    toastRef,
    () => ({
      onShowToast,
    }),
    [onShowToast],
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: toastTopAnimation.value,
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      context.value = toastTopAnimation.value;
    })
    .onUpdate(event => {
      if (event.translationY < 200) {
        toastTopAnimation.value = withSpring(
          (context.value = event.translationY),
          {
            damping: 600,
            stiffness: 100,
          },
        );
      }
    })
    .onEnd(event => {
      if (event.translationY < 0) {
        toastTopAnimation.value = withTiming(-100, undefined, finish => {
          if (finish) {
            runOnJS(setShowToast)(false);
          }
        });
      } else if (event.translationY > 0) {
        toastTopAnimation.value = withSequence(
          withTiming(TOP_VALUE),
          withDelay(
            2000,
            withTiming(-100, undefined, finish => {
              if (finish) {
                runOnJS(setShowToast)(false);
              }
            }),
          ),
        );
      }
    });

  return (
    <React.Fragment>
      {showToast && (
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.container,
              styles.successToastContainer,
              animatedStyles,
            ]}>
            <Text>Toast text</Text>
            <Pressable onPressIn={onHideToast} style={styles.closeIcon}>
              <Text>X</Text>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      )}
    </React.Fragment>
  );
};

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'red',
    width: '90%',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#028A49',
  },
  successToastContainer: {
    backgroundColor: '#def1d7',
    borderColor: '#1f8722',
  },
  warningToastContainer: {
    backgroundColor: '#fef7ec',
    borderColor: '#f08135',
  },
  errorToastContainer: {
    backgroundColor: '#fae1db',
    borderColor: '#d9100a',
  },
  successToastText: {
    color: '#1f8722',
  },
  warningToastText: {
    color: '#f08135',
  },
  errorToastText: {
    color: '#d9100a',
  },
  closeIcon: {
    backgroundColor: '#7A7A7A7A',
    borderRadius: 22 / 2,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
