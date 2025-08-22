import { useSelector } from "react-redux";
import { cartItemsSlice } from "../../features/CartSlice";
import { productStoreSlice } from "../../features/ProductStoreSlice";
import CartProductCard from "./CartProductCard";
import "./cart.css";
import { Link } from "react-router-dom";
import CheckOutModal from "./CheckOutModal";
import { useCookies } from "react-cookie";
import { message } from "antd";
import { useEffect } from "react";

const CartHome = () => {
  const { cart, isLoading, updating_item_quantity_status } =
    useSelector(cartItemsSlice);
  const { products } = useSelector(productStoreSlice);
  const [cookie] = useCookies(["token"]);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Changes applied successfully",
    });
  };

  useEffect(() => {
    if (!isLoading && updating_item_quantity_status == "succeeded") {
      success();
    }
  }, [isLoading]);

  return (
    <>
      {contextHolder}
      {cart.length > 0 ? (
        <div className="px-[var(--margin)] cart__container">
          <div className="card__wrapper">
            {cart &&
              cart.map((cartItem, index) => {
                const product = products.find(
                  (product) => product.id == cartItem.product_id
                );
                return (
                  product && <CartProductCard key={index} data={cartItem} />
                );
              })}
          </div>

          <CheckOutModal />
        </div>
      ) : (
        <div className="text-center">
          <p className=" opacity-[.6] text-[2rem] mt-[var(--margin)] ">
            No item/s in Cart{" "}
          </p>
          {!cookie["token"] && (
            <p>
              <Link className="text-[var(--accent-clr)]" to={"/signin"}>
                Sign In
              </Link>{" "}
              to view your items in cart
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default CartHome;
