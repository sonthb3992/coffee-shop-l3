import { OrderItem, calculatePrice } from "./selected_item";
import { CollectionReference, DocumentSnapshot, onSnapshot, SnapshotOptions, getFirestore, addDoc, getDocs, collection, query, where, setDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { app } from './firebase';
import { ItemBase } from "./base_order_item";
import { taxRate } from "./settings";

class Order {

    items: OrderItem[] = [];
    orderCount: number = this.items.length;
    address: string = '';
    phoneNumber: string = '';
    status: number = 0;
    receiver: string = '';
    id: string = '';
    price: number = 0;
    placeTime: Date = new Date(0, 0, 0);
    confirmTime: Date = new Date(0, 0, 0);
    processTime: Date = new Date(0, 0, 0);
    completeTime: Date = new Date(0, 0, 0);
    cancelTime: Date = new Date(0, 0, 0);
    itemcount: number = 0;

    constructor() {
    }

    static fromFirestore(
        snapshot: DocumentSnapshot<any>,
        options: SnapshotOptions | undefined,
    ): Order {
        const data = snapshot.data();
        const order = new Order();
        order.id = data['id'];
        order.address = data['address'];
        order.phoneNumber = data['phone'];
        order.items = JSON.parse(data['items']);
        order.receiver = data['customerName'];
        order.status = data['status'];
        order.price = data['price'];
        return order;
    }

    static calculateSubTotal = (items: OrderItem[]) => {
        var total = 0;
        items.forEach((i) => total += calculatePrice(i));
        return total;
    }

    static calculateTax = (subtotal: number) => {
        return subtotal * taxRate;
    }

    static calculateTotal = (items: OrderItem[]) => {
        var total = Order.calculateSubTotal(items);
        total += Order.calculateTax(total);
        return total;
    }


    static toFirestore(order: Order): any {
        return {
            items: JSON.stringify(order.items),
            address: order.address,
            phone: order.phoneNumber,
            customerName: order.receiver,
            id: order.id,
            status: order.status,
            price: order.price,
            placeTime: order.placeTime,
            confirmTime: order.confirmTime,
            processTime: order.processTime,
            completeTime: order.completeTime
        };
    }

    static async pushToFirebase(order: Order | null): Promise<string> {
        try {
            const db = getFirestore(app);
            const menuOptionRef = collection(db, 'orders');

            // Create a query against the collection.
            const _query = query(menuOptionRef, where("id", "==", order?.id));
            const querySnapshot = await getDocs(_query);
            if (!querySnapshot.empty) {
                return "Another order with the same id already exists.";
            }

            if (order == null)
                return "Null orders.";

            const docRef = doc(db, "orders", order.id);
            await setDoc(docRef, Order.toFirestore(order));
            return "success";
        } catch (e) {
            return 'Error adding Menu option to Firestore: ' + e;
        }
    }

    static async updateToFirebase(order: Order): Promise<string> {
        try {
            const db = getFirestore(app);
            const docRef = doc(db, "orders", order.id);
            await setDoc(docRef, Order.toFirestore(order));
            return "success";
        } catch (e) {
            return 'Error adding Menu option to Firestore: ' + e;
        }
    }


    static async getAllOrders(callback: (value: any) => void): Promise<{ orders: Order[], unsub: any } | null> {
        try {
            const db = getFirestore(app);
            const ref = collection(db, "orders");
            const q = query(ref, where("status", ">=", 0), where("status", "<", 4));
            const querySnapshot = await getDocs(q);

            const orders = querySnapshot.docs.map((doc) => Order.fromFirestore(doc, undefined));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const orders = querySnapshot.docs.map((doc) => Order.fromFirestore(doc, undefined));
                callback(orders);
            });


            return {
                orders: orders,
                unsub: unsubscribe
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    static async getOrdersOfCustomer(customerName: string, phoneNumber: string, callback: (value: any) => void): Promise<{ orders: Order[], unsub: any } | null> {
        try {
            const db = getFirestore(app);
            const ref = collection(db, "orders");
            const _query = query(ref, where("phone", "==", phoneNumber), where("customerName", "==", customerName));

            const querySnapshot = await getDocs(_query);
            const orders = querySnapshot.docs.map((doc) => Order.fromFirestore(doc, undefined));

            const unsubscribe = onSnapshot(_query, (querySnapshot) => {
                const orders = querySnapshot.docs.map((doc) => Order.fromFirestore(doc, undefined));
                callback(orders);
            });

            return {
                orders: orders,
                unsub: unsubscribe
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static sentToNextStep(item: Order): Promise<string> {
        item.status += 1;
        return Order.updateToFirebase(item);
    }

    static cancelOrder(item: Order): Promise<string> {
        item.status = -1;
        item.cancelTime = new Date(Date.now());
        return Order.updateToFirebase(item);
    }

    // static async getAll(): Promise<MenuOption[]> {
    //     try {
    //         const db = getFirestore(app);
    //         const menuOptionRef = collection(db, "menu_options");

    //         // Create a query against the collection.
    //         const querySnapshot = await getDocs(menuOptionRef);

    //         if (querySnapshot.empty) {
    //             return [];
    //         }

    //         var result = querySnapshot.docs.map(m => MenuOption.fromFirestore(m, undefined));

    //         return result;

    //     } catch (e) {
    //         console.log(e);
    //         return [];
    //     }
    // }

    static async getOrderById(optionId: string | undefined, listenToChanged: boolean, callback: (value: any) => void): Promise<{ order: Order | null, unsub: any | null } | null> {
        if (optionId == undefined) { return null; }

        try {
            const db = getFirestore(app);
            const menuOptionRef = collection(db, "orders");

            // Create a query against the collection.
            const q = query(menuOptionRef, where("id", "==", optionId));

            const querySnapshot = await getDocs(q);


            if (querySnapshot.empty) {
                console.log("Query snapshot is empty");
                return null;
            }

            const order = Order.fromFirestore(querySnapshot.docs[0], undefined);
            if (listenToChanged) {
                const unsub = onSnapshot(doc(db, "orders", order.id), (doc) => {
                    callback(Order.fromFirestore(doc, undefined));
                });
                return {
                    order: order,
                    unsub: unsub
                }
            }

            return { order: order, unsub: null }

        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

export { Order }