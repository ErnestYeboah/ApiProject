import { Link, useNavigate } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";
import {
  productStoreSlice,
  type Product,
} from "../../features/ProductStoreSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import {
  addToFavorites,
  favoritesProuctsStore,
} from "../../features/FavoriteStoreSlice";
import { useCallback, useState } from "react";
import SizeList from "./SizeList";
import { addItemsToCart } from "../../features/CartSlice";

type CardType = "Regular" | "Detailed";

const ProductCard = ({
  productData,
  type = "Regular",
}: {
  productData: Product;
  type: CardType;
}) => {
  const { isAuthenticated, size } = useSelector(productStoreSlice);
  const { favorites } = useSelector(favoritesProuctsStore);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookie] = useCookies(["token"]);

  const saveToFavoritesApi = useCallback(
    (product: Product) => {
      dispatch(
        addToFavorites({
          product,
          token: cookie["token"],
        })
      );
    },
    [cookie, productData]
  );
  const {
    category,
    product_name,
    thumbnail,
    price,
    id,
    description,
    isAvailable,
    old_price,
  } = productData;

  const [quantity, setQuantity] = useState(1);

  const itemsToAddCartData = {
    category: category,
    product_name: product_name,
    product_id: id,
    old_price: old_price,
    quantity: quantity,
    size: size,
  };

  const addToCart = () => {
    dispatch(
      addItemsToCart({
        token: cookie["token"],
        product: itemsToAddCartData,
      })
    );
  };

  return (
    <>
      {type == "Regular" ? (
        <div className="product_card cursor-pointer">
          <Link to={`/product/${id}`} className="text__link">
            <div className="text__content my-2">
              <div className="image_container">
                <img src={thumbnail} loading="lazy" alt={product_name} />
              </div>
              <p className="font-bold">{product_name}</p>
              <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
            </div>
          </Link>
          <div className="flex justify-between mx-3">
            <p>₵{price}</p>
            {favorites.some(
              (fav) => fav.product_name === productData.product_name
            ) ? (
              <svg
                width="2rem"
                height="2rem"
                fill="var(--accent-clr)"
                viewBox="0 0 1024 1024"
                className="svg"
              >
                <title>Added to Favorites</title>
                <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
              </svg>
            ) : (
              <HeartOutlined
                className="heart"
                onClick={() =>
                  isAuthenticated
                    ? saveToFavoritesApi(productData)
                    : navigate("/signin")
                }
              />
            )}
          </div>
        </div>
      ) : (
        // Detaied Single Product Card

        <div className="product_card_detailed cursor-pointer">
          <div className="image_container">
            <div className="heart_div">
              {/* for the heart iocn as to is liked or not */}
              {favorites.some(
                (fav) => fav.product_name === productData.product_name
              ) ? (
                <svg
                  width="2rem"
                  height="2rem"
                  fill="var(--accent-clr)"
                  viewBox="0 0 1024 1024"
                  className="svg"
                >
                  <title>Added to Favorites</title>
                  <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
                </svg>
              ) : (
                <HeartOutlined
                  className="heart"
                  onClick={() =>
                    isAuthenticated
                      ? saveToFavoritesApi(productData)
                      : navigate("/signin")
                  }
                />
              )}
            </div>
            <img src={thumbnail} loading="lazy" alt={product_name} />
          </div>

          <div className="text__content_wrapper flex flex-col gap-4 ">
            <div className="product_name_with_category_wrapper flex gap-2.5 justify-between items-center ">
              <div className="first_col ">
                <p className="font-bold text-[2rem]">{product_name}</p>
                <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                <p className="text-[var(--accent-clr)]">
                  {isAvailable ? "Available in Store" : "Not Available Now"}
                </p>
              </div>
              <p className="text-[var(--accent-clr)] text-[2rem]">₵{price}</p>
            </div>
            {category === "clothing" ? (
              <SizeList sizetype="clothing_size" />
            ) : (
              <SizeList sizetype="shoes_size" />
            )}

            <p className="description">{description}</p>
            <label className="flex gap-2 items-center" htmlFor="quantity">
              Qty :
              <input
                className="quantity_input"
                type="number"
                name="quantity"
                value={quantity}
                id="quantity"
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>

            <button onClick={addToCart}>Add To Cart</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
