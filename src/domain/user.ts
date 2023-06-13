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
  onSnapshot,
} from 'firebase/firestore';
import { app, auth } from './firebase';
import { User, signOut } from 'firebase/auth';

export interface UserData {
  address: string;
  name: string;
  phone: string;
  role: string;
  favorites: string[];
  count?: number;
  currentRating?: number;
}

export async function CreateUserDataToFirebase(
  user: User,
  name?: string,
  address?: string,
  phone?: string,
  role?: string
): Promise<string> {
  const db = getFirestore(app);
  const userRef = doc(collection(db, 'users'), user.uid);
  const userData: UserData = {
    address: address ?? '',
    name: name ?? '',
    phone: phone ?? '',
    role: role ?? 'customer',
    favorites: [],
  };
  await setDoc(userRef, userData);
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

export async function ToggleUserFavorite(
  userUid: string,
  itemName: string
): Promise<string> {
  try {
    const db = getFirestore(app);
    const userRef = doc(collection(db, 'users'), userUid);
    //Get the favorites
    const userDoc = await getDoc(userRef);
    let currentFavorites: string[] = [];
    currentFavorites = userDoc.data()?.favorites ?? [];
    if (currentFavorites.includes(itemName)) {
      currentFavorites = currentFavorites.filter((item) => item !== itemName);
    } else {
      currentFavorites = [...currentFavorites, itemName];
    }
    await updateDoc(userRef, {
      favorites: currentFavorites ?? [],
    });
    return 'success';
  } catch (error) {
    console.log(error);
    return 'Update user information failed.';
  }
}

var _userData: UserData | null = null;
export async function GetUserDataFromFirebase(
  userUid: string
): Promise<UserData | null> {
  try {
    if (_userData !== null) return _userData;

    const db = getFirestore(app);
    const userRef = doc(collection(db, 'users'), userUid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return null;
    }

    const unsubscribe = onSnapshot(userRef, (updatedSnapshot) => {
      const updatedUserdata = updatedSnapshot.data() as UserData;
      _userData = updatedUserdata;
    });

    const userData = userSnapshot.data() as UserData;
    _userData = userData;

    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetUserRole(userId: string): Promise<string | null> {
  try {
    const db = getFirestore(app);
    const userRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userRef);
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
