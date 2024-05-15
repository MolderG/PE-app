import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import Login from '../screens/Login';
import { RootStackParamList } from '../types';
import Register from '../screens/Register';
import Welcome from '../screens/Welcome';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { ActivityIndicator, View } from 'react-native';
import Home from '../screens/Home';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const auth = FIREBASE_AUTH;

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((_user) => {
      if (initializing) {
        setInitializing(false);
      }
      setUser(_user);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}
