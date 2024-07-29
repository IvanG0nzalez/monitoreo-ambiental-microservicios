// screens/ChatScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chatbot from '../utils/chatbot';

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Chatbot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default ChatScreen;
