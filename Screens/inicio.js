import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { database } from '../src/config/fb';
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default function Inicio({ onLoginStatusChange }) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false); // Menú lateral
  const [reservas, setReservas] = useState([]);
  const [objetosPerdidos, setObjetosPerdidos] = useState([]);
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // Verificar que el usuario está autenticado
    
    const fetchReservas = async () => {
      try {
        const reservasCollection = collection(database, "Reservas");
        const q = query(reservasCollection, where("userId", "==", user.uid));
        const reservasSnapshot = await getDocs(q);
        const reservasList = reservasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReservas(reservasList);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };

    const fetchObjetosPerdidos = async () => {
      try {
        const objetosCollection = collection(database, "Soli_Obj");
        const q = query(objetosCollection, where("userId", "==", user.uid));
        const objetosSnapshot = await getDocs(q);
        const objetosList = objetosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Objetos perdidos:", objetosList); // Verificar si la lista contiene datos
        setObjetosPerdidos(objetosList);
      } catch (error) {
        console.error("Error fetching objetos perdidos:", error);
      }
    };

    fetchReservas();
    fetchObjetosPerdidos();
  }, [user]);

  const lastThreeReservas = reservas
    .filter(reserva => reserva.canchaUno !== "no-asignado" || reserva.canchaDos !== "no-asignado" || reserva.canchaTres !== "no-asignado") // Filtrar solo reservas completas
    .slice(-3)
    .reverse();
    
  const lastThreeObjetosPerdidos = objetosPerdidos.slice(-3).reverse(); // Obtener las últimas 3 solicitudes

  const handleSelectMenuOption = (screen) => {
    console.log(`Navigating to: ${screen}`);
    setMenuVisible(false);
    navigation.navigate(screen);
  };
  const handleLogout = () => {
    console.log("onLoginStatusChange:", onLoginStatusChange); // Debe ser una función
    if (typeof onLoginStatusChange === "function") {
      isLoggedIn(false);
    } else {
      console.warn("onLoginStatusChange no está definido");
    }
    navigation.navigate("login"); // Navega a Login
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => handleSelectMenuOption("Reservas")}>
            <Text style={styles.menuItem}>Reservas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelectMenuOption("Ubicacion")}>
            <Text style={styles.menuItem}>Ubicación</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelectMenuOption("Equipo")}>
            <Text style={styles.menuItem}>Equipo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(false)}>
            <Text style={styles.closeMenu}>Cerrar Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.closeMenu}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.reservasContainer}>
        <Text style={styles.reservasTitle}>Mis Reservas</Text>
        <FlatList
          data={lastThreeReservas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reserva}>
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
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <StatusBar style="auto" />
      <View style={styles.objetosContainer}>
        <Text style={styles.objetosTitle}>Solicitudes de Objetos Perdidos</Text>
        <FlatList
          data={lastThreeObjetosPerdidos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.objeto}>
              <Text style={styles.objetoText}>
                Solicitaste Objeto Perdido: {item.fileName ? item.fileName.replace('.jpg', '') : "Sin nombre"}
              </Text>
              <Text style={styles.objetoText}>
                Fecha: {item.requestedAt ? item.requestedAt.toDate().toLocaleString() : "Sin fecha"}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404AA3',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  menuButton: {
    backgroundColor: '#737BFD',
    padding: 10,
    borderRadius: 10,
    margin: 20,
    marginTop: '10%',
    marginLeft: '-75%',
    justifyContent: 'center', // Cambiar a 'center' para centrar el texto
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
  },
  menu: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5, // Para sombra en Android
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
    fontSize: 18,
    color: '#404AA3',
  },
  closeMenu: {
    padding: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  reservasContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '100%', // Ajusta el ancho del recuadro
    marginBottom: 20, // Espacio entre los contenedores
  },
  objetosContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '100%',
  },
  objetosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 7,
    color: '#404AA3',
    textAlign: 'center',
  },
  objeto: {
    marginVertical: 5,
  },
  objetoText: {
    fontSize: 16,
    color: '#333',
    padding: 2,
  },
  reservasTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 7,
    color: '#404AA3',
    textAlign: 'center', // Centrar el título
  },
  reserva: {
    marginVertical: 5,
  },
  reservaText: {
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
});