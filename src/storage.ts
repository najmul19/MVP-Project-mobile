import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setToken(token: string) {
  await AsyncStorage.setItem('token', token);
}
export async function getToken() {
  return AsyncStorage.getItem('token');
}
export async function setUser(u: any) {
  await AsyncStorage.setItem('user', JSON.stringify(u));
}
export async function getUser() {
  const s = await AsyncStorage.getItem('user');
  return s ? JSON.parse(s) : null;
}
export async function clearAuth() {
  await AsyncStorage.multiRemove(['token', 'user']);
}
