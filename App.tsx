/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Toast, ToastRef} from './Toast';

function App(): React.JSX.Element {
  const toastRef = useRef<ToastRef>();

  const onShowToast = () => {
    toastRef.current?.onShowToast();
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.container}>
        <Toast toastRef={toastRef} />
        <TouchableWithoutFeedback onPress={onShowToast}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Show Toast</Text>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEC520',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {fontSize: 16, fontWeight: '600', color: 'black'},
});

export default App;
