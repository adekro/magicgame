import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Importa le schermate (da creare)
import LoginScreen from './app/screens/LoginScreen';
import MapScreen from './app/screens/MapScreen';
import SpellCastScreen from './app/screens/SpellCastScreen'; // Schermata per lanciare l'incantesimo base
// import RegisterScreen from './app/screens/RegisterScreen'; // Da creare

// TODO: Importare un AuthContext per gestire lo stato di autenticazione
// import { AuthProvider, useAuth } from './app/contexts/AuthContext';


const Stack = createStackNavigator();

function AppNavigator() {
  // const { user } = useAuth(); // Esempio se si usa AuthContext

  // Per ora, assumiamo che l'utente non sia loggato e mostriamo sempre Login
  // In futuro, si userà lo stato di autenticazione per decidere quale stack mostrare
  const user = null; // Placeholder

  return (
    <Stack.Navigator>
      {user ? (
        // Stack per utenti autenticati
        <>
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mappa Magica' }} />
          <Stack.Screen name="SpellCast" component={SpellCastScreen} options={{ title: 'Lancia Incantesimo' }} />
          {/* Altre schermate post-login qui */}
        </>
      ) : (
        // Stack per autenticazione
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Accedi al Mondo Magico' }} />
          {/* <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrati' }} /> */}
          {/* TODO: Aggiungere la schermata di registrazione e la navigazione */}
        </>
      )}
      {/* Schermate accessibili da entrambi gli stati o modal globali potrebbero andare qui,
          ma è più comune avere stack separati.
          Per l'MVP, se il login ha successo, navigheremo manualmente a MapScreen da LoginScreen.
          Quindi lo stack di autenticazione può includere anche le schermate dell'app per semplicità MVP.
      */}
       {/* <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crea Account' }} /> */}
       <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mappa Magica', headerShown: false }} />
       <Stack.Screen name="SpellCast" component={SpellCastScreen} options={{ title: 'Lancia Incantesimo' }} />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    // <AuthProvider> // TODO: Wrappare con AuthProvider
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
    // </AuthProvider>
  );
}

// TODO:
// 1. Creare AuthContext per gestire lo stato dell'utente (login/logout) e token.
// 2. Modificare AppNavigator per mostrare Login/Register stack o App stack (Map, etc.)
//    in base allo stato di autenticazione.
// 3. Creare le schermate RegisterScreen.
// 4. Implementare la logica di navigazione effettiva dopo login/registrazione.
