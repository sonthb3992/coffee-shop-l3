import {
  DocumentSnapshot,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { app } from './firebase';

interface User {
  uid: string;
  address: string[];
}

function UserFromFirestore(snapshot: DocumentSnapshot<any>): User {
  const data = snapshot.data();
  return {
    uid: data?.uid,
    address: data?.address,
  };
}

function UserToFirestore(option: User): any {
  return {
    uid: option.uid,
    address: option.address,
  };
}

async function UserPushToFirebase(user: User): Promise<string> {
  try {
    const db = getFirestore(app);
    const menuOptionRef = collection(db, 'size_options');

    // Create a query against the collection.
    const q = query(menuOptionRef, where('nameEn', '==', user?.uid));
    const querySnapshot = await getDocs(q);

    if (user == null) return 'Null menu option.';

    await setDoc(doc(db, 'size_options'), UserToFirestore(user));
    return 'success';
  } catch (e) {
    return 'Error adding size option to Firestore: ' + e;
  }
}

export type { User };
export default UserPushToFirebase;
