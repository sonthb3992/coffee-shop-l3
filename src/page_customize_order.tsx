import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuOption } from './domain/menu_option';
import QuantitySelector from './view/quanlity-selector';
import { StyleOption } from './domain/option_stype';
import { SizeOption } from './domain/option_size';
import { OrderItem } from './domain/selected_item';
import { ToppingOption } from './domain/option_topping';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addToCart } from './reducer/cartSlice';
import { RootState } from './reducer/store';


const CustomizeOrderPage: React.FC = () => {
    const { optionId, isEditing } = useParams();
    const [menuOption, setMenuOptions] = useState<MenuOption | null>();

    const [styles, setStyles] = useState<StyleOption[]>();
    const [sizes, setSizes] = useState<SizeOption[]>();
    const [toppings, setToppings] = useState<ToppingOption[]>();

    const [selectedStyle, setStyle] = useState<StyleOption | null>();
    const [selectedSize, setSize] = useState<SizeOption | null>();
    const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);

    const [quantity, setQuantity] = useState<number>();
    const [price, setPrice] = useState<number>();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const option = useSelector((state: RootState) => state.cart.editingItem);

    const selectedStyleChanged = (style: string) => {
        var s = (styles?.find((e) => e.nameEn === style));
        if (s) {
            setStyle(s);
            calculate(menuOption, s, selectedSize, selectedToppings, quantity);
        }
    };

    const selectedSizeChanged = (size: string) => {
        var s = (sizes?.find((e) => e.nameEn === size));
        if (s) {
            setSize(s);
        }
        calculate(menuOption, selectedStyle, s, selectedToppings, quantity);
    };

    const toggleTopping = (topping: string) => {
        if (selectedToppings.find((t) => t.nameEn === topping)) {
            const newToppings = selectedToppings.filter((s) => s.nameEn !== topping);
            setSelectedToppings(newToppings);
            calculate(menuOption, selectedStyle, selectedSize, newToppings, quantity);
        } else {
            var newTopping = toppings?.find((t) => t.nameEn === topping);
            if (newTopping) {
                const newToppings = [...selectedToppings, newTopping];
                setSelectedToppings(newToppings);
                calculate(menuOption, selectedStyle, selectedSize, newToppings, quantity);
            }
        }

    };

    const quanlityChanged = (q: number) => {
        setQuantity(q);
        calculate(menuOption, selectedStyle, selectedSize, selectedToppings, q);
    };

    const calculate = (menu: MenuOption | null | undefined, style: StyleOption | null | undefined,
        size: SizeOption | null | undefined, toppings: ToppingOption[], q: number | undefined) => {
        if (!menu) return;
        var total = menu!.basePrice;
        total += (size ? size.basePrice : 0);
        total += (style ? style.basePrice : 0);
        // Add the price of each selected topping
        toppings.forEach(topping => {
            total += topping.basePrice;
        });
        if (q)
            total *= q;
        setPrice(total);
    }

    const addToCartC = () => {
        // create an order object based on your current state
        const newOrder: OrderItem = {
            id: uuidv4().toLowerCase(),
            menuOption: menuOption,
            selectedStyle: selectedStyle,
            selectedSize: selectedSize,
            selectedToppings: selectedToppings,
            quantity: quantity,
            price: price,
        };

        dispatch(addToCart(newOrder));
        // dispatch(setOrderCount()); // Update the Redux state

        navigate("/all-items/");
    }

    var rendered = false;
    const fetchEditingItem = () => {
        if (isEditing === "true" && !rendered) {
            if (option) {
                if (option.selectedSize)
                    selectedSizeChanged(option.selectedSize?.nameEn);
                // if (option.selectedStyle)
                //     selectedStyleChanged(option.selectedStyle?.nameEn);
                // if (option.selectedToppings)
                //     (option.selectedToppings.forEach((t) => toggleTopping(t.nameEn)));
            }
            rendered = true;
        }
    }

    if (isEditing === "true") {
        fetchEditingItem();
    }

    useEffect(() => {
        const fetchMenuOptions = async () => {
            const result = await MenuOption.getOption(optionId);
            setMenuOptions(result);
            calculate(result, selectedStyle, selectedSize, selectedToppings, quantity);

        };
        const fetchStyles = async () => {
            const result = await StyleOption.getAll();
            setStyles(result);
        };
        const fetchSizes = async () => {
            const result = await SizeOption.getAll();
            setSizes(result);
        };
        const fetchToppings = async () => {
            const result = await ToppingOption.getAll();
            setToppings(result);
        };

        if (isEditing === undefined) {
            fetchEditingItem();
        } else {
            fetchMenuOptions();
            fetchStyles();
            fetchSizes();
            fetchToppings();
        }

    }, [optionId, isEditing]);


    return (
        <section className='section'>
            <div className='container'>
                <nav className="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        <li><a href="#" className='has-text-weight-semibold'>Menu</a></li>
                        <li><a href="#" className='has-text-weight-semibold'>{menuOption?.type}</a></li>
                        <li className="is-active has-text-weight-semibold"><a href="#" aria-current="page">{menuOption?.nameEn}</a></li>
                    </ul>
                </nav>

                <div className='columns is-desktop'>
                    <div className='column'>
                        <figure className='image is-square'>
                            <img src={menuOption?.imageUrl} width={500}></img>
                        </figure>
                    </div>
                    <div className='column'>
                        <div className='block'>
                            <div className='columns'>
                                <div className='column is-three-fifths'>
                                    <p className='is-size-3 has-text-weight-semibold'>{menuOption?.nameEn}</p>
                                    <p className='is-size-4 has-text-weight-semibold has-text-primary'>Price: ${price}</p>
                                </div>
                                <div className='column is-two-fifths'>
                                    <div className='is-flex is-flex-direction-row is-justify-content-flex-start-mobile'>
                                        <QuantitySelector max={99} min={1} onQuantityChange={(value) => quanlityChanged(value)}></QuantitySelector>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STYLE SELECTOR  */}
                        {(menuOption?.availableStyles?.length! > 0) && (<div className='block'>
                            <p className='is-size-5 has-text-weight-semibold pb-3'>Select serving style (required)</p>
                            <div className="field is-grouped">
                                {menuOption?.availableStyles?.map((e) =>
                                    <p className='control' key={e}>
                                        <button className={`button ${e === selectedStyle?.nameEn ? 'is-primary' : ''}`} onClick={() => selectedStyleChanged(e)}>{e}</button>
                                    </p>
                                )}
                            </div>
                        </div>)}

                        {/* SIZE SELECTOR */}
                        {(menuOption?.availableSizes?.length! > 0) && (<div className='block'>
                            <p className='is-size-5 has-text-weight-semibold pb-3'>Select size (required)</p>
                            <div className="field is-grouped">
                                {menuOption?.availableSizes?.map((e) =>
                                    <p className='control' key={e}>
                                        <button className={`button ${e === selectedSize?.nameEn ? 'is-primary' : ''}`} onClick={() => selectedSizeChanged(e)}>{e}</button>
                                    </p>
                                )}
                            </div>
                        </div>)}

                        {/* TOPPING SELECTOR */}
                        {(menuOption?.availableToppings?.length! > 0) && (<div className='block'>
                            <p className='is-size-5 has-text-weight-semibold pb-3'>Toppings</p>
                            <div className="field is-grouped is-grouped-multiline">
                                {menuOption?.availableToppings?.map((e) =>
                                    <p className='control' key={e} >
                                        <button className={`button ${selectedToppings.find((t) => t.nameEn === e) != undefined ? 'is-primary' : ''}`} onClick={() => toggleTopping(e)}>{e}</button>
                                    </p>
                                )}
                            </div>
                        </div>)}

                        <button className='button is-primary is-fullwidth mt-6' onClick={addToCartC}>Add to cart</button>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default CustomizeOrderPage;

