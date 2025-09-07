import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, ScrollView, RefreshControl, Alert } from 'react-native';
import { apiFetch } from '../api';
import { getToken, getUser, clearAuth } from '../storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Feature = { id: string; key: string; name: string; description?: string; enabled: boolean };
type Announcement = { message: string; active: boolean; updatedAt: string };

export default function Home({ navigation }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const t = await getToken(); const u = await getUser();
      if (!t) return;
      setToken(t); setUser(u);
      const [fs, a] = await Promise.all([
        apiFetch('/features', t),
        apiFetch('/announcement', t),
      ]);
      setFeatures(fs); setAnnouncement(a);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const betaEnabled = features.find(f => f.key === 'betaScreen' && f.enabled);
  const adminButtonEnabled = features.find(f => f.key === 'adminButton' && f.enabled);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Hi {user?.email} ({user?.role})</Text>
        <Button title="Logout" onPress={async ()=>{ await clearAuth(); navigation.replace('Login'); }} />
      </View>

      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Announcement</Text>
        <Text>{announcement?.active ? announcement?.message : 'No active announcement'}</Text>
      </View>

      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Features</Text>
        {features.map(f => (
          <Text key={f.id}>• {f.name}: {f.enabled ? 'ON' : 'OFF'}</Text>
        ))}
      </View>

      {betaEnabled && (
        <Button title="Open Beta Screen" onPress={()=>navigation.navigate('Beta')} />
      )}

      {user?.role === 'admin' && adminButtonEnabled && (
        <Button title="Admin-only action" onPress={()=>Alert.alert('Admin', 'You pressed an admin-only button.')} />
      )}
    </ScrollView>
  );
}
