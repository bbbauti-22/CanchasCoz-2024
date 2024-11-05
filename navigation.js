import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import MyTabs from "./Screens/TAB";
import MyTabsEmpl from "./Screens/TABEMP";
import Terminos from "./Screens/TerminosyUso";
import { Image, View } from 'react-native';


// Importa tus pantallas
import Login from "./Screens/login";
import Register from "./Screens/Registro";
import Disponibilidad from "./Screens/Disponibilidad";
import Pago from "./Screens/pagar";
import Reservass from "./Screens/Reservas";
import EquipoEstre from "./Screens/Equipo";
import Ubicaciones from './Screens/ubicacion';
import Inicio from "./Screens/inicio";


const HomeStackNavigator = createNativeStackNavigator();


export function MyStack() {
    return (
        <HomeStackNavigator.Navigator>
            <HomeStackNavigator.Screen
                name="Disponibilidad"
                component={Disponibilidad}
                options={{ headerShown: false }} />

            <HomeStackNavigator.Screen name="Pagar" component={Pago} options={{
                headerTintColor: 'white', headerTitle: '',
                backgroundColor: '#1A224C',
                headerStyle: { backgroundColor: '#1A224C' },
            }} />

        </HomeStackNavigator.Navigator>
    );
}





export default function Navigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        console.log("Estado de autenticación:", isLoggedIn);
    }, [isLoggedIn]); // Se ejecuta cuando isLoggedIn cambia

    return (
        <NavigationContainer>
            <HomeStackNavigator.Navigator>
                {/* Pantallas para usuarios autenticados */}
                {isLoggedIn ? (
                    <>
                        {userRole === 'Empleado' ? (
                            <HomeStackNavigator.Screen
                                name="MainEmpl"
                                component={MyTabsEmpl}
                                options={{ headerShown: false }}
                            />
                        ) : (
                            <HomeStackNavigator.Screen
                                name="Main"
                                component={MyTabs}
                                options={{ headerShown: false }}
                            />
                        )}


                        <HomeStackNavigator.Screen
                            name="Ini"
                            options={{ headerShown: false }}
                        >
                            {props => (
                                <Inicio
                                    {...props}
                                    onLoginStatusChange={setIsLoggedIn} // Pasa la función como prop
                                />
                            )}
                        </HomeStackNavigator.Screen>

                        <HomeStackNavigator.Screen
                            name="Reservas"
                            component={Reservass}
                            options={{
                                headerTitle: '',
                                headerTintColor: 'white',
                                headerStyle: { backgroundColor: '#1A224C' },
                            }}
                        />

                        <HomeStackNavigator.Screen
                            name="Ubicacion"
                            component={Ubicaciones}
                            options={{
                                headerTitle: '',
                                headerTintColor: 'white',
                                headerStyle: { backgroundColor: '#1A224C' },
                            }}
                        />

                        <HomeStackNavigator.Screen
                            name="Equipo"
                            component={EquipoEstre}
                            options={{
                                headerTitle: () => (
                                    <View style={{ alignItems: 'center', marginLeft: '30%', marginTop: '4%' }}>
                                        <Image
                                            source={require('./imagen/logo-header.png')}
                                            style={{ width: 100, height: 40 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ),
                                headerTintColor: 'white',
                                headerStyle: { backgroundColor: '#1A224C' },
                            }}
                        />

                        <HomeStackNavigator.Screen
                            name="TerminosyUso"
                            component={Terminos}
                            options={{
                                headerTitle: '',
                                headerTintColor: 'white',
                                headerStyle: { backgroundColor: '#1A224C' },
                            }}
                        />
                    </>
                ) : (
                    // Navegación para usuarios no autenticados (Login / Register)
                    <>
                        <HomeStackNavigator.Screen
                            name="login"
                            options={{ headerShown: false }}
                        >
                            {props => (
                                <Login
                                    {...props}
                                    isLoggedIn={setIsLoggedIn}
                                    setUserRole={setUserRole}
                                />
                            )}
                        </HomeStackNavigator.Screen>

                        <HomeStackNavigator.Screen
                            name="Register"
                            options={{ headerShown: false }}
                        >
                            {props => (
                                <Register
                                    {...props}
                                    isRegistering={setIsRegistering}
                                    isLoggedIn={setIsLoggedIn}
                                />
                            )}
                        </HomeStackNavigator.Screen>
                    </>
                )}





            </HomeStackNavigator.Navigator>
        </NavigationContainer>
    );
}