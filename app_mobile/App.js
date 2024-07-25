import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { SensorScreen } from './app/pages/SensorScreen';
import SplashScreen from './app/pages/SplashScreen';
import ChatScreen from './app/pages/ChatScreen';
import { ScreenWithLayout } from './app/components/ScreenWithLayout';
import { InfoCriticyScreen } from './app/pages/InfoCriticyScreen';
import GraphicsScreen from './app/pages/GraphicsScreen';
import AboutProjectScreen from './app/pages/AboutProjectScreen';
import OfflineScreen from './app/pages/OfflineScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Monitoreo del Aula Magna</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          label="Sobre el Proyecto"
          icon={({ color, size }) => <Icon name="info" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Sobre el Proyecto')}
        />
      </View>
    </View>
  );
}

function MainNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: styles.drawer,
        drawerLabelStyle: styles.drawerLabel,
        drawerActiveBackgroundColor: '#e6f2ff',
        drawerActiveTintColor: '#1a73e8',
      }}
    >
      <Drawer.Screen
        name="Sensores"
        component={ScreenWithLayout({ component: SensorScreen, showChatButton: true })}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="sensors" color={color} size={size} />
        }}
      />
      <Drawer.Screen
        name="Criticidad del Aire"
        component={ScreenWithLayout({ component: InfoCriticyScreen, showChatButton: true })}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="air" color={color} size={size} />
        }}
      />
      <Drawer.Screen
        name="Gráficas del día"
        component={ScreenWithLayout({ component: GraphicsScreen, showChatButton: true })}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="bar-chart" color={color} size={size} />
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ScreenWithLayout({ component: ChatScreen, showChatButton: false })}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />
        }}
      />
      <Drawer.Screen
        name="Sobre el Proyecto"
        component={ScreenWithLayout({ component: AboutProjectScreen, showChatButton: false })}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer.Navigator>
  );
}


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isConnected) {
    return <OfflineScreen />;
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#fff',
    width: 280,
  },
  drawerLabel: {
    marginLeft: -16,
  },
  titleContainer: {
    backgroundColor: '#4285f4',
    padding: 24,
    marginBottom: 16,
    height: 300,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});