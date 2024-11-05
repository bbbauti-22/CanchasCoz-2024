import { View,Image } from 'react-native';
import PagoFinal from './PagoFinal';
import CuentaEmpl from './CuentaEmp';
import Cargaobjetos from './cargaObj';
import Inicioempl from './InicioEmpl';


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Importar MaterialIcons
const Tab = createBottomTabNavigator();

export default function MyTabsEmpl() {
    return (
        <Tab.Navigator initialRouteName="Ini" screenOptions={{
            tabBarActiveTintColor: '#737BFD',
            tabBarStyle: { backgroundColor: '#1A224C' },
        }}>
            <Tab.Screen name="Inicio" component={Inicioempl}
                options={{
                    tabBarLabel: () => null,
                    headerTitle: () => null,
                    headerStyle: { backgroundColor: '#1A224C' },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />


            <Tab.Screen name="PagoFinal" component={PagoFinal}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="attach-money" size={size} color={color} /> // Usar el icono de dinero
                
                    ),
                    headerShown: false,
                }}
            />


            <Tab.Screen name="CuentaEmpl" component={CuentaEmpl}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />



            <Tab.Screen name="ObjetosPE" component={Cargaobjetos}
                options={{
                    tabBarLabel: () => null,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="question-circle" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}
