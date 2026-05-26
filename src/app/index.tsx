import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0A192F',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#64FFDA" />
    </View>
  );
}
