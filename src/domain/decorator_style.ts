import { OrderDecorator } from "./base_decorator";
import { ItemBase } from "./base_order";
import { StyleOption } from "./option_stype";

class StyleDecorator extends OrderDecorator {
    private style: StyleOption;

    constructor(orderBase: ItemBase, style: StyleOption) {
        super(orderBase);
        this.style = style;
    }

    getDescription(): string {
        //const en = Get.locale?.countryCode === 'en';
        return `${this.decoratedOrder.getDescription()}, ${true ? this.style.nameEn : this.style.nameVi}`;
    }

    getPrice(): number {
        return this.decoratedOrder.getPrice() + this.style.basePrice;
    }
}

export { StyleDecorator }