import { MenuOption } from "./menu_option";

abstract class OrderBase {
    abstract getDescription(): string;
    abstract getPrice(): number;
    abstract getType(): string;
    abstract getBaseItem(): MenuOption;
}

export { OrderBase }