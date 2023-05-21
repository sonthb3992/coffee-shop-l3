// import { DocumentSnapshot, QuerySnapshot, CollectionReference, Query } from 'firebase/firestore';
// import { SnapshotOptions } from 'firebase/database';

import { OptionBase } from "./base_option";


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

    // static fromFirestore(
    //     snapshot: DocumentSnapshot<any>,
    //     options: SnapshotOptions | undefined,
    // ): MenuOption {
    //     const data = snapshot.data();

    //     let styles: string[] | undefined;
    //     if (data?.availableStyles) {
    //         const availableStyles = data.availableStyles as any[];
    //         styles = availableStyles.map((e) => e.toString());
    //     }
    //     let sizes: string[] | undefined;
    //     if (data?.availableSizes) {
    //         const availableSizes = data.availableSizes as any[];
    //         sizes = availableSizes.map((e) => e.toString());
    //     }
    //     let toppings: string[] | undefined;
    //     if (data?.availableToppings) {
    //         const availableToppings = data.availableToppings as any[];
    //         toppings = availableToppings.map((e) => e.toString());
    //     }

    //     return new MenuOption({
    //         nameEn: data?.nameEn,
    //         nameVi: data?.nameVi,
    //         basePrice: parseFloat(data!.basePrice.toString()),
    //         type: data.type,
    //         imageUrl: data.imageUrl,
    //         availableStyles: styles,
    //         availableSizes: sizes,
    //         availableToppings: toppings,
    //     });
    // }

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

    // static async pushToFirebase(option: MenuOption): Promise<string> {
    //     try {
    //         const menuOptionCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('menu_options');

    //         const existingOptionsSnapshot: QuerySnapshot<any> = await menuOptionCollection
    //             .where('nameEn', '==', option.nameEn)
    //             .get();

    //         if (existingOptionsSnapshot.empty) {
    //             await menuOptionCollection.add(MenuOption.toFirestore(option));
    //             return "success";
    //         } else {
    //             return 'Menu option with the same name already exists';
    //         }
    //     } catch (e) {
    //         return 'Error adding Menu option to Firestore: ' + e;
    //     }
    // }

    // static async getAll(): Promise<MenuOption[]> {
    //     try {
    //         const menuOptionsCollection: Query<any> = FirebaseFirestore.instance
    //             .collection('menu_options')
    //             .orderBy("type")
    //             .orderBy("nameEn");

    //         const snapshot: QuerySnapshot<any> = await menuOptionsCollection.get();

    //         const menuOptions: MenuOption[] = snapshot.docs
    //             .map((doc) => MenuOption.fromFirestore(doc, null));
    //         return menuOptions;
    //     } catch (e) {
    //         if (kDebugMode) {
    //             console.log('Error getting Menu options from Firestore: ' + e);
    //         }
    //         return [];
    //     }
    // }

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