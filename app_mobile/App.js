import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SensorScreen } from './app/pages/SensorScreen';
import SplashScreen from './app/pages/SplashScreen';
import ChatScreen from './app/pages/ChatScreen';
import { ScreenWithLayout } from './app/components/ScreenWithLayout';
import { InfoCriticyScreen } from './app/pages/InfoCriticyScreen';
import GraphicsScreen from './app/pages/GraphicsScreen';
import AboutProjectScreen from './app/pages/AboutProjectScreen';
import OfflineScreen from './app/pages/OfflineScreen';

const Drawer = createDrawerNavigator();

function MainNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Sensores">
      <Drawer.Screen
        name="Sensores"
        component={ScreenWithLayout({ component: SensorScreen, showChatButton: true })}
      />
      <Drawer.Screen
        name="Criticidad del Aire"
        component={ScreenWithLayout({ component: InfoCriticyScreen, showChatButton: true })}
      />
      <Drawer.Screen
        name="Gráficas del día"
        component={ScreenWithLayout({ component: GraphicsScreen, showChatButton: true })}
      />
      <Drawer.Screen
        name="Chat"
        component={ScreenWithLayout({ component: ChatScreen, showChatButton: false })}
      />
      <Drawer.Screen
        name="Sobre el Proyecto"
        component={ScreenWithLayout({ component: AboutProjectScreen, showChatButton: false })}
      />
    </Drawer.Navigator >
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
