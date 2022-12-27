import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const username_key = 'username';
const password_key = 'password';

async function save(key, value) {
  if(Platform.OS === 'web'){
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  return await SecureStore.getItemAsync(key);
}

export async function saveUsername(value) {
  await save(username_key, value);
}
export async function savePassword(value) {
  await save(password_key, value);
}

export async function getUsername() {
    return await getValueFor(username_key);
}

export async function getPassword() {
    return await getValueFor(password_key);
}
