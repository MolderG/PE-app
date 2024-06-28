import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RootBottomTabParamList } from '../types';
import {
  Canvas,
  Line,
  Path,
  SkPath,
  Skia,
  vec,
} from '@shopify/react-native-skia';
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

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}

interface Reading {
  corrente: number;
  dataRegistro: string;
  voltagem: number;
}

const Home: React.FC<Props> = ({ navigation: { navigate } }) => {
  const GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = Layout.width;
  const [chartIsVoltage, setChartIsVoltage] = useState(true);
  const [data, setData] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const calculateSum = () => {
    const sum = data.reduce(
      (acc, reading) =>
        acc + (chartIsVoltage ? reading.voltagem : reading.corrente),
      0,
    );

    const avg = sum / data.length;
    return avg.toFixed(2);
  };

  const parseFirebaseData = (data: { [key: string]: any }): Reading => {
    if (!data) {
      return { corrente: 0, dataRegistro: '', voltagem: 0 };
    }

    const { corrente, dataRegistro, voltagem } = data;

    return {
      corrente: parseFloat(corrente) || 0,
      voltagem: parseFloat(voltagem) || 0,
      dataRegistro: dataRegistro || '',
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

  const graph = (data: Reading[]): GraphData => {
    const min = Math.min(
      ...data.map((value) =>
        chartIsVoltage ? Number(value.voltagem) : Number(value.corrente),
      ),
    );
    const max = Math.max(
      ...data.map((value) =>
        chartIsVoltage ? Number(value.voltagem) : Number(value.corrente),
      ),
    );

    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);
    const getXAxis = scaleLinear()
      .domain([0, data.length - 1])
      .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<Reading>()
      .x((d, i) => getXAxis(i))
      .y((d) =>
        getYAxis(chartIsVoltage ? Number(d.voltagem) : Number(d.corrente)),
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
            fontSize: FontSize.xLarge,
            color: Colors.primary,
            fontFamily: Font['poppins-bold'],
            marginVertical: Spacing * 3,
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
              fontSize: FontSize.medium,
              color: Colors.darkText,
              fontFamily: Font['poppins-bold'],
              textAlign: 'center',
            }}
          >
            Medição {chartIsVoltage ? 'voltagem' : 'corrente'} média durante o
            período
          </Text>
          <Text
            style={{
              fontSize: FontSize.xxLarge,
              color: Colors.primary,
              fontFamily: Font['poppins-bold'],
              textAlign: 'center',
            }}
          >
            {calculateSum()} {chartIsVoltage ? 'V' : 'A'}
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
            Início: 20/03/2024
          </Text>
          <Text
            style={{
              fontSize: FontSize.small,
              color: Colors.text,
              fontFamily: Font['poppins-bold'],
              textAlign: 'center',
            }}
          >
            Fim: 20/03/2024
          </Text>
        </View>
        <View
          style={{
            width: Layout.width,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Pressable
            onPress={() => setChartIsVoltage(true)}
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
              Voltagem
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setChartIsVoltage(false)}
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
              Corrente
            </Text>
          </Pressable>
        </View>
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
