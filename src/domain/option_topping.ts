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
import { app } from './firebase';

class ToppingOption extends OptionBase {
  readonly nameEn: string;
  readonly nameVi: string;
  readonly basePrice: number;
  readonly maxCount: number;
  readonly freeCount: number;
  readonly acceptStyles?: string[] | null;

  constructor({
    nameEn,
    nameVi,
    basePrice,
    maxCount,
    freeCount,
    acceptStyles,
  }: {
    nameEn: string;
    nameVi: string;
    basePrice: number;
    maxCount: number;
    freeCount: number;
    acceptStyles: string[] | null;
  }) {
    super();
    this.nameEn = nameEn;
    this.nameVi = nameVi;
    this.basePrice = basePrice;
    this.maxCount = maxCount;
    this.freeCount = freeCount;
    this.acceptStyles = acceptStyles;
  }

  getName(): string | undefined {
    return this.nameEn;
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  static fromFirestore(snapshot: DocumentSnapshot<any>): ToppingOption {
    const data = snapshot.data();

    if (!data) {
      return ToppingOption.empty();
    }
    return new ToppingOption({
      nameEn: data.nameEn,
      nameVi: data.nameVi,
      basePrice: parseFloat(data.basePrice.toString()),
      maxCount: parseInt(data.maxCount.toString(), 10),
      freeCount: parseInt(data.freeCount.toString(), 10),
      acceptStyles: data.acceptStyles,
    });
  }

  static empty(): ToppingOption {
    return new ToppingOption({
      nameEn: '',
      nameVi: '',
      basePrice: 0,
      maxCount: 0,
      freeCount: 0,
      acceptStyles: null,
    });
  }

  static toFirestore(topping: ToppingOption): any {
    return {
      nameEn: topping.nameEn,
      nameVi: topping.nameVi,
      basePrice: topping.basePrice,
      maxCount: topping.maxCount,
      freeCount: topping.freeCount,
      accepStyles: topping.acceptStyles,
    };
  }

  static async pushToFirebase(option: ToppingOption): Promise<string> {
    try {
      const db = getFirestore(app);
      const toppingOptionsRef = collection(db, 'toppings');

      // Create a query against the collection.
      const q = query(toppingOptionsRef, where('nameEn', '==', option?.nameEn));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return 'Another topping_options with the same name already existed.';
      }

      if (option == null) return 'Null topping_options.';

      await setDoc(doc(db, 'toppings'), ToppingOption.toFirestore(option));
      return 'success';
    } catch (e) {
      return 'Error adding topping_options to Firestore: ' + e;
    }
  }

  static allToppingOptions: ToppingOption[] | null = null;

  static async getAll(): Promise<ToppingOption[]> {
    try {
      if (
        ToppingOption.allToppingOptions &&
        ToppingOption.allToppingOptions.length > 0
      ) {
        return ToppingOption.allToppingOptions;
      }

      const db = getFirestore(app);
      const toppingOptionsRef = collection(db, 'toppings');
      const _query = query(toppingOptionsRef);

      const querySnapshot = await getDocs(_query);

      if (querySnapshot.empty) {
        return [];
      }

      const toppingOptions = querySnapshot.docs.map((doc) =>
        ToppingOption.fromFirestore(doc)
      );

      const unsubscribe = onSnapshot(_query, (updatedSnapshot) => {
        const updatedToppingOptions = updatedSnapshot.docs.map((doc) =>
          ToppingOption.fromFirestore(doc)
        );
        ToppingOption.allToppingOptions = updatedToppingOptions;
      });

      ToppingOption.allToppingOptions = toppingOptions;

      return toppingOptions;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  getCountPrice(count: number): number {
    return Math.max(count - this.freeCount, 0) * this.basePrice;
  }

  getNameVi(): string | undefined {
    return this.nameVi;
  }
}

export { ToppingOption };
