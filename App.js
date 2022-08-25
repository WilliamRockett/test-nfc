import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import 'expo-dev-client';

export default function App() {
  const [hasNfc, setHasNfc] = useState(false);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      setHasNfc(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
      }
    }

    checkIsSupported()
  }, []);

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef, { alertMessage: 'Veuillez scanner une puce NFC' });
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.log('Tag found', tag);
    } catch (ex) {
      console.log(JSON.stringify(ex))
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {hasNfc
        ?
        <TouchableOpacity onPress={readNdef}>
          <Text>Appuyez pour scanner</Text>
        </TouchableOpacity>
        :
        <Text>NFC non supporté</Text>
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
