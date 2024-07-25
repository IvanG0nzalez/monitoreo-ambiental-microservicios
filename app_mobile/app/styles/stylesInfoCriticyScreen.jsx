import { StyleSheet } from 'react-native';

export const stylesInfoCriticyScreen = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    contentContainer: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: '#000000',
    },
    levelOuterContainer: {
      marginBottom: 20,
      borderRadius: 10,
      overflow: 'hidden',
      borderColor: '#FFFFFF',
      borderWidth: 1,
    },
    levelContainer: {
      padding: 10,
      alignItems: 'center',
    },
    levelText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    infoContainer: {
      padding: 15,
    },
    infoText: {
      fontSize: 14,
      lineHeight: 20,
    },
    moreInfoContainer: {
      padding: 15,
      backgroundColor: '#2196F3',
      borderRadius: 10,
      borderColor: '#FFFFFF',
      borderWidth: 1,
    },
    moreInfoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 10,
    },
    moreInfoText: {
      fontSize: 14,
      color: '#FFFFFF',
      marginBottom: 15,
    },
    linkText: {
      fontSize: 14,
      color: '#FFFFFF',
      textDecorationLine: 'underline',
    },
  });