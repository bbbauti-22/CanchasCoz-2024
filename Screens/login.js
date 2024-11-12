import React,{useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { auth } from "../src/config/fb";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const EmpleadoEmails = [
  "bautipuentes@gmail.com",
  "gonza1234@gmail.com",
  "thiago@gmail.com",
  "agustin@gmail.com"

];

export default function Login({ isLoggedIn,UserRole }) {
  const navigation= useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] =useState("");
  
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }
    
    try {
    const userCredential =  await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; 

    if (EmpleadoEmails.includes(email)){
      UserRole("Empleado");
      navigation.navigate("MainEmpl");
    }else{
      UserRole("Usuario");
      navigation.navigate("Main");
    }
    console.log("usuario logeado")
    if (typeof isLoggedIn === "function") {
      isLoggedIn(true);
    } 

    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage("No se encontró un usuario con ese correo.");
      } 
      else if (error.code === 'auth/wrong-password'){
        setErrorMessage("La contraseña es incorrecta.");
      }
      else if(error.code === 'auth/invalid-credential'){
        setErrorMessage("Credenciales inválidas. Verifica tu correo y contraseña.");
      }
      else{
        setErrorMessage("Error en el inicio de sesión. Intenta de nuevo.");
      }
    }
    
  };
  

  return (
    <View style={styles.container}>
      <Image
        source={require("../imagen/logo-Login.png")}
        style={styles.logo}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errorMessage && !email && <Text style={styles.errorText}>El campo de correo electrónico es obligatorio.</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage && !password && <Text style={styles.errorText}>El campo de contraseña es obligatorio.</Text>}
      
      {errorMessage && email && password && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>  navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes una cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", 
    alignItems: "center",
    backgroundColor: "#404aa3",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    width: 160,
    height: 190,
    marginBottom: 20,
    marginTop: 30, // Aumentar margen superior para bajar el logo
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    marginTop: 10, // Aumentar margen superior para bajar los inputs
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#737bfd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10, // Aumentar margen superior para bajar el botón
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10, // Aumentar margen superior para bajar el enlace
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 18,
  },
  checkboxLabel: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "gray",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 10,
  },
});