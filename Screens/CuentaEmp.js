import React, { useState,useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert ,TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc ,setDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
import {auth} from '../src/config/fb';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importamos el ícono


const CuentaEmpl = ({isLogedIn}) => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState({
        username: "",
        phone: "",
        dni: "",
        email: "",
        profileImageUrl: "",
    });
    const [editing, setEditing] = useState(false);
    const userId= auth.currentUser.uid //obtener el ID del usuario autenticado


    useEffect(() => {
      const fetchUserData = async () => {
          const database = getFirestore();
          const userDoc = doc(database, 'users', userId); 
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
              const data = userSnapshot.data();
              console.log(data);
              setUserData(data);
              setImage(data.profileImageUrl); // Asigna la URL de la imagen
          } else {
              Alert.alert("No se encontró el usuario");
          }
      };

      fetchUserData();
  }, [userId]);




    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Se necesitan permisos para acceder a la galería");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri; // Acceso a la URI de la imagen seleccionada
            setImage(uri);
            await uploadImage(uri);
        }
    };

    const uploadImage = async (uri) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${userId}.jpg`); // Asegúrate de reemplazar 'userId' por el ID real del usuario
            const response = await fetch(uri);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            // Actualiza la URL en Firestore
            await setDoc(doc(getFirestore(), 'users', userId), { profileImageUrl: downloadURL }, { merge: true });

            setUserData(prevData => ({ ...prevData, profileImageUrl: downloadURL }));
            setImage(downloadURL);

            Alert.alert("Imagen de perfil subida correctamente.");
        } catch (error) {
            Alert.alert("Error al subir la imagen", error.message);
        }
    };

    const deleteImage = async () => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${userId}.jpg`); // Asegúrate de reemplazar 'userId' por el ID real del usuario
            await deleteObject(storageRef);
            setUserData({ ...userData, profileImageUrl: "" });
            setImage(null);
            Alert.alert("Imagen de perfil borrada correctamente.");
        } catch (error) {
            Alert.alert("Error al borrar la imagen", error.message);
        }
    };

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleChange = (field, value) => {
        setUserData({ ...userData, [field]: value });
    };

    const handleSubmit = async () => {
        try {
            await setDoc(doc(getFirestore(), 'users', userId), userData, { merge: true });
            setEditing(false);
            Alert.alert("Información actualizada correctamente.");
        } catch (error) {
            Alert.alert("Error al actualizar la información", error.message);
        }
    };
    const handleLogout = () => {
        console.log("Cierre de sesión")
        if (typeof isLogedIn === "function") {
          isLogedIn(false);
        } 
        navigation.navigate("login"); // Navega a Login
      };

    return (
        <View style={styles.container}>
            
            <View style={styles.buttonContainer}>
                
                <TouchableOpacity onPress={deleteImage}>
                    <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cerrarsesion} onPress={handleLogout}>
                <Icon name="sign-out" size={15} color="white" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={pickImage}>
                <View style={styles.profileImageContainer}>
                    {image || userData.profileImageUrl ? (
                        <Image
                            source={{ uri: image || userData.profileImageUrl }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Text style={styles.placeholderText}>Foto de perfil</Text>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={editing ? handleSubmit : handleEditToggle}>
                <Text style={styles.editButtonText}>{editing ? "Guardar" : "Editar Información"}</Text>
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                    {editing ? (
                        <TextInput
                            style={styles.infoTextInput}
                            value={userData.username}
                            onChangeText={(text) => handleChange('username', text)}
                        />
                    ) : (
                        <Text style={styles.infoText}>{userData.username}</Text>
                    )}
                </View>
                <View style={styles.infoBox}>
                    {editing ? (
                        <TextInput
                            style={styles.infoTextInput}
                            value={userData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                        />
                    ) : (
                        <Text style={styles.infoText}>{userData.phone}</Text>
                    )}
                </View>
                <View style={styles.infoBox}>
                    {editing ? (
                        <TextInput
                            style={styles.infoTextInput}
                            value={userData.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />
                    ) : (
                        <Text style={styles.infoText}>{userData.email}</Text>
                    )}
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <MaterialIcons name="lock" size={18} color="white" />
                        {userData.dni}
                    </Text>
                </View>
            </View>
         
    </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#404AA3',
        alignItems: 'center',
        marginTop: 20, // Aumentar el margen superior
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
    },
    buttonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
    },
    profileImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Añadir más margen inferior
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    placeholderText: {
        color: 'white',
        fontSize: 18,
    },
    editButtonText:{
        color: 'white',
        fontSize: 16,
        textDecorationLine: 'none',
        marginBottom: 20,
    },
    infoContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    infoBox: {
        backgroundColor: '#575FCC',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    infoText: {
        color: 'white',
        fontSize: 18,
    },
    helpSection: {
        flex:1,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center', // Centra verticalmente
        alignItems: 'center', // Centra horizontalmente
        marginTop: 30
    },
    helpText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 1,
    },
    contactText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 1,
    },
    backButtonText: {
        fontSize: 35,
        color: '#000',
        marginBottom: -35,
    },

    staticInput: {
        backgroundColor: '#575FCC',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        width: '100%', // Ajusta el ancho según lo que necesites
        marginTop:'-5%',
        paddingVertical: 10, 
       
    },
    staticInputText: {
        color: 'white',
        fontSize: 18,
    },
    contenedorAyuda: {
        marginVertical: 10, // Agrega espacio vertical entre el texto y el botón
    },
    botoncierre: {
        position: 'absolute', // Posiciona el botón en un lugar específico
        top:15, // Ajusta la distancia desde la parte superior
        left: 280, // Ajusta la distancia desde el borde izquierdo
        zIndex: 1 // Asegura que esté por encima de otros elementos si es necesario
      },
      cerrarsesion: {
        backgroundColor: '#737BDF', // Color de fondo del botón
        paddingVertical: 5, // Espaciado vertical del botón
        paddingHorizontal: 5, // Espaciado horizontal
        borderRadius: 5, // Bordes redondeados
        justifyContent: 'center', // Centrado vertical del texto
        alignItems: 'center', // Centrado horizontal del texto
      },
      cerrarsesionText: {
        color: 'white', // Color del texto
        fontWeight: 'bold', // Estilo de fuente
        fontSize: 16, // Tamaño de la fuente
      },
    
});

export default CuentaEmpl;