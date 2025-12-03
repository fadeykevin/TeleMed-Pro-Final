import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationBadge({ count, style }) {
  if (!count || count === 0) return null;
  
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 4
  }
});