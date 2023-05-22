import { ItemBase } from "./base_order";
import { MenuOption } from "./menu_option";
import { SizeOption } from "./option_size";
import { StyleOption } from "./option_stype";
import { ToppingOption } from "./option_topping";

abstract class OrderItem {
    menuOption: MenuOption | null | undefined;
    selectedStyle: StyleOption | null | undefined;
    selectedSize: SizeOption | null | undefined;
    selectedToppings: ToppingOption[] | null | undefined;
    quantity: number | undefined;
    price: number | undefined;
    id: string | undefined;
}

// const buildOrder = (item: OrderItem): ItemBase => {



// }

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
export { calculatePrice }