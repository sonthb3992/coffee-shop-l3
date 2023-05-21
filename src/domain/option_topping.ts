// import { DocumentSnapshot, QuerySnapshot, CollectionReference } from 'firebase/firestore';
// import { OptionBase } from 'path/to/option_base';
// import { kDebugMode } from 'path/to/flutter';

import { OptionBase } from "./base_option";

class ToppingOption extends OptionBase {
    readonly nameEn: string;
    readonly nameVi: string;
    readonly basePrice: number;
    readonly maxCount: number;
    readonly freeCount: number;

    constructor({
        nameEn,
        nameVi,
        basePrice,
        maxCount,
        freeCount,
    }: {
        nameEn: string;
        nameVi: string;
        basePrice: number;
        maxCount: number;
        freeCount: number;
    }) {
        super();
        this.nameEn = nameEn;
        this.nameVi = nameVi;
        this.basePrice = basePrice;
        this.maxCount = maxCount;
        this.freeCount = freeCount;
    }

    getName(): string | undefined {
        return this.nameEn;
    }

    getBasePrice(): number {
        return this.basePrice;
    }

    // static fromFirestore(snapshot: DocumentSnapshot<any>): ToppingOption {
    //     const data = snapshot.data();

    //     if (!data) {
    //         return ToppingOption.empty();
    //     }
    //     return new ToppingOption({
    //         nameEn: data.nameEn,
    //         nameVi: data.nameVi,
    //         basePrice: parseFloat(data.basePrice.toString()),
    //         maxCount: parseInt(data.maxCount.toString(), 10),
    //         freeCount: parseInt(data.freeCount.toString(), 10),
    //     });
    // }

    static empty(): ToppingOption {
        return new ToppingOption({
            nameEn: '',
            nameVi: '',
            basePrice: 0,
            maxCount: 0,
            freeCount: 0,
        });
    }

    static toFirestore(topping: ToppingOption): any {
        return {
            nameEn: topping.nameEn,
            nameVi: topping.nameVi,
            basePrice: topping.basePrice,
            maxCount: topping.maxCount,
            freeCount: topping.freeCount,
        };
    }

    // static async pushToFirebase(option: ToppingOption): Promise<string> {
    //     try {
    //         const toppingsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('toppings');
    //         const existingOptionsSnapshot: QuerySnapshot<any> = await toppingsCollection
    //             .where('nameEn', '==', option.nameEn)
    //             .get();

    //         if (existingOptionsSnapshot.empty) {
    //             await toppingsCollection.add(ToppingOption.toFirestore(option));
    //             return 'success';
    //         } else {
    //             return 'Topping Option with the same name already exists';
    //         }
    //     } catch (e) {
    //         return 'Error adding Topping Option to Firestore: ' + e;
    //     }
    // }

    // static async getAll(): Promise<ToppingOption[]> {
    //     try {
    //         const toppingsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('toppings');
    //         const snapshot: QuerySnapshot<any> = await toppingsCollection.orderBy('maxCount').get();
    //         const toppingOptions: ToppingOption[] = snapshot.docs.map((doc) => ToppingOption.fromFirestore(doc));
    //         return toppingOptions;
    //     } catch (e) {
    //         if (kDebugMode) {
    //             console.log('Error getting Topping Options from Firestore: ' + e);
    //         }
    //         return [];
    //     }
    // }

    getCountPrice(count: number): number {
        return Math.max(count - this.freeCount, 0) * this.basePrice;
    }

    getNameVi(): string | undefined {
        return this.nameVi;
    }
}

export { ToppingOption }