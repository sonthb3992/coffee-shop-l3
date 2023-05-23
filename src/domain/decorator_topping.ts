import { OrderDecorator } from "./base_decorator";
import { ItemBase } from "./base_order_item";
import { ToppingOption } from "./option_topping";

class ToppingDecorator extends OrderDecorator {
    private topping: ToppingOption;
    private count: number;

    constructor(orderBase: ItemBase, _topping: ToppingOption, _toppingCount: number) {
        super(orderBase);
        this.topping = _topping;
        this.count = _toppingCount;
    }

    getDescription(): string {
        let result: string = `${this.decoratedOrder.getDescription()}, ${true ? this.topping.nameEn : this.topping.nameVi}`;
        if (this.count > 1) {
            result += `(${this.count})`;
        }
        return result;
    }

    getPrice(): number {
        return this.decoratedOrder.getPrice() + this.topping.getCountPrice(this.count);
    }
}

export { ToppingDecorator }