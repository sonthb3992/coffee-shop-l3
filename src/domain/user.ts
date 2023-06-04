import {
  DocumentSnapshot,
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { app, auth } from './firebase';
import { User, signOut } from 'firebase/auth';

export async function CreateUserDataToFirebase(
  user: User,
  name?: string,
  address?: string,
  phone?: string,
  role?: string
): Promise<string> {
  const db = getFirestore(app);
  const userRef = doc(collection(db, 'users'), user.uid);
  await setDoc(userRef, {
    address: address ?? '',
    name: name ?? '',
    phone: phone ?? '',
    role: role ?? 'customer',
  });
  return 'success';
}

export async function UpdateUserDataToFirebase(
  user: User,
  name?: string,
  address?: string,
  phone?: string,
  role?: string
): Promise<string> {
  try {
    const db = getFirestore(app);
    const userRef = doc(collection(db, 'users'), user.uid);
    await updateDoc(userRef, {
      address: address ?? '',
      name: name ?? '',
      phone: phone ?? '',
      role: role ?? 'customer',
    });
    return 'success';
  } catch (error) {
    console.log(error);
    return 'Update user information failed.';
  }
}

export async function GetUserRole(userId: string): Promise<string | null> {
  try {
    console.log('Getting user role');
    const db = getFirestore(app);
    const userRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userRef);
    console.log(userDoc.data());
    currentRole = userDoc.data()?.role;
    return userDoc.data()?.role;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export var currentRole: string;

export async function signUserOut() {
  try {
    await signOut(auth);
    // User signed out successfully
    console.log('User signed out');
  } catch (error) {
    // An error occurred during sign out
    console.error('Error signing out:', error);
  }
}
