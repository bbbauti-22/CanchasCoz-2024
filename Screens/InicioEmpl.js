import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View ,Image} from 'react-native';

export default function Inicioempl() {
    return (
        <View style={styles.container}>  
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

});