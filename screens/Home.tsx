import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { RootBottomTabParamList } from '../types';
import { Canvas, Line, Path, Skia, vec } from '@shopify/react-native-skia';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Font from '../constants/Font';
import FontSize from '../constants/FontSize';
import Spacing from '../constants/Spacing';
import { onValue, ref } from 'firebase/database';
import { FIREBASE_DB_REAL_TIME } from '../FirebaseConfig';
import { curveBasis, line, scaleLinear } from 'd3';
import { signOut } from '../services/auth';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<RootBottomTabParamList, 'Home'>;

interface Reading {
  corrente: number;
  dataRegistro: string;
  potenciaAtiva: number;
  potenciaAparente: number;
  kWhConsumido: number;
  voltagem: number;
}

type ChartType =
  | 'voltage'
  | 'current'
  | 'activePower'
  | 'apparentPower'
  | 'kWh';

const Home: React.FC<Props> = ({ navigation: { navigate } }) => {
  const GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = Layout.width;
  const [chartType, setChartType] = useState<ChartType>('current');
  const [data, setData] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const calculateSum = () => {
    const sum = data.reduce((acc, reading) => {
      switch (chartType) {
        case 'voltage':
          return acc + reading.voltagem;
        case 'current':
          return acc + reading.corrente;
        case 'activePower':
          return acc + reading.potenciaAtiva;
        case 'apparentPower':
          return acc + reading.potenciaAparente;
        case 'kWh':
          return acc + reading.kWhConsumido;
        default:
          return acc;
      }
    }, 0);

    const avg = sum / data.length;

    return avg.toFixed(3);
  };

  const parseFirebaseData = (data: { [key: string]: any }): Reading => {
    if (!data) {
      return {
        corrente: 0,
        dataRegistro: '',
        voltagem: 0,
        potenciaAtiva: 0,
        potenciaAparente: 0,
        kWhConsumido: 0,
      };
    }

    const {
      corrente,
      dataRegistro,
      voltagem,
      potenciaAtiva,
      potenciaAparente,
      kWhConsumido,
    } = data;

    return {
      corrente: parseFloat(corrente) || 0,
      dataRegistro: dataRegistro || '',
      voltagem: parseFloat(voltagem) || 0,
      potenciaAtiva: parseFloat(potenciaAtiva) || 0,
      potenciaAparente: parseFloat(potenciaAparente) || 0,
      kWhConsumido: parseFloat(kWhConsumido) || 0,
    };
  };

  useEffect(() => {
    const fetchData = () => {
      onValue(ref(FIREBASE_DB_REAL_TIME, '/Sensor'), (querySnapShot) => {
        const data = querySnapShot.val();
        if (data) {
          const parsedData = parseFirebaseData(data);

          setData((prevData) => [...prevData, parsedData]);
        }
        setLoading(false);
      });
    };

    fetchData();
  }, []);

  const graph = (data: Reading[]) => {
    const min = Math.min(
      ...data.map((value) =>
        chartType === 'voltage'
          ? Number(value.voltagem)
          : chartType === 'current'
          ? Number(value.corrente)
          : chartType === 'activePower'
          ? Number(value.potenciaAtiva)
          : chartType === 'apparentPower'
          ? Number(value.potenciaAparente)
          : 0,
      ),
    );
    const max = Math.max(
      ...data.map((value) =>
        chartType === 'voltage'
          ? Number(value.voltagem)
          : chartType === 'current'
          ? Number(value.corrente)
          : chartType === 'activePower'
          ? Number(value.potenciaAtiva)
          : chartType === 'apparentPower'
          ? Number(value.potenciaAparente)
          : 0,
      ),
    );

    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);
    const getXAxis = scaleLinear()
      .domain([0, data.length - 1])
      .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<Reading>()
      .x((d, i) => getXAxis(i))
      .y((d) =>
        getYAxis(
          chartType === 'voltage'
            ? Number(d.voltagem)
            : chartType === 'current'
            ? Number(d.corrente)
            : chartType === 'activePower'
            ? Number(d.potenciaAtiva)
            : chartType === 'apparentPower'
            ? Number(d.potenciaAparente)
            : chartType === 'kWh'
            ? Number(d.kWhConsumido)
            : 0,
        ),
      )
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

    return {
      min,
      max,
      curve: skPath!,
    };
  };

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

  const graphData =
    !loading && data.length > 0
      ? graph(data)
      : {
          min: 0,
          max: 0,
          curve: Skia.Path.Make(),
        };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing,
          height: Layout.height,
          alignItems: 'center',
          width: Layout.width,
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
        <Text
          style={{
            fontSize: FontSize.large,
            color: Colors.darkText,
            textAlign: 'center',
            fontFamily: Font['poppins-bold'],
          }}
        >
          CENTRAL DE MEDIÇÕES
        </Text>
        <View
          style={{
            marginVertical: Spacing,
            justifyContent: 'center',
            gap: 6,
            alignItems: 'center',
            width: Layout.width,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xxLarge,
              color: Colors.primary,
              fontFamily: Font['poppins-bold'],
              textAlign: 'center',
            }}
          >
            {calculateSum()}{' '}
            {chartType === 'voltage'
              ? 'V'
              : chartType === 'current'
              ? 'A'
              : chartType === 'activePower' || chartType === 'apparentPower'
              ? 'W'
              : 'kWh'}
          </Text>
        </View>
        <View
          style={{
            gap: 24,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: FontSize.small,
              color: Colors.text,
              fontFamily: Font['poppins-bold'],
              textAlign: 'center',
            }}
          >
            Data do registro: 20/03/2024
          </Text>
        </View>
        <Picker
          style={{
            width: Layout.width,
          }}
          selectedValue={chartType}
          onValueChange={(itemValue) => setChartType(itemValue)}
        >
          <Picker.Item label="Tensão" value="voltage" />
          <Picker.Item label="Corrente" value="current" />
          <Picker.Item label="Potência Ativa" value="activePower" />
          <Picker.Item label="Potência Aparente" value="apparentPower" />
          <Picker.Item label="kWh Consumido" value="kWh" />
        </Picker>
        <Canvas
          style={{
            width: Layout.width,
            height: Layout.height,
          }}
        >
          <Line
            strokeWidth={1}
            color={Colors.gray}
            p1={vec(0, 130)}
            p2={vec(GRAPH_HEIGHT, 130)}
          />
          <Line
            strokeWidth={1}
            color={Colors.gray}
            p1={vec(0, 250)}
            p2={vec(GRAPH_HEIGHT, 250)}
          />
          <Line
            strokeWidth={1}
            color={Colors.gray}
            p1={vec(0, 370)}
            p2={vec(GRAPH_HEIGHT, 370)}
          />

          <Path
            path={graphData.curve}
            color={Colors.primary}
            strokeWidth={4}
            style={'stroke'}
          />
        </Canvas>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
