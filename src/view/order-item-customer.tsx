import React from 'react';
import { Order } from '../domain/order';
import { useNavigate } from 'react-router-dom';

interface SingleOrderDisplayProps {
    order: Order;
}

const SingleOrderDisplayCustomerView: React.FC<SingleOrderDisplayProps> = ({ order: item }) => {

    const navigate = useNavigate();

    const viewDetail = () => {
        navigate(`/track-order/${item.id.toLowerCase()}`)
    }

    const getTagContent = (): string => {
        switch (item.status) {
            case -1:
                return "Cancel";
            case 0:
                return "Not confirmed";
            case 1:
                return "Confirmed";
            case 2:
                return "Processing";
            case 3:
                return "Delivering";
            case 4:
                return "Completed";
            default:
                return '';
        }
    }

    const getTagClass = (): string => {
        switch (item.status) {
            case -1:
                return "is-danger";
            case 0:
                return "";
            case 1:
                return "is-info";
            case 2:
                return "is-link";
            case 3:
                return "is-primary";
            case 4:
                return "is-success";
            default:
                return '';
        }
    }

    return (
        <div className='card m-1 p-3 is-size-7'>
            <div className='block mb-1'>
                <span className={`tag ${getTagClass()}`}>
                    {getTagContent()}
                </span>
            </div>
            <div className='level'>
                <div className='level-left'>
                    <div className='level-item is-flex is-flex-direction-column is-align-items-start	'>
                        <span className="icon-text ">
                            <span className="icon">
                                <i className="fas fa-home"></i>
                            </span>
                            <span>{item.address}</span>
                        </span>
                        <span className="icon-text">
                            <span className="icon">
                                <i className="fas fa-user"></i>
                            </span>
                            <span>{item.receiver}</span>
                        </span>
                        <span className="icon-text">
                            <span className="icon">
                                <i className="fas fa-phone"></i>
                            </span>
                            <span>{item.phoneNumber}</span>
                        </span>
                    </div>
                </div>
                <div className='level-right'>
                    <div className='level-item is-flex is-flex-direction-column                     is-align-content-space-between is-align-items-end'>
                        <p className='title is-5 mb-2'>${item.price.toFixed(2)}</p>
                        <button className="button is-primary is-small" onClick={() => viewDetail()}>
                            View detail
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SingleOrderDisplayCustomerView;
