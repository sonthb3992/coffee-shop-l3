// import { DocumentSnapshot, QuerySnapshot, CollectionReference } from 'firebase/firestore';

class MenuItemTypeOption {
    private readonly _nameEn: string;
    public get nameEn(): string {
        return this._nameEn;
    }
    private readonly _nameVi: string;
    public get nameVi(): string {
        return this._nameVi;
    }

    constructor({ nameEn, nameVi }: { nameEn: string; nameVi: string; }) {
        this._nameEn = nameEn;
        this._nameVi = nameVi;
    }

    // static fromFirestore(snapshot: DocumentSnapshot<any>): MenuItemTypeOption {
    //     const data = snapshot.data();
    //     return new MenuItemTypeOption({
    //         nameEn: data?.nameEn,
    //         nameVi: data?.nameVi,
    //     });
    // }

    // static toFirestore(type: MenuItemTypeOption): any {
    //     return { nameEn: type.nameEn, nameVi: type.nameVi };
    // }

    // static async addMenuTypeOption(option: MenuItemTypeOption): Promise<void> {
    //     try {
    //         const menuOptionsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('menu_item_types');
    //         await menuOptionsCollection.add(MenuItemTypeOption.toFirestore(option));
    //     } catch (e) {
    //         console.error('Error adding MenuTypeOption to Firestore:', e);
    //     }
    // }

    // static async getAllMenuTypeOptions(): Promise<MenuItemTypeOption[]> {
    //     try {
    //         const menuOptionsCollection: CollectionReference<any> = FirebaseFirestore.instance.collection('menu_item_types');
    //         const snapshot: QuerySnapshot<any> = await menuOptionsCollection.get();
    //         const menuTypeOptions: MenuItemTypeOption[] = snapshot.docs
    //             .map((doc) => MenuItemTypeOption.fromFirestore(doc));
    //         return menuTypeOptions;
    //     } catch (e) {
    //         console.error('Error getting MenuTypeOptions from Firestore:', e);
    //         return [];
    //     }
    // }
}

export { MenuItemTypeOption }