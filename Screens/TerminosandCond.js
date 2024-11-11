import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';



export default function TermsAndConditionsScreen({ onAccept }) {
    navon=useNavigation();
  
  
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Título de la pantalla */}
        <Text style={styles.title}>Términos y Condiciones</Text>

        {/* Contenedor para los términos y condiciones */}
        <View style={styles.termsContainer}>
          <Text style={styles.text}>
            Para completar tu registro, debes aceptar los Términos de uso y el procesamiento, tratamiento y transferencia de tus datos personales conforme a lo dispuesto en las Políticas de Privacidad.
          </Text>
        </View>
       
     

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#404aa3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#404aa3',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  termsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    minHeight: 100,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
  acceptButton: {
    backgroundColor: '#737bfd',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
});