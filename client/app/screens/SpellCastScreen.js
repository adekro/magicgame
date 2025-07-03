import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; // Per chiamate API

// !!! IMPORTANTE !!! (Stesso avviso di LoginScreen)
const API_URL = 'http://localhost:3000/api'; // MODIFICA SE NECESSARIO

const FIXED_SPELL = {
  id: 'spell001', // Potrebbe essere passato o recuperato dal server in futuro
  name: 'Igniculus',
  description: 'Un piccolo dardo di fuoco crepitante.',
  manaCost: 10,
  damage: 5, // Danno puramente illustrativo per ora
};

const SpellCastScreen = ({ route, navigation }) => {
  const { userId, currentMana } = route.params; // Riceve userId e mana dalla MapScreen
  const [mana, setMana] = useState(currentMana);
  const [casting, setCasting] = useState(false);

  const handleCastIgniculus = async () => {
    if (mana < FIXED_SPELL.manaCost) {
      Alert.alert('Mana Insufficiente', `Non hai abbastanza mana per lanciare ${FIXED_SPELL.name}. Richiede ${FIXED_SPELL.manaCost} mana.`);
      return;
    }

    setCasting(true);
    console.log(`Tentativo di lanciare ${FIXED_SPELL.name} per l'utente ${userId}`);

    // const newManaLocal = mana - FIXED_SPELL.manaCost; // Calcolo locale per confronto, ma useremo il valore server

    console.log(`API: Aggiornamento mana per utente ${userId}, variazione: ${-FIXED_SPELL.manaCost}`);
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/mana`, {
        manaChange: -FIXED_SPELL.manaCost // Invia la variazione negativa
      });

      if (response.data && response.data.user) {
        const serverMana = response.data.user.mana;
        setMana(serverMana); // Aggiorna il mana con il valore autorevole dal server

        Alert.alert(
          'Incantesimo Lanciato!',
          `${FIXED_SPELL.name} lanciato con successo!\nCosto: ${FIXED_SPELL.manaCost} Mana.\nMana Rimanente (dal server): ${serverMana}`
        );
        // Torna alla mappa e aggiorna il mana lì, passando tutti i parametri necessari
        navigation.navigate('Map', {
            updatedMana: serverMana,
            userId: userId,
            // Ripassa gli altri parametri se MapScreen li necessita al ritorno
            userName: route.params.userName,
            userLevel: route.params.userLevel
        });
      } else {
        Alert.alert('Errore Aggiornamento Mana', response.data.message || 'Risposta non valida dal server durante l_aggiornamento del mana.');
        // Considerare se ripristinare il mana o gestire diversamente
      }
    } catch (error) {
      console.error("Errore API lancio incantesimo:", error);
      if (error.response) {
        Alert.alert('Errore Incantesimo', error.response.data.message || `Errore server ${error.response.status}`);
      } else if (error.request) {
        Alert.alert('Errore di Rete', 'Impossibile comunicare con il server per lanciare l_incantesimo.');
      } else {
        Alert.alert('Errore', 'Si è verificato un errore imprevisto.');
      }
    } finally {
      setCasting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lancia Incantesimo</Text>
      <View style={styles.spellInfoCard}>
        <Text style={styles.spellName}>{FIXED_SPELL.name}</Text>
        <Text style={styles.spellDescription}>{FIXED_SPELL.description}</Text>
        <Text style={styles.spellDetail}>Costo Mana: {FIXED_SPELL.manaCost}</Text>
        <Text style={styles.spellDetail}>Danno (Illustrativo): {FIXED_SPELL.damage}</Text>
      </View>

      <Text style={styles.currentMana}>Mana Attuale: {mana}</Text>

      {/* TODO: Aggiungere placeholder per gesture recognition */}
      <View style={styles.gesturePlaceholder}>
        <Text style={styles.gestureText}>
          [Qui verrà implementato il riconoscimento della gesture per lanciare l'incantesimo]
        </Text>
        <Text style={styles.gestureSubText}>
          (Per ora, premi il pulsante qui sotto)
        </Text>
      </View>

      <Button
        title={casting ? `Lancio di ${FIXED_SPELL.name}...` : `Lancia ${FIXED_SPELL.name}!`}
        onPress={handleCastIgniculus}
        disabled={casting || mana < FIXED_SPELL.manaCost}
        color="#ff4500" // Rosso arancio per un incantesimo di fuoco
      />
       <View style={styles.backButtonContainer}>
        <Button
            title="Torna alla Mappa"
            onPress={() => navigation.goBack()}
            color="#6c757d"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Allinea all'inizio per dare spazio
    padding: 20,
    backgroundColor: '#2c1f2b', // Sfondo scuro per atmosfera magica
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f0e68c', // Khaki chiaro
    marginBottom: 20,
  },
  spellInfoCard: {
    backgroundColor: '#4a3a47', // Un viola/marrone scuro
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  spellName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffd700', // Oro
    marginBottom: 8,
  },
  spellDescription: {
    fontSize: 16,
    color: '#f5f5f5', // Bianco fumo
    textAlign: 'center',
    marginBottom: 10,
  },
  spellDetail: {
    fontSize: 14,
    color: '#e0e0e0', // Grigio chiaro
  },
  currentMana: {
    fontSize: 18,
    color: '#87cefa', // Azzurro cielo
    marginBottom: 25,
  },
  gesturePlaceholder: {
    width: '100%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#ffd700',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  gestureText: {
    color: '#ffd700',
    textAlign: 'center',
    fontSize: 16,
  },
  gestureSubText: {
    color: '#f0e68c',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
  },
  backButtonContainer: {
      marginTop: 20,
      width: '80%',
  }
});

export default SpellCastScreen;
