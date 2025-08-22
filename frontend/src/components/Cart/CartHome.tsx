import { useSelector } from "react-redux";
import { cartItemsSlice } from "../../features/CartSlice";
import { productStoreSlice } from "../../features/ProductStoreSlice";
import CartProductCard from "./CartProductCard";
import "./cart.css";

const CartHome = () => {
  const { cart } = useSelector(cartItemsSlice);
  const { products } = useSelector(productStoreSlice);

  return (
    <div className="px-[var(--margin)]">
      {cart &&
        cart.map((cartItem, index) => {
          const product = products.find(
            (product) => product.id == cartItem.product_id
          );
          return product && <CartProductCard key={index} data={cartItem} />;
        })}
    </div>
  );
};

export default CartHome;
