import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl, 
  Alert, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView 
} from 'react-native';
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
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const t = await getToken();
      const u = await getUser();
      if (!t) return;
      
      setToken(t);
      setUser(u);
      
      const [fs, a] = await Promise.all([
        apiFetch('/features', t),
        apiFetch('/announcement', t),
      ]);
      
      setFeatures(fs);
      setAnnouncement(a);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    load(); 
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const betaEnabled = features.find(f => f.key === 'betaScreen' && f.enabled);
  const adminButtonEnabled = features.find(f => f.key === 'adminButton' && f.enabled);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#3b82f6']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userInfo}>
              {user?.email} • <Text style={styles[user?.role]}>{user?.role}</Text>
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={async () => { 
              await clearAuth(); 
              navigation.replace('Login'); 
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Announcement */}
        {announcement?.active && (
          <View style={styles.announcementCard}>
            <Text style={styles.cardTitle}>📢 Announcement</Text>
            <Text style={styles.announcementText}>{announcement.message}</Text>
            <Text style={styles.updateTime}>
              Updated: {new Date(announcement.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features Status</Text>
          {features.map(f => (
            <View key={f.id} style={styles.featureItem}>
              <View style={styles.featureInfo}>
                <Text style={styles.featureName}>{f.name}</Text>
                <Text style={styles.featureDescription}>{f.description || f.key}</Text>
              </View>
              <View style={[styles.statusIndicator, f.enabled ? styles.statusOn : styles.statusOff]}>
                <Text style={styles.statusText}>{f.enabled ? 'ON' : 'OFF'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {betaEnabled && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Beta')}
            >
              <Text style={styles.buttonText}>Open Beta Screen</Text>
            </TouchableOpacity>
          )}

          {user?.role === 'admin' && adminButtonEnabled && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => Alert.alert('Admin', 'You pressed an admin-only button.')}
            >
              <Text style={styles.secondaryButtonText}>Admin-only Action</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  userInfo: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  admin: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  manager: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  user: {
    color: '#64748b',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  announcementCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  announcementText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
    marginBottom: 8,
  },
  updateTime: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  statusOn: {
    backgroundColor: '#dcfce7',
  },
  statusOff: {
    backgroundColor: '#fef2f2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 16,
  },
});