import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function TeamMediaScreen() {
  return (
    <View style={styles.container}>
      

    
     
      <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.teamNameContainer}>
        <Text style={styles.teamName}>Chupachichis</Text>
      </View>

        <Text style={styles.title}>Fotos del Equipo Estrella</Text>

        <View style={styles.smallImagesContainer}>
          <View style={styles.smallImageWrapper}>
            <Image 
              source={require('../Equipo-img/Foto1.jpg')} 
              style={styles.smallImage} 
            />
          </View>
          <View style={styles.smallImageWrapper}>
            <Image 
              source={require('../Equipo-img/Foto2.jpg')} 
              style={styles.smallImage} 
            />
          </View>
          <View style={styles.smallImageWrapper}>
            <Image 
              source={require('../Equipo-img/Foto3.jpg')} 
              style={styles.smallImage} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404aa3',
  },
  logo: {
    width: 400,
    height: 50,
    alignItems: 'center',
    resizeMode: 'contain',
  },
  teamNameContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20, // Aumenta el tamaño de la fuente
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center', // Centra el texto
    textTransform: 'uppercase', // Transforma el texto a mayúsculas
    letterSpacing: 1.2, // Espaciado entre letras
    shadowColor: '#000', // Agrega sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // Para Android
  },
  smallImagesContainer: {
  
    flexDirection: 'column',
    width: '100%',
    height: '50%',
    marginBottom: 40,
  },
  smallImageWrapper: {
    height: 500,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    elevation: 4,
    marginBottom: 10, // Espacio entre las imágenes
  },
  smallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
});