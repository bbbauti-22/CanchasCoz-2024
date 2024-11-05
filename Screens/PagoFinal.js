import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { database } from '../src/config/fb';

const PagoFinal = () => {
  const [reservas, setReservas] = useState([]); // Guardará las reservas cargadas

  // Función para cargar reservas desde Firestore
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const snapshot = await getDocs(collection(database, 'Reservas'));
        const reservasData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id, // Añadir el ID de la reserva para referencia
        }));
        setReservas(reservasData);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };
    fetchReservas();
  }, []);

  // Simulación de finalización de pago
  const handleFinalizarPago = async (reserva) => {
    Alert.alert(
      'Pago Finalizado',
      `Reserva de ${reserva.username} para ${reserva.fecha} en ${reserva.canchaUno || reserva.canchaDos || reserva.canchaTres} ha sido procesada.`,
      [
        {
          text: 'OK',
          onPress: async () => {
            // Eliminar la reserva de Firestore
            try {
              await deleteDoc(doc(database, 'Reservas', reserva.id));
              // Actualizar el estado local para eliminar la reserva finalizada
              setReservas(prevReservas => prevReservas.filter(item => item.id !== reserva.id));
            } catch (error) {
              console.error('Error al eliminar la reserva:', error);
            }
          },
        },
      ]
    );
  };

  // Función para obtener información de la cancha
  const getCanchaInfo = (item) => {
    if (item.canchaUno && item.canchaUno !== 'no-asignado') return { nombre: item.canchaUno, numero: 1 };
    if (item.canchaDos && item.canchaDos !== 'no-asignado') return { nombre: item.canchaDos, numero: 2 };
    if (item.canchaTres && item.canchaTres !== 'no-asignado') return { nombre: item.canchaTres, numero: 3 };
    return { nombre: 'No asignado', numero: null };
  };

  // Función para renderizar cada reserva en la lista
  const renderReserva = ({ item }) => {
    const canchaInfo = getCanchaInfo(item);

    return (
      <View style={styles.reservaItem}>
        <Text style={styles.reservaText}>Usuario: {item.username}</Text>
        <Text style={styles.reservaText}>Fecha: {item.fecha}</Text>
        <Text style={styles.reservaText}>Cancha {canchaInfo.numero}: {canchaInfo.nombre}</Text>
        <TouchableOpacity
          style={styles.finalizarButton}
          onPress={() => handleFinalizarPago(item)}
        >
          <Text style={styles.finalizarButtonText}>Finalizar Pago</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservas Pendientes</Text>
      <FlatList
        data={reservas}
        renderItem={renderReserva}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#404AA3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  reservaItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  reservaText: {
    fontSize: 16,
    marginBottom: 5,
  },
  finalizarButton: {
    marginTop: 10,
    backgroundColor: '#737bfd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  finalizarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PagoFinal;