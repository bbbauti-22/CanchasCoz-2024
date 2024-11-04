import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Modal, Button, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { database, storage } from '../src/config/fb'; // Asegúrate de que esta ruta sea correcta
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const UploadMediaFile = ( ) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00 - 11:00');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Se requieren permisos para acceder a la galería');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const generateImageName = () => {
    const courtName = courts.find(court => court.id === selectedCourt).name.replace(/\s+/g, '').toLowerCase();
    const date = selectedDate.toISOString().split('T')[0];
    const time = selectedTime.split(' - ')[0].replace(/:/g, '');
    return `${courtName}_${date}_${time}.jpg`;
  };

  const uploadMedia = async () => {
    setUploading(true);
    try {
      const filename = generateImageName();
      const blob = await (await fetch(image)).blob(); // Convertir la imagen a blob
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const dataToUpload = {
        court: selectedCourt,
        date: selectedDate.toISOString(),
        time: selectedTime,
        imageUrl: downloadURL,
        fileName: filename,
        createdAt: new Date(),
      };

      await addDoc(collection(database, 'lost_items'), dataToUpload);
      setUploading(false);
      Alert.alert('¡Datos y foto cargados con éxito!');
      resetForm();
    } catch (error) {
      setUploading(false);
      handleUploadError(error);
    }
  };

  const handleUploadError = (error) => {
    console.error('Error al cargar la imagen o los datos: ', error.message);
    Alert.alert('Error al cargar la información. Intenta nuevamente.', error.message);
  };

  const confirmUpload = () => {
    setModalVisible(false);
    uploadMedia();
  };

  const cancelUpload = () => {
    setModalVisible(false);
  };

  const resetForm = () => {
    setImage(null);
    setSelectedCourt('1');
    setSelectedDate(new Date());
    setSelectedTime('10:00 - 11:00');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cargar Objeto Perdido</Text>

      <Text style={styles.label}>Selecciona la cancha:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCourt}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCourt(itemValue)}
        >
          {courts.map((court) => (
            <Picker.Item key={court.id} label={court.name} value={court.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Selecciona la fecha:</Text>
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
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
          selectedValue={selectedTime}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
        >
          {timeSlots.map((slot, index) => (
            <Picker.Item key={index} label={slot} value={slot} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.imageFrame} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Toca para seleccionar una imagen</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
        {uploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Cargar</Text>
        )}
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Carga</Text>
            <Text>¿Deseas cargar la información?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={cancelUpload} />
              <Button title="Confirmar" onPress={confirmUpload} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#404aa3',
        width: '100%',
        justifyContent: 'flex-start',
      },
    title: {
      fontSize: 27,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 15,
    },
    label: {
      fontSize: 18,
      marginVertical: 10,
      color: 'white',
    },
    pickerContainer: {
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#ccc',
      marginVertical: 10,
      backgroundColor: '#fff',
    },
    picker: {
      height: 50,
      width: '100%',
    },
    datePicker: {
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 20,
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#fff',
    },
    dateText: {
      fontSize: 16,
    },
    imageFrame: {
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 10,
      height: 120,
      width: '50%',
      justifyContent: 'center',
      alignContent: 'center',
      left: '25%',
      backgroundColor: '#fff',
      marginVertical: 20,
    },
    image: {
      height: '100%',
      width: '100%',
      borderRadius: 10,
      resizeMode: 'cover',
    },
    imagePlaceholder: {
      color: '#aaa',
      fontSize: 14,
      alignItems: 'center',
    },
    uploadButton: {
      backgroundColor: '#737bfd',
      borderRadius: 50,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      width: '100%',
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 20,
    },
  });
  export default UploadMediaFile;