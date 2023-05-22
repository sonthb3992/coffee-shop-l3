import { MenuOption } from "./menu_option";

abstract class ItemBase {
    abstract getDescription(): string;
    abstract getPrice(): number;
    abstract getType(): string;
    abstract getBaseItem(): MenuOption;
}

export { ItemBase as ItemBase }