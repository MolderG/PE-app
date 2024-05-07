import { NavigationProp } from '@react-navigation/native';
import { Button, View } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}
export function List({ navigation }: RouterProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Abrir detalhes"
        onPress={() => navigation.navigate('details')}
      />
      <Button title="Sair" onPress={() => FIREBASE_AUTH.signOut()} />
    </View>
  );
}
