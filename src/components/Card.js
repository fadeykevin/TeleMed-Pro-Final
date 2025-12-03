import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 5 },
  subtitle: { fontSize: 13, color: '#666' }
});