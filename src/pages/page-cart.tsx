import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import CartPageItem from '../view/cart-item';
import { OrderItem, calculatePrice } from '../domain/selected_item';
import {
  clearCart,
  setAddress,
  setCustomerName,
  setPhone,
} from '../reducer/cartSlice';
import { Order } from '../domain/order';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CartPage: React.FC = () => {
  const { t } = useTranslation();

  const address = useSelector((state: RootState) => state.cart.address);
  const phone = useSelector((state: RootState) => state.cart.phone);
  const items = useSelector((state: RootState) => state.cart.orderItems);
  const customerName = useSelector(
    (state: RootState) => state.cart.customer_name
  );
  const inputValid = useSelector((state: RootState) => state.cart.inputValid);
  const user = useSelector((state: RootState) => state.cart.user);
  const table = useSelector((state: RootState) => state.cart.table);
  const navigate = useNavigate();


  const dispatch = useDispatch();
  const taxRate = 0.0725;

  const handleAddressChange = (newAddress: string) => {
    dispatch(setAddress(newAddress));
  };

  const handlePhoneChange = (newPhone: string) => {
    dispatch(setPhone(newPhone));
  };

  const handleCustomerNameChange = (newName: string) => {
    dispatch(setCustomerName(newName));
  };

  const calculateSubTotal = (items: OrderItem[]) => {
    var total = 0;
    items.forEach((i) => (total += calculatePrice(i)));
    return total;
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * taxRate;
  };

  const calculateTotal = (items: OrderItem[]) => {
    var total = calculateSubTotal(items);
    total += calculateTax(total);
    return total;
  };

  const placeOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    var order = new Order();
    order.address = address;
    order.receiver = customerName;
    order.phoneNumber = phone;
    order.items = items;
    order.status = 0;
    order.price = calculateTotal(items);
    order.id = uuidv4().toLowerCase();
    order.placeTime = new Date(Date.now());
    order.itemcount = 0;
    order.items.forEach((i) => (order.itemcount += i.quantity!));
    order.useruid = user.uid;

    var s = await Order.pushToFirebase(order);
    if (s === 'success') {
      dispatch(clearCart());
      navigate(`/track-order/${order.id}`);
    } else {
      alert(s);
    }
  };

  useEffect(() => { }, [table]);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop">
          {
            table === null || table === '' ?
              <div className="column is-half-desktop p-3">
                <p className="title is-4 pt-5">{t('Delivery')}</p>
                <div className="field">
                  <label className="label">{t('ReceiverName')}</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className={`input ${customerName ? 'is-success' : 'is-danger'
                        }`}
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        handleCustomerNameChange(event.target.value)
                      }
                      placeholder="enter your name"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  {!customerName && (
                    <p className="help is-danger">{t('ReceiverName_invalid')}</p>
                  )}
                </div>
                <div className="field">
                  <label className="label">{t('Phone number')}</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className={`input ${phone ? 'is-success' : 'is-danger'}`}
                      type="text"
                      value={phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      placeholder="enter phone number"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-phone"></i>
                    </span>
                  </div>
                  {!phone && (
                    <p className="help is-danger">{t('Phone number invalid')}</p>
                  )}
                </div>
                <div className="field">
                  <label className="label">{t('Address')}</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className={`input ${address ? 'is-success' : 'is-danger'}`}
                      type="email"
                      value={address}
                      onChange={(event) => handleAddressChange(event.target.value)}
                      placeholder="enter delivery address"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-map"></i>
                    </span>
                  </div>
                  {!address && (
                    <p className="help is-danger">{t('Address invalid')}</p>
                  )}
                </div>

                <div className="level mt-6">
                  <div className="level-left">
                    <p className="title is-4">{t('Total')}</p>
                  </div>
                  <div className="level-right">
                    <p className="title is-4 has-text-primary">
                      ${calculateTotal(items).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="level mb-0">
                  <div className="level-left">
                    <p className="has-size-6">{t('Subtotal')}</p>
                  </div>
                  <div className="level-right">
                    <strong className="has-text-primary">
                      ${calculateSubTotal(items).toFixed(2)}
                    </strong>
                  </div>
                </div>
                <div className="level">
                  <div className="level-left">
                    <p className="has-size-6">{t('Tax')} (7.25%)</p>
                  </div>
                  <div className="level-right">
                    <strong className="has-text-primary">
                      ${calculateTax(calculateSubTotal(items)).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <button
                  className={`button  is-fullwidth-desktop ${inputValid ? 'is-primary' : 'is-static'
                    }`}
                  onClick={() => placeOrder()}
                >
                  {t('Place order')}
                </button>
              </div>
              : <></>
          }
          <div className="column is-half-desktop p-3">
            <div className={table === null || table === '' ? "p-5" : ""}>
              <div className="level">
                <div className="level-left">
                  <p className="title is-4">{t('Selected Items')}</p>
                </div>
                {/* <div className="level-right">
                  <a href="/all-items/" className="button is-primary">
                    {t('Add')}
                  </a>
                </div> */}
              </div>
              {items.length > 0 && (
                <div className="">
                  {items.map((option: OrderItem) => (
                    <React.Fragment key={option.id}>
                      <CartPageItem
                        canEditQuantity={true}
                        canDelete={true}
                        canReview={false}
                        option={option}
                      ></CartPageItem>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {items.length === 0 && <div>{t('No items selected')}</div>}
            </div>
            <div>
              {table && table !== "" &&
                <>
                  <div className="level mt-6 mb-0 is-mobile">
                    <div className="level-left">
                      <p className="is-size-4">{t('Total')}</p>
                    </div>
                    <div className="level-right">
                      <p className="is-size-4 has-text-primary">
                        ${calculateTotal(items).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="level mb-0 is-mobile">
                    <div className="level-left">
                      <p className="has-size-6 has-text-weight-normal">{t('Subtotal')}</p>
                    </div>
                    <div className="level-right">
                      <strong className="has-text-primary">
                        ${calculateSubTotal(items).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                  <div className="level is-mobile">
                    <div className="level-left">
                      <p className="has-size-6 has-text-weight-normal">{t('Tax')} (7.25%)</p>
                    </div>
                    <div className="level-right">
                      <strong className="has-text-primary">
                        ${calculateTax(calculateSubTotal(items)).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
