import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const auth = FIREBASE_AUTH;

export const signUp = async (email: string, password: string) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredentials.user;
    console.log('Usuário registrado:', user);
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredentials.user;
    console.log('Usuário logado:', user);
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    console.log('Usuário deslogado');
  } catch (error) {
    throw error;
  }
};
