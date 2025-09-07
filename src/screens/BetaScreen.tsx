import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function BetaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Beta Screen</Text>
        <Text style={styles.subtitle}>
          This is a preview of our upcoming features. 
          Thank you for helping us test!
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Early access to new functionality</Text>
          <Text style={styles.feature}>• Experimental features</Text>
          <Text style={styles.feature}>• Provide valuable feedback</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featureList: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feature: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
});