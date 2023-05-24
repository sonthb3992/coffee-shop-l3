import { ItemBase } from "./base_order_item";
import { SizeDecorator } from "./decorator_size";
import { StyleDecorator } from "./decorator_style";
import { ToppingDecorator } from "./decorator_topping";
import { MenuOption } from "./menu_option";
import { SizeOption } from "./option_size";
import { StyleOption } from "./option_stype";
import { ToppingOption } from "./option_topping";

class OrderItem implements ItemBase {

    constructor(
        id: string | undefined,
        menuOption: MenuOption | null | undefined,
        selectedStyle: StyleOption | null | undefined,
        selectedSize: SizeOption | null | undefined,
        selectedToppings: ToppingOption[] | null | undefined,
        quantity: number | undefined,
        price: number | undefined,
    ) {
        this.id = id;
        this.menuOption = menuOption;
        this.selectedStyle = selectedStyle;
        this.selectedSize = selectedSize;
        this.selectedToppings = selectedToppings;
        this.quantity = quantity;
        this.price = price;
    }



    selectedStyle: StyleOption | null | undefined;
    selectedSize: SizeOption | null | undefined;
    selectedToppings: ToppingOption[] | null | undefined;
    menuOption: MenuOption | null | undefined;
    quantity: number | undefined;
    price: number | undefined;
    id: string | undefined;

    getDescription(): string {
        return this.menuOption?.nameEn ?? '';
    }
    getPrice(): number {
        return this.menuOption?.basePrice ?? 0;
    }
    getType(): string {
        return this.menuOption?.type ?? '';
    }
    getBaseItem(): MenuOption {
        return this.menuOption!;
    }
}



const buildOrder = (item: OrderItem): ItemBase => {
    var ib = item as ItemBase;

    if (item.selectedStyle) {
        ib = new StyleDecorator(ib, item.selectedStyle!);
    }
    if (item.selectedStyle) {
        ib = new SizeDecorator(ib, item.selectedSize!);
    }
    if (item.selectedToppings) {
        item.selectedToppings.forEach((t) => {
            ib = new ToppingDecorator(ib, t, 1);
        });
    }
    return item;
}

const getDescription = (item: OrderItem): string => {
    let description = "";

    if (item.menuOption) {
        description += `${item.menuOption.nameEn}, `;
    }

    if (item.selectedStyle) {
        description += `${item.selectedStyle.nameEn}, `;
    }

    if (item.selectedSize) {
        description += `size ${item.selectedSize.nameEn}, `;
    }

    if (item.selectedToppings) {
        const toppingNames = item.selectedToppings.map(topping => topping.nameEn);
        description += `${toppingNames.join(", ")} `;
    }
    return description;
}

const getDescriptionVi = (item: OrderItem): string => {
    let description = "";

    if (item.menuOption) {
        description += `${item.menuOption.nameVi}, `;
    }

    if (item.selectedStyle) {
        description += `${item.selectedStyle.nameVi}, `;
    }

    if (item.selectedSize) {
        description += `size ${item.selectedSize.nameVi}, `;
    }

    if (item.selectedToppings) {
        const toppingNames = item.selectedToppings.map(topping => topping.nameVi);
        description += `${toppingNames.join(", ")} `;
    }
    return description;
}

const calculatePrice = (item: OrderItem) => {
    let price = 0;
    if (!item.menuOption) return price;

    price += item.menuOption.basePrice;
    if (item.selectedStyle) {
        price += item.selectedStyle.basePrice;
    }

    if (item.selectedSize) {
        price += item.selectedSize.basePrice;
    }

    if (item.selectedToppings) {
        item.selectedToppings.forEach((t) => price += t.basePrice);
    }
    if (item.quantity)
        price *= item.quantity;
    return price;
}

export { OrderItem as OrderItem }
export { getDescription }
export { getDescriptionVi }
export { calculatePrice }
export { buildOrder }