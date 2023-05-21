import { OrderDecorator } from "./base_decorator";
import { OrderBase } from "./base_order";
import { SizeOption } from "./option_size";

class SizeDecorator extends OrderDecorator {
    private size: SizeOption;

    constructor(orderBase: OrderBase, size: SizeOption) {
        super(orderBase);
        this.size = size;
    }

    getDescription(): string {
        // const en = Get.locale?.countryCode === 'en';
        return `${this.decoratedOrder.getDescription()}, ${'size'} ${true ? this.size.nameEn : this.size.nameVi}`;
    }

    getPrice(): number {
        return this.decoratedOrder.getPrice() + this.size.basePrice;
    }
}

export { SizeDecorator }