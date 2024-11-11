import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth, database } from "../src/config/fb";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

export default function Register({isRegisterIn,UserRole}) {
  const navigation= useNavigation();
  const [username, setUsername] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const EmpleadoEmails = [ "bautipuentes@gmail.com",
   "gonza1234@gmail.com",
   "thiago@gmail.com",
   "agustin@gmail.com"

  ]; 
   
  
 
  const handleRegister = async () => {
    if (!username || !dni || !email || !phone || !password || !confirmPassword) {
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones");
      return;
    }
    try {

      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      
      const role = EmpleadoEmails.includes(email) ? 'empleado' : 'user';  

      
      await setDoc(doc(database, "users", user.uid), {
        username,
        dni,
        email,
        phone,
        role,
      });

      if (UserRole && typeof UserRole === 'function') {
        UserRole(role);
      }
      console.log("Usuario autenticado")
      if (typeof isLoggedIn === "function") {
        isRegisterIn(true);
      } 
      setErrorMessage("");
      navigation.navigate("login");
    } catch (error) {
      console.error("Error en el registro:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("El correo electrónico ya está en uso.");
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage("El correo electrónico no es válido.");
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      }else {
        setErrorMessage("Error en el registro. Intenta de nuevo.");
      }
    }
  };

  return  (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      {!username && errorMessage && <Text style={styles.errorText}>Nombre de usuario requerido.</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      {!dni && errorMessage && <Text style={styles.errorText}>DNI requerido.</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {!email && errorMessage && <Text style={styles.errorText}>Correo electrónico requerido.</Text>}

      <TextInput
        style={styles.input}
        placeholder="Número telefónico"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      {!phone && errorMessage && <Text style={styles.errorText}>Número telefónico requerido.</Text>}

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!password && errorMessage && <Text style={styles.errorText}>Contraseña requerida.</Text>}

      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {password && confirmPassword && password !== confirmPassword && <Text style={styles.errorText}>Las contraseñas no coinciden.</Text>}

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          style={styles.checkbox}
        >
          {acceptedTerms && <Text style={styles.checkboxText}>✅</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel} onPress={() => navigation.navigate('TerminosandCond')}>
          Acepto{" "}
        </Text>
      </View>
      {!acceptedTerms && errorMessage && <Text style={styles.errorText}>Debes aceptar los términos y condiciones.</Text>}

      {errorMessage && email && phone && password && confirmPassword && acceptedTerms && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Cambiar para empezar desde la parte superior
    alignItems: "center",
    backgroundColor: "#404aa3",
    padding: 20,
    marginTop: 20, // Añadir margen superior
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: 'center', // Centrar el título
  },
  logo: {
    width: 160,
    height: 190,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15, // Aumentar margen para mayor separación
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#737bfd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15, // Aumentar margen para mayor separación
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Aumentar margen para mayor separación
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
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 10,
  },
});
