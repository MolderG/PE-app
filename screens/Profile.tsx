import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import { RootBottomTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { signOut } from '../services/auth';

type Props = BottomTabScreenProps<RootBottomTabParamList, 'Profile'>;

const cardData = {
  voltage: 'Voltagem',
  current: 'Corrente',
  power: 'Potência',
};

const Profile: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [initials, setInitials] = useState('H');
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          width: '100%',
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            width: '100%',
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
            Perfil
          </Text>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#E0E0E0',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 40, color: '#212121' }}>{initials}</Text>
          </View>
          <Text
            style={{
              fontSize: FontSize.medium,
              color: Colors.darkText,
              fontFamily: Font['poppins-bold'],
              marginTop: Spacing,
            }}
          >
            email do seujeito
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={handleSignOut}
            style={{
              padding: 4,
              marginLeft: 12,
              alignSelf: 'flex-start',
              backgroundColor: Colors.lightPrimary,
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
                color: Colors.primary,
                textAlign: 'center',
                fontSize: FontSize.large,
              }}
            >
              Sair
            </Text>
          </Pressable>
          <Text>Lista de registros</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <View
              style={{
                width: '100%',
                padding: Spacing * 2,
                borderColor: Colors.primary,
                borderRadius: Spacing,
                borderWidth: 2,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.medium,
                  color: Colors.primary,
                  fontFamily: Font['poppins-bold'],
                }}
              >
                20/06/2024
              </Text>
              <View
                style={{
                  marginVertical: Spacing * 2,
                  width: '100%',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {Object.keys(cardData).map((fields, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text>{fields}</Text>
                      <Text>219V</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
