import { OrderDecorator } from "./base_decorator";
import { OrderBase } from "./base_order";
import { ToppingOption } from "./option_topping";

class ToppingDecorator extends OrderDecorator {
    private toppingMap: Map<ToppingOption, number>;

    constructor(orderBase: OrderBase, toppingMap: Map<ToppingOption, number>) {
        super(orderBase);
        this.toppingMap = toppingMap;
    }

    getDescription(): string {
        //const en = Get.locale?.countryCode === 'en';
        //const en = Get.locale?.countryCode === 'en';
        const option: ToppingOption = Array.from(this.toppingMap.keys())[0];
        const count: number = Array.from(this.toppingMap.values())[0];

        let result: string = `${this.decoratedOrder.getDescription()}, ${true ? option.nameEn : option.nameVi}`;
        if (count > 1) {
            result += `(${count})`;
        }
        return result;

    }

    getPrice(): number {
        const option: ToppingOption = Array.from(this.toppingMap.keys())[0];
        const count: number = Array.from(this.toppingMap.values())[0];
        return this.decoratedOrder.getPrice() + option.getCountPrice(count);
    }
}

export { ToppingDecorator }