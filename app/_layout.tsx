import React from 'react';
import { Stack } from "expo-router";
import { Slot } from "expo-router";
import AIChat from '../components/AIChat';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <AIChat />
    </View>
  );
}
