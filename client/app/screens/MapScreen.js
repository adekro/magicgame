import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

// Mock JSON per i punti magici
const MOCK_MAGIC_POINTS = [
  { id: 'mp1', name: 'Fonte di Mana Antica', latitude: 37.78825, longitude: -122.4324, description: 'Una fonte di energia pura.' },
  { id: 'mp2', name: 'Cerchio Druidico Nascosto', latitude: 37.78925, longitude: -122.4344, description: 'Senti la vecchia magia della natura.' },
  { id: 'mp3', name: 'Biblioteca Arcana in Rovina', latitude: 37.78725, longitude: -122.4304, description: 'Pergamene dimenticate potrebbero essere qui.' },
];

const MapScreen = ({ route, navigation }) => {
  const { userId, currentMana: initialMana, userName, userLevel } = route.params; // Riceve dati utente
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [magicPoints, setMagicPoints] = useState(MOCK_MAGIC_POINTS);
  const [mana, setMana] = useState(initialMana || 100); // Stato del mana locale al client

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permesso alla geolocalizzazione negato. Funzionalità mappa limitate.');
        Alert.alert('Permesso Negato','Non potrai vedere la tua posizione sulla mappa o interagire con punti basati sulla geolocalizzazione.');
        return;
      }

      try {
        // Tenta di ottenere una posizione veloce, poi una più accurata se necessario
        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(currentLocation);
        console.log("Location obtained:", currentLocation);
      } catch (e) {
          console.warn("Could not get location", e);
          setErrorMsg('Impossibile ottenere la posizione attuale.');
          // Fornire una posizione di fallback per testare l'UI se la geolocalizzazione fallisce
          setLocation({ coords: { latitude: 37.78825, longitude: -122.4324, accuracy: 100 }});
          Alert.alert('Errore Geolocalizzazione', 'Non è stato possibile ottenere la tua posizione. Verrà usata una posizione di default per la demo.');
      }
    })();
  }, []);

  const handleCastSpell = () => {
    // Passa l'ID utente, il mana attuale e altri dati utente alla schermata dell'incantesimo
    navigation.navigate('SpellCast', {
        userId: userId,
        currentMana: mana,
        userName: userName, // Passa userName
        userLevel: userLevel   // Passa userLevel
    });
  };

  // Questa funzione sarà chiamata dalla SpellCastScreen per aggiornare il mana
  // Potrebbe essere passata tramite route.params o gestita tramite un context/stato globale
  useEffect(() => {
    if (route.params?.updatedMana !== undefined) {
      setMana(route.params.updatedMana);
    }
  }, [route.params?.updatedMana]);


  let text = 'In attesa della posizione...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}, Acc: ${location.coords.accuracy?.toFixed(0)}m`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mappa del Mondo Magico</Text>
        {userName && <Text style={styles.userNameText}>Benvenuto, {userName} (Lvl: {userLevel || 'N/A'})</Text>}
        <Text style={styles.manaText}>Mana: {mana}</Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationTextLabel}>La Tua Posizione:</Text>
        {location ? <Text style={styles.locationText}>{text}</Text> : <ActivityIndicator size="small" color="#0000ff" />}
      </View>

      {/* TODO: Implementare una vera mappa con react-native-maps */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>[Placeholder per la Mappa Interattiva]</Text>
        <Text>Qui verranno mostrati i punti magici e l'utente.</Text>
        {/* TODO: Aggiungere AR Overlay qui */}
      </View>

      <View style={styles.magicPointsContainer}>
        <Text style={styles.subHeader}>Punti Magici Vicini (Mock):</Text>
        {magicPoints.map(point => (
          <View key={point.id} style={styles.point}>
            <Text style={styles.pointName}>{point.name}</Text>
            <Text style={styles.pointDesc}>{point.description}</Text>
            {/* <Text>Pos: {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}</Text> */}
            {/* TODO: Calcolare distanza e mostrare solo quelli vicini */}
            {/* TODO: Interazione con i punti magici (es. al tap) */}
          </View>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <Button title="Lancia Incantesimo Base" onPress={handleCastSpell} color="#8A2BE2" />
      </View>

      {/* TODO: Aggiungere pulsanti per inventario, profilo, scuole etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e6e6fa', // Lavanda chiaro
  },
  header: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4b0082', // Indaco
    textAlign: 'center',
  },
  manaText: {
    fontSize: 16,
    color: '#0000CD', // Blu medio
    textAlign: 'center',
    marginTop: 5,
  },
  userNameText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  locationContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  locationTextLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3', // Grigio chiaro
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a9a9a9',
    marginBottom: 15,
    padding: 10,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  magicPointsContainer: {
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4b0082',
  },
  point: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8A2BE2', // Viola
  },
  pointName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointDesc: {
    fontSize: 12,
    color: '#444',
  },
  actionsContainer: {
    marginTop: 'auto', // Spinge i pulsanti in basso
    paddingVertical: 10,
  }
});

export default MapScreen;
