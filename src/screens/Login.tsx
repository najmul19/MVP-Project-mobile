import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { apiFetch } from '../api';
import { setToken, setUser } from '../storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('User@123');

  async function submit() {
    try {
      const data = await apiFetch('/auth/login', undefined, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      await setToken(data.token);
      await setUser(data.user);
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    }
  }

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Login</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={{ borderWidth: 1, padding: 8 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Sign in" onPress={submit} />
    </View>
  );
}
