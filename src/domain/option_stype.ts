import {
  DocumentSnapshot,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { OptionBase } from './base_option';
import { SizeOption } from './option_size';
import { app } from './firebase';

class StyleOption extends OptionBase {
  readonly nameEn: string;
  readonly nameVi: string;
  readonly basePrice: number;
  readonly availableSizes?: string[];

  private static _allOptions: StyleOption[] = [];
  static allStyleOptions: StyleOption[];

  constructor({
    nameEn,
    nameVi,
    basePrice,
    availableSizes,
  }: {
    nameEn: string;
    nameVi: string;
    basePrice: number;
    availableSizes?: string[];
  }) {
    super();
    this.nameEn = nameEn;
    this.nameVi = nameVi;
    this.basePrice = basePrice;
    this.availableSizes = availableSizes;
  }

  getName(): string | undefined {
    return this.nameEn;
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  static fromFirestore(snapshot: DocumentSnapshot<any>): StyleOption {
    const data = snapshot.data();
    return new StyleOption({
      nameEn: data?.nameEn,
      nameVi: data?.nameVi,
      basePrice: parseFloat(data?.basePrice?.toString() ?? '0'),
      availableSizes: data?.availableSizes,
    });
  }

  static toFirestore(option: StyleOption): any {
    return {
      nameEn: option.nameEn,
      nameVi: option.nameVi,
      basePrice: option.basePrice,
      availableSizes: option.availableSizes,
    };
  }

  static async pushToFirebase(option: StyleOption): Promise<string> {
    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'style_options');

      // Create a query against the collection.
      const q = query(menuOptionRef, where('nameEn', '==', option?.nameEn));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return 'Another style option with the same name already existed.';
      }

      if (option == null) return 'Null style option.';

      await setDoc(doc(db, 'style_options'), StyleOption.toFirestore(option));
      return 'success';
    } catch (e) {
      return 'Error adding style option to Firestore: ' + e;
    }
  }

  static async getAll(): Promise<StyleOption[]> {
    try {
      if (
        StyleOption.allStyleOptions &&
        StyleOption.allStyleOptions.length > 0
      ) {
        return StyleOption.allStyleOptions;
      }

      const db = getFirestore(app);
      const styleOptionRef = collection(db, 'style_options');

      console.log('Read style_options from firebase');
      const querySnapshot = await getDocs(styleOptionRef);

      if (querySnapshot.empty) {
        console.log('Query snapshot is empty');
        return [];
      }

      const styleOptions = querySnapshot.docs.map((doc) =>
        StyleOption.fromFirestore(doc)
      );

      // const unsubscribe = onSnapshot(styleOptionRef, (updatedSnapshot) => {
      //   const updatedStyleOptions = updatedSnapshot.docs.map((doc) =>
      //     StyleOption.fromFirestore(doc)
      //   );
      //   StyleOption.allStyleOptions = updatedStyleOptions;
      // });

      StyleOption.allStyleOptions = styleOptions;

      return styleOptions;
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

export { StyleOption };
