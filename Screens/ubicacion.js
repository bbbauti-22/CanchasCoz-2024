import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


export default function Ubicaciones() {

  return (
    <View style={styles.container}>
      <Text>Donde estamos</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404AA3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
