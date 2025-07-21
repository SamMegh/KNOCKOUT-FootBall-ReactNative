import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export const setItem = async (value) => {
  try {
    const stringValue = JSON.stringify(value);
    if (isWeb) {
      localStorage.setItem("Token", stringValue);
    } else {
      await AsyncStorage.setItem("Token", stringValue);
    }
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

export const getItem = async () => {
  try {
    let value;
    if (isWeb) {
      value = localStorage.getItem("Token");
    } else {
      value = await AsyncStorage.getItem("Token");
    }
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};
