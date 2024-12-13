import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";
import { DataProvider } from '@/datacontext';


const RootLayout = () => {
  return (
    <DataProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerTintColor: '#ffffff',
            headerStyle: {
              backgroundColor: '#121212',
            },
            drawerStyle: {
              backgroundColor: '#121212',
            },
            drawerInactiveTintColor: '#fff',
          }}
        >
          <Drawer.Screen
            name='index'
            options={{
              drawerLabel: 'Home',
              title: 'Home',
              drawerIcon: ({ size, color }) => {
                return <AntDesign name="home" size={size} color={color} />
              },
            }}
          />

          <Drawer.Screen
            name='favs/index'
            options={{
              drawerLabel: 'Favorites',
              title: 'Favorites',
              drawerIcon: ({ size, color }) => {
                return <AntDesign name="staro" size={size} color={color} />
              },
            }}
          />

          <Drawer.Screen
            name='game/[id]'
            options={{
              drawerLabel: 'Game details',
              title: 'Game details',
              drawerIcon: ({ size, color }) => {
                return <AntDesign name="staro" size={size} color={color} />
              },
              drawerItemStyle: { display: 'none' },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </DataProvider>
  );
};

export default RootLayout;