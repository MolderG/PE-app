import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AppTextInput } from '../components/TextInput';
import { signUp } from '../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, serIsLoading] = useState(false);

  const handleSignup = async () => {
    serIsLoading(true);
    try {
      await signUp(email, password);
    } catch (error) {
      serIsLoading(true);
      console.log(error);
    } finally {
      serIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font['poppins-bold'],
              marginVertical: Spacing * 3,
            }}
          >
            Criar uma conta
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <AppTextInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
          <AppTextInput
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={handleSignup}
            style={{
              padding: Spacing * 2,
              backgroundColor: Colors.primary,
              marginVertical: Spacing * 3,
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font['poppins-bold'],
                color: Colors.onPrimary,
                textAlign: 'center',
                fontSize: FontSize.large,
              }}
            >
              Criar Conta
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigate('Login')}
          style={{
            padding: Spacing,
          }}
        >
          <Text
            style={{
              fontFamily: Font['poppins-semiBold'],
              color: Colors.text,
              textAlign: 'center',
              fontSize: FontSize.small,
            }}
          >
            Já possuo conta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Register;
