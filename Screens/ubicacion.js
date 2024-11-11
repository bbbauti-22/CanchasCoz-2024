import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Ubicaciones = () => {
  // Array de ubicaciones de los gimnasios
  const Canchas = [
    { name: 'Canchas COZ ', latitude: -38.979466, longitude: -68.075714 },
   
  ];

  // Función para abrir Google Maps
  const openMap = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(googleMapsUrl).catch(err => console.error("Error opening map:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Horario y Ubicación</Text>

      {/* Mapa con los marcadores */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -38.979466,  // Coordenada central
            longitude: -68.075714 ,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {Canchas.map(cancha => (
            <Marker
              key={cancha.name}
              coordinate={{ latitude: cancha.latitude, longitude: cancha.longitude }}
              title={cancha.name}
              onPress={() => openMap(cancha.latitude, cancha.longitude)}  // Acción al tocar el marcador
            />
          ))}
        </MapView>
      </View>

      {/* Información adicional */}
      <View style={styles.infoContainer}>
        <View style={styles.ubicacionContainer}>
          <Icon name="map-marker" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.nombreUbicacion} >Canchas COZ - Alquiler de Canchas</Text>
        </View>

        <View style={styles.horarioContainer}>
          <Icon name="clock-outline" size={30} color="#fff" style={styles.icon} />
          <Text style={styles.horarios}>Horarios disponibles: 10hs a 00hs</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404AA3',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  mapContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.35, // Ajustado para el mapa
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  enlaceContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  ubicacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#555BA9',
    borderRadius: 10,
    paddingVertical: 10,
    width: '90%',
    justifyContent: 'center',
  },
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#555BA9',
    borderRadius: 10,
    paddingVertical: 10,
    width: '90%',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  nombreUbicacion: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  horarios: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Ubicaciones;
