import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Inicioempl() {
    return (
        <View style={styles.container}>  
            <View style={styles.reservasContainer}>
                <Text style={styles.reservasTitle}>Datos</Text>
                <View style={styles.reserva}>
                    <Text style={styles.reservaText}>Gonzalo cargo turno
                    para Joaco. 21/10/2024</Text>
                </View>
                <View style={styles.reserva}>
                    <Text style={styles.reservaText}>Agustin ha dado de baja 
                    el turno de Lucas. 22/08/2024</Text>
                </View>
                <View style={styles.reserva}>
                    <Text style={styles.reservaText}>Bautista ha dado de baja 
                    el turno de Thiago. 23/08/2024 </Text>
                </View>
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
    reservasContainer: {
        position: 'absolute',
        flex: 1, 
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        width: '70%', // Ajusta el ancho del recuadro
        height:'60%',
        marginTop: '30%', // Ajustar según necesidad
    },
    reserva: {
        marginVertical: 10,
        padding: 20,
        backgroundColor: '#fff', // Blanco para las cajas
        borderRadius: 5, // Bordes redondeados
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    reservaText: {
        fontSize: 16,
        color: '#333',
        justifyContent:'center',
        alignItems:'center',
        margin:'center'
    },
    reservasTitle:{
        marginLeft:'36%',
        fontSize:24
    }
});