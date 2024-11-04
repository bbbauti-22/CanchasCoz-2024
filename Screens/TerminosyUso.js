import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Terminos = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
   
      <View style={styles.header}>
       
        <View style={styles.titleBox}>
          <Text style={styles.title}>Términos y Uso de Privacidad</Text>
        </View>
      </View>
      
      <View style={styles.box}>
        <Text style={styles.boxText}>
          Gracias por completar tu registro en nuestra plataforma. Al hacerlo,
          has aceptado los Términos de Uso y has dado tu consentimiento para el
          procesamiento, tratamiento y transferencia de tus datos personales de
          acuerdo con lo establecido en nuestras Políticas de Privacidad.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.boxText}>
          Además, has optado por recibir boletines, promociones y otra
          información relevante de Katriki Canchas y sus compañías afiliadas.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.boxText}>
          Te invitamos a revisar nuevamente nuestros Términos de Uso y
          Políticas de Privacidad para estar al tanto de cualquier actualización.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e6e6fa', // Cambié el color de fondo a un suave lavanda
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  titleBox: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20, // Aumenté el tamaño de la fuente
    fontWeight: 'bold',
    color: '#404AA3',
    textAlign: 'center',
    alignItems:'center'
  },
  box: {
    backgroundColor: '#fff', // Cambié el color de fondo a blanco para las cajas
    padding: 20, // Aumenté el padding para mayor espacio
    marginBottom: 15,
    borderRadius: 10, // Bordes más redondeados
    shadowColor: '#000', // Añadí sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Para Android
  },
  boxText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24, // Aumenté el interlineado para mejor legibilidad
  },
});

export default Terminos;