// import { DocumentSnapshot, QuerySnapshot, CollectionReference } from 'firebase/firestore';
// import { OptionBase } from 'path/to/option_base';
// import { kDebugMode } from 'path/to/flutter';

import { CollectionReference, DocumentSnapshot, QuerySnapshot, collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { OptionBase } from "./base_option";
import { app } from "./firebase";

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
        });
    }

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

    static async pushToFirebase(option: ToppingOption): Promise<string> {

        try {
            const db = getFirestore(app);
            const toppingOptionsRef = collection(db, "toppings");

            // Create a query against the collection.
            const q = query(toppingOptionsRef, where("nameEn", "==", option?.nameEn));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return "Another topping_options with the same name already existed.";
            }

            if (option == null)
                return "Null topping_options.";

            await setDoc(doc(db, "toppings"), ToppingOption.toFirestore(option));
            return "success";

        } catch (e) {
            return 'Error adding topping_options to Firestore: ' + e;
        }
    }

    static async getAll(): Promise<ToppingOption[]> {
        try {
            const db = getFirestore(app);
            const toppingOptionRef = collection(db, "toppings");

            // Create a query against the collection.
            const querySnapshot = await getDocs(toppingOptionRef);

            if (querySnapshot.empty) {
                return [];
            }

            var result = querySnapshot.docs.map(m => ToppingOption.fromFirestore(m));
            return result;

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

export { ToppingOption }