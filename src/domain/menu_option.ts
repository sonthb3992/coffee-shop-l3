// import { DocumentSnapshot, QuerySnapshot, CollectionReference, Query } from 'firebase/firestore';
// import { SnapshotOptions } from 'firebase/database';
import { CollectionReference, DocumentSnapshot, SnapshotOptions, getFirestore, addDoc, getDocs, collection, query, where, setDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { OptionBase } from "./base_option";
import { app } from './firebase';


class MenuOption extends OptionBase {

    nameEn: string = '';
    nameVi: string = '';
    type: string = '';
    basePrice: number = 0;
    imageUrl: string = '';
    availableStyles?: string[];
    availableSizes?: string[];
    availableToppings?: string[];

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

    static fromFirestore(
        snapshot: DocumentSnapshot<any>,
        options: SnapshotOptions | undefined,
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

        return new MenuOption({
            nameEn: data?.nameEn,
            nameVi: data?.nameVi,
            basePrice: parseFloat(data!.basePrice.toString()),
            type: data.type,
            imageUrl: data.imageUrl,
            availableStyles: styles,
            availableSizes: sizes,
            availableToppings: toppings,
        });
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
        };
    }

    static async pushToFirebase(option: MenuOption | null): Promise<string> {
        try {
            const db = getFirestore(app);
            const menuOptionRef = collection(db, "menu_options");

            // Create a query against the collection.
            const q = query(menuOptionRef, where("nameEn", "==", option?.nameEn));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return "Another menu item with the same name already existed.";
            }

            if (option == null)
                return "Null menu option.";

            await setDoc(doc(db, "menu_options"), MenuOption.toFirestore(option));
            return "success";

        } catch (e) {
            return 'Error adding Menu option to Firestore: ' + e;
        }
    }

    static async getAll(): Promise<MenuOption[]> {
        try {
            const db = getFirestore(app);
            const menuOptionRef = collection(db, "menu_options");

            // Create a query against the collection.
            const querySnapshot = await getDocs(menuOptionRef);

            if (querySnapshot.empty) {
                return [];
            }

            var result = querySnapshot.docs.map(m => MenuOption.fromFirestore(m, undefined));

            return result;

        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async getOption(optionId: string | undefined): Promise<MenuOption | null> {
        if (optionId == undefined) { return null; }

        try {
            const db = getFirestore(app);
            const menuOptionRef = collection(db, "menu_options");

            // Create a query against the collection.
            const q = query(menuOptionRef, where("nameEn", "==", optionId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            var result = querySnapshot.docs.map(m => MenuOption.fromFirestore(m, undefined));

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

export { MenuOption }