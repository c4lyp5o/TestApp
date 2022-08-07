import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ToastAndroid,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleToast, setVisibleToast] = useState(false);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
    setVisibleToast(true);
    setTimeout(() => {
      setVisibleToast(false);
    }, 2000);
  };

  let openShareDialogAsync = async () => {
    if (Platform.OS === 'web') {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  };

  function ADRYButton({ theAction, theText }) {
    return (
      <TouchableOpacity onPress={theAction} style={styles.button}>
        <Text style={styles.buttonText}>{theText}</Text>
      </TouchableOpacity>
    );
  }

  const Toast = ({ visible, message }) => {
    if (visible) {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return null;
    }
    return null;
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Toast visible={visibleToast} message='Here is your image' />
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <ADRYButton
          theAction={openShareDialogAsync}
          theText='Share this photo'
        />
        <ADRYButton
          theAction={() => {
            setSelectedImage(null);
          }}
          theText='Select another photo'
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.imgur.com/TkIrScD.png' }}
        style={styles.logo}
      />
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button
        below!
      </Text>
      <ADRYButton theAction={openImagePickerAsync} theText='Pick a photo' />
      <Text style={styles.instructions}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  thumbnail: {
    width: 900,
    height: 500,
    resizeMode: 'center',
  },
});
