import { getRandomBytes } from 'expo-random';
import { randomBytes, box, setPRNG } from 'tweetnacl';
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8';
import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64';
import { PVT_KEY } from '../screens/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


export const PRNG = (x, n) => {
    const randBytes = getRandomBytes(n);
    let i = 0;
    while(i < n) {
      x[i] = randBytes[i];
      i++;
    }
};

setPRNG(PRNG);

const newNonce = () => getRandomBytes(box.nonceLength);
export const generateKeyPair = () => box.keyPair();

export const encrypt = (secretOrSharedKey, json, key) => {
  const nonce = newNonce();
  const messageUint8 = encodeUTF8(JSON.stringify(json));
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (secretOrSharedKey, messageWithNonce, key) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  );

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Message could not be decrypted');
  }

  const base64DecryptedMessage = decodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

// above code is referenced from https://github.com/dchest/tweetnacl-js/wiki/Examples


export const strToUint8Array = (string) => Uint8Array.from(string.split(',').map((str) => parseInt(str)));

export const mySecretKey = async () => {
  const stringKey = await AsyncStorage.getItem(PVT_KEY);
  if(!stringKey) {
    Alert.alert("Set your key pair before sending messages", "Go to setting to set key pair", [{
      text: "Settings",
      onPress: () => nav.navigate("Settings")
    }]);
    return;
  }
  return strToUint8Array(stringKey);
}