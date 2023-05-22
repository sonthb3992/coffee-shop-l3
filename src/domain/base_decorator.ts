import { ItemBase } from "./base_order";
import { MenuOption } from "./menu_option";

abstract class OrderDecorator implements ItemBase {
    decoratedOrder: ItemBase;
    basePrice: number = 0;

    constructor(decoratedOrder: ItemBase) {
        this.decoratedOrder = decoratedOrder;
    }

    getDescription(): string {
        return this.decoratedOrder.getDescription();
    }

    getPrice(): number {
        return this.decoratedOrder.getPrice() + this.basePrice;
    }

    getType(): string {
        return this.decoratedOrder.getType();
    }

    getBaseItem(): MenuOption {
        return this.decoratedOrder.getBaseItem();
    }
}

export { OrderDecorator }
