import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Notificacion({ mensaje }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#f44336', // Rojo para mensajes de error
    borderRadius: 5,
    marginHorizontal: 20,
    zIndex: 1, // Asegura que esté por encima de otros elementos
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});