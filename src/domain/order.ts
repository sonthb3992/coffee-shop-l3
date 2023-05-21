import { OrderBase } from "./base_order";
import { MenuOption } from "./menu_option";

class Order extends OrderBase {
    private _menuOption: MenuOption;

    constructor(menuOption: MenuOption) {
        super();
        this._menuOption = menuOption;
    }

    getDescription(): string {
        return this._menuOption.nameEn;
    }

    getPrice(): number {
        return this._menuOption.basePrice;
    }

    getType(): string {
        return this._menuOption.type;
    }

    getBaseItem(): MenuOption {
        return this._menuOption;
    }
}

export { Order }