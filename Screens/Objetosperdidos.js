import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../src/config/fb'; 

const courts = [
  { id: '1', name: 'Cancha 1' },
  { id: '2', name: 'Cancha 2' },
  { id: '3', name: 'Cancha 3' },
];

const timeSlots = [
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00',
  '23:00 - 00:00',
];

export default function LostItemsScreen({ onBack }) {
  const [selectedCourt, setSelectedCourt] = useState(courts[0].id);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
  const [showModal, setShowModal] = useState(false);
  const [dateInput, setDateInput] = useState(date.toLocaleDateString());
  const [loading, setLoading] = useState(false);
  const [itemImage, setItemImage] = useState(null);
  const [itemRequested, setItemRequested] = useState(false);

  const handleDateConfirm = (date) => {
    setDate(date);
    setDateInput(date.toLocaleDateString());
    setDatePickerVisibility(false);
  };

  // Función para generar el nombre del archivo
  const generateImageName = () => {
    const courtName = courts.find(court => court.id === selectedCourt).name.replace(/\s+/g, '').toLowerCase();
    const formattedDate = date.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
    const formattedTime = selectedTimeSlot.split(' - ')[0].replace(/:/g, ''); // Hora en formato HHMM
    return `${courtName}_${formattedDate}_${formattedTime}.jpg`; // Nombre del archivo
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const lostItemsRef = collection(database, 'lost_items'); // Asegúrate de que esta sea la colección correcta
      const fileName = generateImageName(); // Genera el nombre del archivo

      const q = query(
        lostItemsRef,
        where('fileName', '==', fileName) // Busca el archivo en Firestore
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const itemData = querySnapshot.docs[0].data();
        const storageRef = ref(storage, fileName); // Referencia al archivo en Storage
        
        // Obtener la URL de descarga
        const url = await getDownloadURL(storageRef);
        setItemImage(url); // Asigna la URL de la imagen
        setShowModal(true);
      } else {
        Alert.alert('No se encontró ningún objeto perdido.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo buscar el objeto perdido.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleRequestItem = () => {
    setItemRequested(true);
    Alert.alert('Éxito', 'Objeto solicitado con éxito.');
  };

  return( 
    <View style={styles.container}>
      <Text style={styles.title}>Objetos Perdidos</Text>

      <Text style={styles.label}>Selecciona la cancha:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCourt}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCourt(itemValue)}
        >
          {courts.map(court => (
            <Picker.Item key={court.id} label={court.name} value={court.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Selecciona la fecha:</Text>
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>{dateInput}</Text>
        <Icon name="calendar" size={24} color="#000" style={styles.calendarIcon} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <Text style={styles.label}>Selecciona el horario:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTimeSlot}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
        >
          {timeSlots.map((slot, index) => (
            <Picker.Item key={index} label={slot} value={slot} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.searchButtonText}>Buscar Objeto Perdido</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {itemImage ? (
              <>
                <Text>Aquí está la imagen del objeto perdido:</Text>
                <Image
                  source={{ uri: itemImage }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={[styles.requestButton, itemRequested && styles.buttonDisabled]}
                  onPress={itemRequested ? null : handleRequestItem}
                  disabled={itemRequested}
                >
                  <Text style={styles.requestButtonText}>
                    {itemRequested ? 'Solicitado' : 'Solicitar Objeto'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>No se encontró ningún objeto perdido.</Text>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#404aa3',
      width: '100%',
      justifyContent: 'flex-start',
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
    },
    title: {
      fontSize: 27,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'white',
      marginTop: 30,
      marginBottom: 15,
    },
    label: {
      fontSize: 18,
      marginVertical: 10,
      color: 'white',
    },
    picker: {
      height: 50,
      width: '100%',
 
    },
    pickerContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
        backgroundColor: '#fff',
      },
    datePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#ccc',
      marginVertical: 10,
      backgroundColor: 'white',
      width: '100%',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dateText: {
      flex: 1,
      height: 50,
      paddingHorizontal: 10,
      color: '#000',
      fontSize: 16,
      top: 15,
    },
    calendarIcon: {
      padding: 10,
    },
    searchButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#737BDF',
      borderRadius: 10,
      alignItems: 'center',
    },
    searchButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      marginBottom: 15,
    },
    requestButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#4caf50',
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
    },
    requestButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonDisabled: {
      backgroundColor: '#9e9e9e',
    },
    modalButton: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#f44336',
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });