import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { database } from '../src/config/fb'; 
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { auth } from '../src/config/fb'; // Asegúrate de importar la autenticación

export default function Reservass() {
    const [reservas, setReservas] = useState([]);
    const userId = auth.currentUser.uid; // Obtener el ID del usuario autenticado

    useEffect(() => {
        const fetchReservas = async () => {
            const reservasCollection = collection(database, "Reservas");
            const q = query(reservasCollection, where("userId", "==", userId)); 
            const reservasSnapshot = await getDocs(q);
            const reservasList = reservasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReservas(reservasList);
        };

        fetchReservas();
    }, [userId]);

    const handleDelete = async (id) => {
        await deleteDoc(doc(database, "Reservas", id));
        setReservas(reservas.filter(reserva => reserva.id !== id));
    };

    const renderReserva = ({ item }) => {
        return (
            <View style={styles.reserva}>
                {/* Solo mostrar canchas con datos válidos */}
                {item.canchaUno && item.canchaUno !== "no-asignado" && (
                    <Text style={styles.reservaText}>Cancha Uno: {item.canchaUno}</Text>
                )}
                {item.canchaDos && item.canchaDos !== "no-asignado" && (
                    <Text style={styles.reservaText}>Cancha Dos: {item.canchaDos}</Text>
                )}
                {item.canchaTres && item.canchaTres !== "no-asignado" && (
                    <Text style={styles.reservaText}>Cancha Tres: {item.canchaTres}</Text>
                )}
                {item.fecha && (
                    <Text style={styles.reservaText}>Fecha: {item.fecha}</Text>
                )}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        Alert.alert(
                            
                            "Eliminar Reserva",
                            "¿Estás seguro de que deseas eliminar esta reserva?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                { text: "Eliminar", onPress: () => handleDelete(item.id) }
                            ]
                        );
                    }}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Reservas</Text>
            <FlatList
                data={reservas}
                keyExtractor={(item) => item.id}
                renderItem={renderReserva}
            />
            <StatusBar style="auto" />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#404AA3',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 20,
    },
    reserva: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, // Para Android
        
        
    },
    reservaText: {
        fontSize: 16,
        color: '#333',
       
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
        marginLeft: '33%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});