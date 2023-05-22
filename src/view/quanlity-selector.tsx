import { useEffect, useState } from "react";

interface QuantitySelectorProps {
    min?: number;
    max?: number;
    onQuantityChange?: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ min = 1, max = Infinity, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(min);

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
            <button className='button is-primary is-rounded' onClick={decreaseQuantity}>
                <span className="icon is-small">
                    <i className="fa-solid fa-minus"></i>
                </span>
            </button>
            <span className="is-size-4 p-3">{quantity}</span>
            <button className='button is-primary is-rounded' onClick={increaseQuantity}>
                <span className="icon is-small">
                    <i className="fa-solid fa-plus"></i>
                </span>
            </button>
        </div>
    );
};

export default QuantitySelector;
