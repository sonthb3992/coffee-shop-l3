import {
  DocumentSnapshot,
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { OptionBase } from './base_option';
import { app } from './firebase';

class SizeOption extends OptionBase {
  readonly nameEn: string;
  readonly nameVi: string;
  readonly basePrice: number;
  readonly displayOrder: number;
  static allSizeOptions: SizeOption[];

  constructor({
    nameEn,
    nameVi,
    basePrice,
    displayOrder,
  }: {
    nameEn: string;
    nameVi: string;
    basePrice: number;
    displayOrder: number;
  }) {
    super();
    this.nameEn = nameEn;
    this.nameVi = nameVi;
    this.basePrice = basePrice;
    this.displayOrder = displayOrder;
  }

  getName(): string | undefined {
    return this.nameEn;
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  static fromFirestore(snapshot: DocumentSnapshot<any>): SizeOption {
    const data = snapshot.data();
    return new SizeOption({
      nameEn: data?.nameEn,
      nameVi: data?.nameVi,
      basePrice: parseFloat(data?.basePrice?.toString() ?? '0'),
      displayOrder: parseInt(data?.displayOrder?.toString() ?? '0', 10),
    });
  }

  static toFirestore(option: SizeOption): any {
    return {
      nameEn: option.nameEn,
      nameVi: option.nameVi,
      basePrice: option.basePrice,
      displayOrder: option.displayOrder,
    };
  }

  static async pushToFirebase(option: SizeOption): Promise<string> {
    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'size_options');

      // Create a query against the collection.
      const q = query(menuOptionRef, where('nameEn', '==', option?.nameEn));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return 'Another size item with the same name already existed.';
      }

      if (option == null) return 'Null menu option.';

      await setDoc(doc(db, 'size_options'), SizeOption.toFirestore(option));
      return 'success';
    } catch (e) {
      return 'Error adding size option to Firestore: ' + e;
    }
  }

  static async getAll(): Promise<SizeOption[]> {
    try {
      if (SizeOption.allSizeOptions && SizeOption.allSizeOptions.length > 0) {
        return SizeOption.allSizeOptions;
      }

      const db = getFirestore(app);
      const sizeOptionRef = collection(db, 'size_options');

      const querySnapshot = await getDocs(sizeOptionRef);

      if (querySnapshot.empty) {
        console.log('Query snapshot is empty');
        return [];
      }

      const sizeOptions = querySnapshot.docs.map((doc) =>
        SizeOption.fromFirestore(doc)
      );

      const unsubscribe = onSnapshot(sizeOptionRef, (updatedSnapshot) => {
        const updatedSizeOptions = updatedSnapshot.docs.map((doc) =>
          SizeOption.fromFirestore(doc)
        );
        SizeOption.allSizeOptions = updatedSizeOptions;
      });

      SizeOption.allSizeOptions = sizeOptions;

      return sizeOptions;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  getCountPrice(count: number): number {
    return this.basePrice;
  }

  getNameVi(): string | undefined {
    return this.nameVi;
  }
}

export { SizeOption };
