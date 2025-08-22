import { useDispatch, useSelector } from "react-redux";
import {
  deleteFromCart,
  getCartItems,
  type CartProduct,
} from "../../features/CartSlice";
import { productStoreSlice } from "../../features/ProductStoreSlice";
import { useCallback, useState } from "react";
import { useCookies } from "react-cookie";

const CartProductCard = ({ data }: { data: CartProduct }) => {
  const { id, product_id, product_name, category, quantity, added_on, size } =
    data as CartProduct;
  const { products } = useSelector(productStoreSlice);
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();

  const { thumbnail, old_price, price } = products[product_id - 1];
  const [newQuantity, setNewQuantity] = useState(quantity);

  const removeFromCart = useCallback((id: number) => {
    dispatch(deleteFromCart({ id: id, token: cookie["token"] }));
    dispatch(getCartItems(cookie["token"]));
  }, []);

  return (
    <div className="cart_card">
      <div className="image__container">
        <img src={thumbnail} alt="" />
      </div>
      <div className="text__content_div">
        <div className="text__content ">
          <p className="font-bold">{product_name}</p>
          <p>{category}</p>
          <p>Size : {size}</p>
          <label className="flex items-center gap-2" htmlFor="quantity">
            Qty:
            <input
              type="number"
              className="bg-gray-300 p-1 w-[5rem] text-center"
              value={newQuantity}
              id="quantity"
              onChange={(e) => setNewQuantity(Number(e.target.value))}
            />
          </label>
          <p className="opacity-[.6] text-nowrap date_tag ">
            Added on {new Date(added_on).toLocaleString()}
          </p>
        </div>
        <div className="prices mt-[2rem] justify-self-end pr-[var(--gap)]">
          <p>
            <s>₵{old_price}</s>
          </p>
          <p>₵{price}</p>
        </div>
        <button onClick={() => removeFromCart(id)} className="remove_btn">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartProductCard;
