import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; // Per le chiamate API
// TODO: import { useAuth } from '../contexts/AuthContext'; // Per salvare lo stato utente

// !!! IMPORTANTE !!!
// Sostituisci con l'IP della tua macchina sulla rete locale se esegui su emulatore/dispositivo fisico.
// Esempio: 'http://192.168.1.10:3000/api'
// Se usi Expo Web o test solo su simulatore iOS con server sulla stessa macchina, localhost potrebbe funzionare.
const API_URL = 'http://localhost:3000/api'; // MODIFICA SE NECESSARIO

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const { login } = useAuth(); // Esempio se si usa AuthContext

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Per favore, inserisci email e password.');
      return;
    }
    setLoading(true);
    console.log('Attempting login with API:', email, password);

    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      if (response.data && response.data.userId) {
        // TODO: Implementare AuthContext per salvare i dati utente e token
        // const { userId, token, name, level, mana } = response.data;
        // await login({ userId, token, email, name, level, mana }); // Esempio con AuthContext

        Alert.alert('Login Riuscito!', `Benvenuto ${response.data.name || email}! Mana: ${response.data.mana}`);
        // Passa i dati necessari alla MapScreen
        navigation.replace('Map', {
            userId: response.data.userId,
            currentMana: response.data.mana,
            userName: response.data.name, // Passiamo anche il nome se disponibile
            userLevel: response.data.level
        });
      } else {
        // Questo blocco potrebbe non essere mai raggiunto se il server risponde sempre con un errore HTTP per login falliti
        Alert.alert('Errore Login', response.data.message || 'Credenziali non valide o risposta non valida dal server.');
      }
    } catch (error) {
      console.error("Login API error:", error);
      if (error.response) {
        // Errore inviato dal server (es. 401, 404)
        Alert.alert('Errore Login', error.response.data.message || `Errore ${error.response.status}`);
      } else if (error.request) {
        // Richiesta inviata ma nessuna risposta ricevuta (problema di rete, server down)
        Alert.alert('Errore di Rete', 'Impossibile connettersi al server. Controlla la tua connessione e l_indirizzo IP del server.');
      } else {
        // Errore nella configurazione della richiesta
        Alert.alert('Errore', 'Si è verificato un errore imprevisto durante il login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    // navigation.navigate('Register');
    Alert.alert("TODO", "Navigazione a Schermata Registrazione da implementare.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Magico</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? "Accesso in corso..." : "Entra nel Mondo"} onPress={handleLogin} disabled={loading} />
      <View style={styles.registerButton}>
        <Button title="Non hai un account? Registrati" onPress={handleNavigateToRegister} color="#6c757d" />
      </View>
      {/* TODO: Aggiungere "Login con Google" */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff', // Blu alice chiaro, per un tocco magico
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#483d8b', // Blu ardesia scuro
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  registerButton: {
    marginTop: 20,
  }
});

export default LoginScreen;
