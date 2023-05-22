import { OrderItem } from "./selected_item";

class Order {

    items: OrderItem[] = [];
    orderCount: number = this.items.length;
    address: string = '';
    phoneNumber: string = '';
    status: string = '';
    receiver: string = '';

}

export { Order }