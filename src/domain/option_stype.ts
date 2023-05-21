// import { DocumentSnapshot, QuerySnapshot, CollectionReference } from 'firebase/firestore';
// import { OptionBase } from 'path/to/option_base';
// import { kDebugMode } from 'path/to/flutter';

import { OptionBase } from "./base_option";
import { SizeOption } from "./option_size";

class StyleOption extends OptionBase {
    readonly nameEn: string;
    readonly nameVi: string;
    readonly basePrice: number;
    readonly availableSizes?: SizeOption[];

    private static _allOptions: StyleOption[] | null = null;
    // static async get allOptions(): Promise<StyleOption[] | null> {
    //     if (!StyleOption._allOptions) {
    //         StyleOption._allOptions = await StyleOption.getAll();
    //     }
    //     return StyleOption._allOptions;
    // }

    constructor({
        nameEn,
        nameVi,
        basePrice,
        availableSizes,
    }: {
        nameEn: string;
        nameVi: string;
        basePrice: number;
        availableSizes?: SizeOption[];
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

    // static fromFirestore(snapshot: DocumentSnapshot<any>): StyleOption {
    //     const data = snapshot.data();
    //     return new StyleOption({
    //         nameEn: data?.nameEn,
    //         nameVi: data?.nameVi,
    //         basePrice: parseFloat(data?.basePrice?.toString() ?? '0'),
    //         availableSizes: data?.availableSizes,
    //     });
    // }

    static toFirestore(option: StyleOption): any {
        return {
            nameEn: option.nameEn,
            nameVi: option.nameVi,
            basePrice: option.basePrice,
            availableSizes: option.availableSizes,
        };
    }

    // static async pushToFirebase(option: StyleOption): Promise<string> {
    //     try {
    //         const styleOptionsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('styles_options');
    //         const existingOptionsSnapshot: QuerySnapshot<any> = await styleOptionsCollection
    //             .where('nameEn', '==', option.nameEn)
    //             .get();

    //         if (existingOptionsSnapshot.empty) {
    //             await styleOptionsCollection.add(StyleOption.toFirestore(option));
    //             return 'success';
    //         } else {
    //             return 'Style option with the same name already exists';
    //         }
    //     } catch (e) {
    //         return 'Error adding Style Option to Firestore: ' + e;
    //     }
    // }

    // static async getAll(): Promise<StyleOption[]> {
    //     try {
    //         const styleOptionsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('style_options');
    //         const snapshot: QuerySnapshot<any> = await styleOptionsCollection.get();
    //         const styleOptions: StyleOption[] = snapshot.docs.map((doc) => StyleOption.fromFirestore(doc));
    //         return styleOptions;
    //     } catch (e) {
    //         console.log('Error getting Style Option from Firestore: ' + e);
    //         return [];
    //     }
    // }

    getCountPrice(count: number): number {
        return this.basePrice;
    }

    getNameVi(): string | undefined {
        return this.nameVi;
    }
}

export { StyleOption }