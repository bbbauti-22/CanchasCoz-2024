
import React, { useState,useRef } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { database } from "../src/config/fb";
import { collection, addDoc } from "firebase/firestore";

import CheckBox from 'expo-checkbox';

function Pago() {
  const navigation = useNavigation();
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animación de opacidad

  const validateForm = () => {
    if (!cardType || !cardNumber || !expiryDate || !cvv || !documentNumber) {
      Alert.alert("Todos los campos son obligatorios");
      return false;
    }
    if (cardNumber.length !== 16) {
      Alert.alert("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert("El CVV debe tener 3 o 4 dígitos");
      return false;
    }
    if (expiryDate.length !== 5 || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert("La fecha de vencimiento debe tener el formato MM/AA");
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    Alert.alert(
      "Confirmar Pago",
      `Tipo de Tarjeta: ${cardType}\nNúmero de Tarjeta: **** **** **** ${cardNumber.slice(-4)}\nFecha de Vencimiento: ${expiryDate}\nNúmero de Documento: ${documentNumber}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: handleSubmit },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

   // Comienza la animación de carga
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
    }).start();

    const paymentData = {
      cardType,
      cardNumber,
      expiryDate,
      cvv,
      documentNumber,
    };

    try {
      await addDoc(collection(database, "payments"), paymentData);
      
      if (saveCard) {
        const savedCardData = {
          cardType,
          cardNumber,
          expiryDate,
          cvv,
          documentNumber,
        };
        await addDoc(collection(database, "savedCards"), savedCardData);
        Alert.alert("Pago realizado y tarjeta guardada para futuras compras.");
      } else {
        Alert.alert("Pago realizado con éxito.");
      }
      setTimeout(() => {
        navigation.navigate("Ini"); // Cambia "Home" por el nombre real de tu pantalla de inicio
      }, 2000); // Espera un segundo antes de navegar

    } catch (error) {
      Alert.alert("Error al guardar el pago:", error.message);
      console.log("Firebase error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "android" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0} // Ajusta este valor según tus necesidades
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>Realizar Pago</Text>
      <Text style={styles.label}>Tarjeta crédito o débito:</Text>
      <View style={styles.cardImagesContainer}>
        <Image source={require('../imagen/logo-header.png')} style={styles.cardImage} />
        <Image source={require('../imagen/logo-header.png')} style={styles.cardImage} />
        <Image source={require('../imagen/logo-header.png')} style={styles.cardImage} />
        <Image source={require('../imagen/logo-header.png')} style={styles.cardImage} />
        <Image source={require('../imagen/logo-header.png')} style={styles.cardImage} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Seleccione el tipo de tarjeta"
        value={cardType}
        onChangeText={setCardType}
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.label}>Número de seguridad social (DNI / CUIT/ CUIL):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su número de documento"
        value={documentNumber}
        onChangeText={setDocumentNumber}
        keyboardType="numeric"
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.label}>Número de la Tarjeta:</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        maxLength={16}
        placeholderTextColor="#A9A9A9"
      />
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Fecha de Vencimiento:</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/AA"
            value={expiryDate}
            onChangeText={setExpiryDate}
            maxLength={5}
            placeholderTextColor="#A9A9A9"
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Código de seguridad:</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor="#A9A9A9"
          />
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={saveCard}
          onValueChange={setSaveCard}
        />
        <Text style={styles.label}>Guardar tarjeta para futuras compras</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Finalizar Pago" onPress={handleConfirm} />
      )}
      </ScrollView>
   </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#404AA3',
  },
  scrollContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    textAlign: 'center',
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cardImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  cardImage: {
    width: 65,
    height: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    marginRight:5
  },
});

export default Pago;