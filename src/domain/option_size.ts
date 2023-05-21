// import { DocumentSnapshot, QuerySnapshot, CollectionReference } from 'firebase/firestore';
// import { OptionBase } from 'path/to/option_base';
// import { kDebugMode } from 'path/to/flutter';

import { OptionBase } from "./base_option";

class SizeOption extends OptionBase {
    readonly nameEn: string;
    readonly nameVi: string;
    readonly basePrice: number;
    readonly displayOrder: number;

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

    // static fromFirestore(snapshot: DocumentSnapshot<any>): SizeOption {
    //     const data = snapshot.data();
    //     return new SizeOption({
    //         nameEn: data?.nameEn,
    //         nameVi: data?.nameVi,
    //         basePrice: parseFloat(data?.basePrice?.toString() ?? '0'),
    //         displayOrder: parseInt(data?.displayOrder?.toString() ?? '0', 10),
    //     });
    // }

    // static toFirestore(option: SizeOption): any {
    //     return {
    //         nameEn: option.nameEn,
    //         nameVi: option.nameVi,
    //         basePrice: option.basePrice,
    //         displayOrder: option.displayOrder,
    //     };
    // }

    // static async pushToFirebase(option: SizeOption): Promise<string> {
    //     try {
    //         const sizeOptionsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('size_options');
    //         const existingOptionsSnapshot: QuerySnapshot<any> = await sizeOptionsCollection
    //             .where('nameEn', '==', option.nameEn)
    //             .get();

    //         if (existingOptionsSnapshot.empty) {
    //             await sizeOptionsCollection.add(SizeOption.toFirestore(option));
    //             return 'success';
    //         } else {
    //             return 'Size Option with the same name already exists';
    //         }
    //     } catch (e) {
    //         return 'Error adding Size Option to Firestore: ' + e;
    //     }
    // }

    // static async getAll(): Promise<SizeOption[]> {
    //     try {
    //         const styleOptionsCollection: Query<Map<string, any>> = FirebaseFirestore.instance
    //             .collection('size_options')
    //             .orderBy('displayOrder');

    //         const snapshot: QuerySnapshot<Map<string, any>> = await styleOptionsCollection.get();
    //         const sizeOptions: SizeOption[] = snapshot.docs.map((doc) => SizeOption.fromFirestore(doc));
    //         return sizeOptions;
    //     } catch (e) {
    //         if (kDebugMode) {
    //             console.log('Error getting Size Options from Firestore: ' + e);
    //         }
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

export { SizeOption }