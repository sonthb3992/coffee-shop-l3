import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { RootState } from './root-reducer';
import { SizeOption } from '../domain/option_size';
import { StyleOption } from '../domain/option_stype';
import { MenuOption } from '../domain/menu_option';
import { ToppingOption } from '../domain/option_topping';
import { OrderItem } from '../domain/selected_item';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from './store';
import { addItemToCart } from './cartSlice';
import { useNavigate } from 'react-router-dom';

interface NewOrderState {
  menuItem: MenuOption | null;

  availableStyles: StyleOption[];
  availableSizes: SizeOption[];
  availableToppings: ToppingOption[];

  hasStyles: boolean;
  hasSizes: boolean;
  hasTopping: boolean;

  selectedStyle: StyleOption | null;
  selectedSize: SizeOption | null;
  selectedToppings: ToppingOption[];

  quantity: number;
  price: number;

  loading: boolean;
  error: Error | null;
}

const initialState: NewOrderState = {
  menuItem: null,
  availableStyles: [],
  availableSizes: [],
  availableToppings: [],
  selectedStyle: null,
  selectedSize: null,
  selectedToppings: [],
  hasStyles: false,
  hasSizes: false,
  hasTopping: false,
  loading: false,
  error: null,
  quantity: 1,
  price: 0,
};

const newItemSlice = createSlice({
  name: 'newItem',
  initialState,
  reducers: {
    setNewItemMenuItem: (state, action: PayloadAction<MenuOption>) => {
      state.menuItem = action.payload;
      state.price = calculate(
        action.payload,
        state.selectedStyle,
        state.selectedSize,
        state.selectedToppings,
        state.quantity
      );
    },
    setAvailableStyles: (state, action: PayloadAction<StyleOption[]>) => {
      state.availableStyles = [...action.payload];
      state.hasStyles = action.payload.length > 0;
    },
    setAvailableSizes: (state, action: PayloadAction<SizeOption[]>) => {
      state.availableSizes = [...action.payload];
      state.hasSizes = action.payload.length > 0;
    },
    setAvailableToppings: (state, action: PayloadAction<ToppingOption[]>) => {
      state.availableToppings = [...action.payload];
      state.hasTopping = action.payload.length > 0;
    },
    setSelectedStyle: (state, action: PayloadAction<StyleOption | null>) => {
      state.selectedStyle = action.payload;
      if (
        state.selectedSize &&
        !action.payload?.availableSizes?.includes(state.selectedSize.nameEn)
      ) {
        state.selectedSize = null;
      }

      state.price = calculate(
        state.menuItem,
        action.payload,
        state.selectedSize,
        state.selectedToppings,
        state.quantity
      );
    },
    setSelectedSize: (state, action: PayloadAction<SizeOption | null>) => {
      state.selectedSize = action.payload;
      state.price = calculate(
        state.menuItem,
        state.selectedStyle,
        action.payload,
        state.selectedToppings,
        state.quantity
      );
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
      state.price = calculate(
        state.menuItem,
        state.selectedStyle,
        state.selectedSize,
        state.selectedToppings,
        action.payload
      );
    },

    toggleTopping: (state, action: PayloadAction<ToppingOption>) => {
      let newToppings = [];
      if (state.selectedToppings.includes(action.payload)) {
        newToppings = state.selectedToppings.filter(
          (s) => s.nameEn !== action.payload.nameEn
        );
      } else {
        newToppings = [...state.selectedToppings, action.payload];
      }
      state.selectedToppings = [...newToppings];
      state.price = calculate(
        state.menuItem,
        state.selectedStyle,
        state.selectedSize,
        newToppings,
        state.quantity
      );
    },
    fetchNewOrderSuccess: (state, action: PayloadAction<MenuOption[]>) => {
      state.loading = false;
    },
    fetchNewOrderFailure: (state, action: PayloadAction<Error>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setNewItemMenuItem,
  setAvailableStyles,
  setAvailableSizes,
  setAvailableToppings,
  setSelectedSize,
  setSelectedStyle,
  setQuantity,
  toggleTopping,
  fetchNewOrderSuccess,
  fetchNewOrderFailure,
} = newItemSlice.actions;

export const fetchNewItemOptions = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<any>
> => {
  return async (dispatch, getState) => {
    const menuItem = getState().newItem.menuItem;
    if (!menuItem) return;

    //Fetch available styles
    try {
      const availableStyles = await fetchAvailableStyles(menuItem);
      dispatch(setAvailableStyles(availableStyles));
    } catch (error: any) {
      dispatch(fetchNewOrderFailure(error));
    }

    //Fetch avaiable sizes
    const selectedStyle = getState().newItem.selectedStyle;
    try {
      const availableSizes = await fetchAvailableSizes(menuItem, selectedStyle);
      dispatch(setAvailableSizes(availableSizes));
    } catch (error: any) {
      dispatch(fetchNewOrderFailure(error));
    }

    //Fetch available toppings
    try {
      const availableToppings = await fetchAvailableToppings(
        menuItem,
        selectedStyle
      );
      dispatch(setAvailableToppings(availableToppings));
    } catch (error: any) {
      dispatch(fetchNewOrderFailure(error));
    }
  };
};

const fetchAvailableStyles = async (
  menuItem: MenuOption
): Promise<StyleOption[]> => {
  const availableStyles = menuItem.availableStyles;
  if (!availableStyles || availableStyles.length === 0) {
    return [];
  }

  try {
    let data = await StyleOption.getAll();
    data = data.filter((style) => availableStyles.includes(style.nameEn));
    const sortedData = data.sort((s1, s2) => s1.basePrice - s2.basePrice);
    return sortedData;
  } catch (error) {
    throw error;
  }
};

const fetchAvailableSizes = async (
  menuItem: MenuOption,
  selectedStyle: StyleOption | null
): Promise<SizeOption[]> => {
  const availableSizes = menuItem.availableSizes;
  if (!availableSizes || availableSizes.length === 0) {
    return [];
  }

  try {
    let data = await SizeOption.getAll();
    data = data.filter((size) => availableSizes.includes(size.nameEn));

    if (
      selectedStyle &&
      selectedStyle.availableSizes &&
      selectedStyle.availableSizes.length > 0
    ) {
      data = data.filter((size) =>
        selectedStyle.availableSizes?.includes(size.nameEn)
      );
    }

    const sortedData = data.sort((s1, s2) => s1.displayOrder - s2.displayOrder);
    return sortedData;
  } catch (error) {
    throw error;
  }
};

const fetchAvailableToppings = async (
  menuItem: MenuOption,
  selectedStyle: StyleOption | null
): Promise<ToppingOption[]> => {
  const availableToppings = menuItem.availableToppings;
  if (!availableToppings || availableToppings.length === 0) {
    return [];
  }

  try {
    console.log('Fetching available toppings');
    let data = await ToppingOption.getAll();
    console.log('All toppings:', data);
    data = data.filter((topping) => availableToppings.includes(topping.nameEn));
    console.log('Filtered toppings:', data);

    if (selectedStyle) {
      data = data.filter((topping) => {
        if (!topping.acceptStyles || topping.acceptStyles?.length === 0) {
          return true;
        }
        return (
          topping.acceptStyles &&
          topping.acceptStyles.includes(selectedStyle.nameEn)
        );
      });
      console.log('Filtered toppings based on selected style:', data);
    }
    return data;
  } catch (error) {
    console.log('Error fetching available toppings:', error);
    throw error;
  }
};

export const addCurrentItemToCart = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<any>
> => {
  return (dispatch, getState) => {
    const state = getState().newItem;
    if (!state.menuItem) return;
    if (state.hasSizes && !state.selectedSize) return;
    if (state.hasStyles && !state.selectedStyle) return;

    // create an order object based on your current state
    const newOrder = new OrderItem(
      uuidv4().toLowerCase(),
      state.menuItem,
      state.selectedStyle,
      state.selectedSize,
      state.selectedToppings,
      state.quantity,
      state.price
    );

    dispatch(addItemToCart(newOrder));
  };
};



const calculate = (
  menu: MenuOption | null,
  style: StyleOption | null,
  size: SizeOption | null,
  toppings: ToppingOption[],
  q: number
): number => {
  if (!menu) return 0;
  var total = menu!.basePrice;
  total += size ? size.basePrice : 0;
  total += style ? style.basePrice : 0;
  toppings.forEach((topping) => {
    total += topping.getCountPrice(1);
  });
  if (q) total *= q;
  return total;
};

export default newItemSlice.reducer;
