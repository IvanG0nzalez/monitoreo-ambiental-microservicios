import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OfflineScreen = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="wifi-off" size={100} color="red" />
            <Text style={styles.message}>No hay conexión a Internet</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    icon: {
        width: 100,
        height: 100,
    },
    message: {
        marginTop: 20,
        fontSize: 18,
        color: '#333',
    },
});

export default OfflineScreen;