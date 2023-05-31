import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuOption } from '../domain/menu_option';
import QuantitySelector from '../view/quanlity-selector';
import { StyleOption } from '../domain/option_stype';
import { SizeOption } from '../domain/option_size';
import { OrderItem, buildOrder } from '../domain/selected_item';
import { ToppingOption } from '../domain/option_topping';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addItemToCart } from '../reducer/cartSlice';
import { RootState } from '../reducer/store';
import { useTranslation } from 'react-i18next';


const CustomizeOrderPage: React.FC = () => {
    const { optionId, isEditing } = useParams();

    const [menuOption, setMenuOptions] = useState<MenuOption | null>();
    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();



    const [styles, setStyles] = useState<StyleOption[]>();
    const [sizes, setSizes] = useState<SizeOption[]>();
    const [toppings, setToppings] = useState<ToppingOption[]>();

    const [selectedStyle, setStyle] = useState<StyleOption | null>();
    const [selectedSize, setSize] = useState<SizeOption | null>();
    const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);

    const [acceptableSizes, setAcceptableSizes] = useState<SizeOption[]>();
    const [acceptableToppings, setAcceptableToppings] = useState<ToppingOption[]>();


    const [quantity, setQuantity] = useState<number>();
    const [price, setPrice] = useState<number>();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const option = useSelector((state: RootState) => state.cart.editingItem);

    const selectedStyleChanged = (style: string) => {
        var s = (styles?.find((e) => e.nameEn === style));
        if (s) {
            setStyle(s);
            if (style == "cold" || style == "blended") {
                setAcceptableSizes(sizes);
                setAcceptableToppings(toppings?.filter((e) => e.nameEn !== "chocolate sauce"))
            } else {
                setAcceptableToppings(toppings);
                if (sizes) {
                    var _newSizes = sizes.filter((e) => e.nameEn == "S" || e.nameEn == "M");
                    setAcceptableSizes(_newSizes);
                    if (!_newSizes.find((e) => e.nameEn == selectedSize?.nameEn)) {
                        setSize(null);
                    }
                }
            }
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
        if (!menuOption)
            return;

        if (menuOption.availableSizes !== undefined && menuOption.availableSizes.length > 0) {
            if (!selectedSize) {
                alert("Please select a specified size.");
                return;
            }
        }

        if (menuOption.availableStyles !== undefined && menuOption.availableStyles.length > 0) {
            if (!selectedSize) {
                alert("Please select a specified style.");
                return;
            }
        }
        // create an order object based on your current state
        const newOrder = new OrderItem(
            uuidv4().toLowerCase(),
            menuOption,
            selectedStyle,
            selectedSize,
            selectedToppings,
            quantity,
            price
        );
        dispatch(addItemToCart(newOrder));
        // dispatch(setOrderCount()); // Update the Redux state

        navigate("/all-items/");
    }

    useEffect(() => {
        const fetchMenuOptions = async () => {
            const result = await MenuOption.getOption(optionId);
            if (result === null) return;
            setMenuOptions(result);
            calculate(result, selectedStyle, selectedSize, selectedToppings, quantity);
            await fetchToppings(result);
        };
        const fetchStyles = async () => {
            var result = await StyleOption.getAll();
            setStyles(result);
        };
        const fetchSizes = async () => {
            const result = await SizeOption.getAll();
            setSizes(result);
            setAcceptableSizes(result);
        };
        const fetchToppings = async (value: MenuOption) => {
            const result = await ToppingOption.getAll();
            var topp: ToppingOption[] = [];
            result.forEach(t => {
                var found = value.availableToppings?.find(t2 => t.nameEn == t2);
                if (found != undefined) {
                    console.log(t);
                    topp.push(t);
                }
            });
            setToppings(topp);
            setAcceptableToppings(topp);
        };

        fetchMenuOptions();
        fetchStyles();
        fetchSizes();

    }, [optionId, isEditing]);


    return (
        <section className='section'>
            <div className='container'>
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
                                    <p className='is-size-3 has-text-weight-semibold'>{language === "en" ? menuOption?.nameEn : menuOption?.nameVi}</p>
                                    <p className='is-size-4 has-text-weight-semibold has-text-primary'>{t('BasePrice')}: ${price}</p>
                                </div>
                                <div className='column is-two-fifths'>
                                    <div className='is-flex is-flex-direction-row is-justify-content-flex-start-mobile'>
                                        <QuantitySelector max={99} min={1} onQuantityChanged={(value) => quanlityChanged(value)}></QuantitySelector>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STYLE SELECTOR  */}
                        {(menuOption?.availableStyles?.length! > 0) && (<div className='block'>
                            <p className='is-size-5 has-text-weight-semibold pb-3'>{t("Select_style")}</p>
                            <div className="field is-grouped">
                                {styles?.map((e) =>
                                    <p className='control' key={e.nameEn}>
                                        <button className={`button ${e.nameEn === selectedStyle?.nameEn ? 'is-primary' : ''}`} onClick={() => selectedStyleChanged(e.nameEn)}>{language === "en" ? e.nameEn : e.nameVi}</button>
                                    </p>
                                )}
                            </div>
                        </div>)}

                        {/* SIZE SELECTOR */}
                        {(menuOption?.availableSizes?.length! > 0) && (<div className='block'>
                            <p className='is-size-5 has-text-weight-semibold pb-3'>{t("Select_size")}</p>
                            <div className="field is-grouped">
                                {acceptableSizes?.sort((s1, s2) => s1.displayOrder - s2.displayOrder).map((e) =>
                                    <p className='control' key={e.nameEn}>
                                        <button className={`button ${e.nameEn === selectedSize?.nameEn ? 'is-primary' : ''}`} onClick={() => selectedSizeChanged(e.nameEn)}>{language === "en" ? e.nameEn : e.nameVi}</button>
                                    </p>
                                )}
                            </div>
                        </div>)}

                        {/* TOPPING SELECTOR */}
                        {(menuOption?.availableToppings?.length! > 0) && (<div className='block'>
                            <p className='is-size-5 has-text-weight-semibold pb-3'>Toppings</p>
                            <div className="field is-grouped is-grouped-multiline">
                                {acceptableToppings && acceptableToppings?.map((e) =>
                                    <p className='control' key={e.nameEn} >
                                        <button className={`button ${selectedToppings.find((t) => t.nameEn === e.nameEn) != undefined ? 'is-primary' : ''}`}
                                            onClick={() => toggleTopping(e.nameEn)}>
                                            {language === "en" ? e.nameEn : e.nameVi}
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>)}

                        <button className='button is-primary is-fullwidth mt-6' onClick={addToCartC}>{t('AddToCart')}</button>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default CustomizeOrderPage;

