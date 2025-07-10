import * as SecureStore from 'expo-secure-store';

export const savetoken = async (token) => {
  await SecureStore.setItemAsync('token', token);
};

export const gettoken = async () => {
  return await SecureStore.getItemAsync('token');
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync('token');
};
