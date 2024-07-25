// layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChatButton from './app/components/ChatButton';

const Layout = ({ children, showChatButton }) => {
    const navigation = useNavigation();

    const handleChatPress = () => {
        navigation.navigate('Chat');
    };

    return (
        <View style={styles.container}>
            {children}
            {showChatButton && <ChatButton onPress={handleChatPress} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Layout;