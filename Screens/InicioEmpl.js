import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View ,Image,Text} from 'react-native';
import { useState , useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc,getDoc } from 'firebase/firestore';

export default function Inicioempl() {
    const [userData, setUserData] = useState({
        username: "",})
        
    const auth = getAuth();
    const userId= auth.currentUser.uid;

    useEffect(() => {
        const fetchUserData = async () => {
            const database = getFirestore();
            const userDoc = doc(database, 'users', userId); 
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const data = userSnapshot.data();
                console.log(data);
                setUserData(data); 
            } else {
                Alert.alert("No se encontró el usuario");
            }
        };

        fetchUserData();
    }, [userId]);
  

    
    return (
        <View style={styles.container}>  
        <View style={styles.title}>
           <Text style={ styles.Text}>Bienvenido  {userData.username}</Text> 
        </View>
           <View style={{ flex: 1, alignItems: 'center', marginTop: '30%' }}>
                            <Image
                                source={require('../imagen/logo-Login.png')}
                                style={{ width: 500, height: 400 }}
                                resizeMode="contain"
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
    },
   title:{
    marginTop:'10%'
   },
   Text:{
    color:'white',
    fontSize:22
   }

});