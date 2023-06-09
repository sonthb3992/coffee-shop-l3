// import { DocumentSnapshot, QuerySnapshot, CollectionReference, Query } from 'firebase/firestore';
// import { SnapshotOptions } from 'firebase/database';
import {
  DocumentSnapshot,
  SnapshotOptions,
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { OptionBase } from './base_option';
import { app } from './firebase';
import { Review, ReviewFromFirestore, ReviewToFirestore } from './review';

class MenuOption extends OptionBase {
  nameEn: string = '';
  nameVi: string = '';
  type: string = '';
  basePrice: number = 0;
  imageUrl: string = '';
  availableStyles?: string[];
  availableSizes?: string[];
  availableToppings?: string[];
  likeCount: number = 0;
  dislikeCount: number = 0;
  uid: string = '';

  constructor({
    nameEn = '',
    nameVi = '',
    type = '',
    basePrice = 0,
    imageUrl = '',
    availableStyles,
    availableSizes,
    availableToppings,
  }: {
    nameEn?: string;
    nameVi?: string;
    type?: string;
    basePrice?: number;
    imageUrl?: string;
    availableStyles?: string[] | null;
    availableSizes?: string[] | null;
    availableToppings?: string[] | null;
  }) {
    super();
    this.nameEn = nameEn;
    this.nameVi = nameVi;
    this.type = type;
    this.basePrice = basePrice;
    this.imageUrl = imageUrl;
    this.availableStyles = availableStyles || [];
    this.availableSizes = availableSizes || [];
    this.availableToppings = availableToppings || [];
  }

  static allMenuOptions: MenuOption[];

  static fromFirestore(
    snapshot: DocumentSnapshot<any>,
    options: SnapshotOptions | undefined
  ): MenuOption {
    const data = snapshot.data();

    let styles: string[] | undefined;
    if (data?.availableStyles) {
      const availableStyles = data.availableStyles as any[];
      styles = availableStyles.map((e) => e.toString());
    }
    let sizes: string[] | undefined;
    if (data?.availableSizes) {
      const availableSizes = data.availableSizes as any[];
      sizes = availableSizes.map((e) => e.toString());
    }
    let toppings: string[] | undefined;
    if (data?.availableToppings) {
      const availableToppings = data.availableToppings as any[];
      toppings = availableToppings.map((e) => e.toString());
    }

    const option = new MenuOption({
      nameEn: data?.nameEn,
      nameVi: data?.nameVi,
      basePrice: parseFloat(data!.basePrice.toString()),
      type: data.type,
      imageUrl: data.imageUrl,
      availableStyles: styles,
      availableSizes: sizes,
      availableToppings: toppings,
    });

    if (data?.likeCount) {
      option.likeCount = parseInt(data?.likeCount.toString());
    }

    if (data?.dislikeCount) {
      option.dislikeCount = parseInt(data?.likeCount.toString());
    }
    console.log(snapshot.id);
    option.uid = snapshot.id;
    return option;
  }

  static toFirestore(option: MenuOption): any {
    return {
      nameEn: option.nameEn,
      nameVi: option.nameVi,
      basePrice: option.basePrice,
      type: option.type,
      imageUrl: option.imageUrl,
      availableStyles: option.availableStyles,
      availableSizes: option.availableSizes,
      availableToppings: option.availableToppings,
      likeCount: option.likeCount,
      dislikeCount: option.dislikeCount,
    };
  }

  static async pushToFirebase(option: MenuOption | null): Promise<string> {
    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'menu_options');

      // Create a query against the collection.
      const q = query(menuOptionRef, where('nameEn', '==', option?.nameEn));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return 'Another menu item with the same name already existed.';
      }

      if (option == null) return 'Null menu option.';

      await setDoc(doc(db, 'menu_options'), MenuOption.toFirestore(option));
      return 'success';
    } catch (e) {
      return 'Error adding Menu option to Firestore: ' + e;
    }
  }

  static async updateToFirebase(option: MenuOption | null): Promise<string> {
    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'menu_options');

      // Create a query against the collection.
      const q = query(menuOptionRef, where('nameEn', '==', option?.nameEn));
      const querySnapshot = await getDocs(q);

      if (option == null) return 'Null menu option.';

      await setDoc(doc(db, 'menu_options'), MenuOption.toFirestore(option));
      return 'success';
    } catch (e) {
      return 'Error adding Menu option to Firestore: ' + e;
    }
  }

  static async addReview(option: MenuOption, review: Review): Promise<boolean> {
    console.log(option);
    if (!option.uid || option.uid === '') return false;

    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(
        db,
        'menu_options',
        option.uid,
        'reviews'
      );
      const reviewDoc = doc(menuOptionRef);
      await setDoc(reviewDoc, ReviewToFirestore(review));
      return true;
    } catch (e) {
      console.log('Error adding Menu option to Firestore: ' + e);
      return false;
    }
  }

  static async getAll(): Promise<MenuOption[]> {
    try {
      if (MenuOption.allMenuOptions && MenuOption.allMenuOptions.length > 0) {
        return MenuOption.allMenuOptions;
      }

      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'menu_options');
      const q = query(menuOptionRef);

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('Query snapshot is empty');
        return [];
      }

      const menuOptions = querySnapshot.docs.map((doc) =>
        MenuOption.fromFirestore(doc, undefined)
      );

      const unsubscribe = onSnapshot(q, (updatedSnapshot) => {
        const updatedMenuOptions = updatedSnapshot.docs.map((doc) =>
          MenuOption.fromFirestore(doc, undefined)
        );
        MenuOption.allMenuOptions = updatedMenuOptions;
      });

      MenuOption.allMenuOptions = menuOptions;

      return menuOptions;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static currentItemReviews: {
    menuOptionUid: string;
    reviews: Review[];
  } = {
    menuOptionUid: '',
    reviews: [],
  };

  static async getReviews(menuOptionUid: string): Promise<Review[]> {
    try {
      if (
        MenuOption.currentItemReviews.menuOptionUid === menuOptionUid &&
        MenuOption.currentItemReviews.reviews.length > 0
      ) {
        return MenuOption.currentItemReviews.reviews;
      }

      const db = getFirestore(app);
      const reviewCollectionRef = collection(
        db,
        'menu_options',
        menuOptionUid,
        'reviews'
      );
      const _query = query(
        reviewCollectionRef,
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(_query);
      if (querySnapshot.empty) {
        console.log('Query snapshot is empty');
        return [];
      }

      const reviews = querySnapshot.docs.map((doc) => ReviewFromFirestore(doc));

      const unsubscribe = onSnapshot(_query, (updatedSnapshot) => {
        const updatedReviews = updatedSnapshot.docs.map((doc) =>
          ReviewFromFirestore(doc)
        );
        MenuOption.currentItemReviews = {
          menuOptionUid: menuOptionUid,
          reviews: updatedReviews,
        };
      });

      MenuOption.currentItemReviews = {
        menuOptionUid: menuOptionUid,
        reviews: reviews,
      };

      return reviews;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getOption(
    optionId: string | undefined
  ): Promise<MenuOption | null> {
    if (optionId === undefined) {
      return null;
    }

    try {
      const db = getFirestore(app);
      const menuOptionRef = collection(db, 'menu_options');

      // Create a query against the collection.
      const q = query(menuOptionRef, where('nameEn', '==', optionId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      var result = querySnapshot.docs.map((m) =>
        MenuOption.fromFirestore(m, undefined)
      );

      return result[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getName(): string | undefined {
    return this.nameEn;
  }

  getNameVi(): string | undefined {
    return this.nameVi;
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  getCountPrice(count: number): number {
    return this.basePrice;
  }
}

export { MenuOption };
