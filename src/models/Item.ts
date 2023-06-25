export interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    availableQuantity: number;
    categoryId: string;
    // itemOptions: ItemOption[];
  }
  
export interface ItemOption {
    id: string;
    name: string;
    value: string;
  }

  function camelToSnake(str: string) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }