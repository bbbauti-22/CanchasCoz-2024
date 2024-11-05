import { View,Image } from 'react-native';
import Inicio from './inicio'
import { MyStack } from "../navigation";
import Objetos from './Objetosperdidos'
import Cuentacliente from "./Cuenta";


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Ini" screenOptions={{
            tabBarActiveTintColor: '#737BFD',
            tabBarStyle: { backgroundColor: '#1A224C' },
        }}>
            <Tab.Screen name="Ini" component={Inicio}
                options={{
                    tabBarLabel: () => null,
                    headerTitle: () => ( 
                        <View style={{  alignItems: 'center', marginLeft: '42%', marginTop: '4%' }}>
                            <Image
                                source={require('../imagen/logo-header.png')}
                                style={{ width: 100, height: 40 }}
                                resizeMode="contain"
                            />
                        </View>
                    ),
                    headerStyle: { backgroundColor: '#1A224C'},
                    
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
            <Tab.Screen name="Objetosperdidos" component={Objetos}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="question-circle" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen name="Dispo" component={MyStack}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="calendar-o" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen name="cuenta" component={Cuentacliente}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}
