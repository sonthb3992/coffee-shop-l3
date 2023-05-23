import { useEffect, useState } from "react";

interface QuantitySelectorProps {
    min?: number;
    max?: number;
    current?: number;
    disabled?: boolean;
    onQuantityChanged?: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ min = 1, max = Infinity, current = 1, disabled = false, onQuantityChanged: onQuantityChange }) => {
    const [quantity, setQuantity] = useState(current);

    const increaseQuantity = () => {
        if (quantity < max) {
            setQuantity(quantity + 1);
            onQuantityChange && onQuantityChange(quantity + 1);
        }
    }

    const decreaseQuantity = () => {
        if (quantity > min) {
            setQuantity(quantity - 1);
            onQuantityChange && onQuantityChange(quantity - 1);
        }
    }

    useEffect(() => {
        onQuantityChange && onQuantityChange(quantity);
    }, [quantity]);

    return (
        <div>
            <button className={`button is-white is-rounded is-small ${disabled ? 'is-static' : ''}`} onClick={decreaseQuantity}>
                <span className="icon is-small">
                    <i className="fa-solid fa-minus"></i>
                </span>
            </button>
            <span className="is-size-5 p-3">{quantity}</span>
            <button className={`button is-white is-rounded is-small ${disabled ? 'is-static' : ''}`} onClick={increaseQuantity}>
                <span className="icon is-small">
                    <i className="fa-solid fa-plus"></i>
                </span>
            </button>
        </div>
    );
};

export default QuantitySelector;
