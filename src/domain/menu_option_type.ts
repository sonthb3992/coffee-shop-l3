import {
  DocumentSnapshot,
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  doc,
} from 'firebase/firestore';
import { app } from './firebase';

class MenuItemTypeOption {
  private readonly _nameEn: string;
  public get nameEn(): string {
    return this._nameEn;
  }
  private readonly _nameVi: string;
  public get nameVi(): string {
    return this._nameVi;
  }

  constructor({ nameEn, nameVi }: { nameEn: string; nameVi: string }) {
    this._nameEn = nameEn;
    this._nameVi = nameVi;
  }

  static fromFirestore(snapshot: DocumentSnapshot<any>): MenuItemTypeOption {
    const data = snapshot.data();
    return new MenuItemTypeOption({
      nameEn: data?.nameEn,
      nameVi: data?.nameVi,
    });
  }

  static toFirestore(type: MenuItemTypeOption): any {
    return { nameEn: type.nameEn, nameVi: type.nameVi };
  }

  static async pushToFirebase(
    option: MenuItemTypeOption | null
  ): Promise<string> {
    try {
      const db = getFirestore(app);
      const dbRef = collection(db, 'menu_item_types');

      // Create a query against the collection.
      const q = query(dbRef, where('nameEn', '==', option?.nameEn));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return 'Another menu_item_types with the same name already existed.';
      }

      if (option == null) return 'Null menu_item_types option.';

      await setDoc(
        doc(db, 'menu_item_types'),
        MenuItemTypeOption.toFirestore(option)
      );
      return 'success';
    } catch (e) {
      return 'Error adding menu_item_types to Firestore: ' + e;
    }
  }

  static async getAll(): Promise<MenuItemTypeOption[]> {
    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'menu_item_types');

      // Create a query against the collection.
      const querySnapshot = await getDocs(menuOptionRef);

      if (querySnapshot.empty) {
        return [];
      }

      var result = querySnapshot.docs.map((m) =>
        MenuItemTypeOption.fromFirestore(m)
      );
      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export { MenuItemTypeOption };
