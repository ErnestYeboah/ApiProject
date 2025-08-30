import { Fragment, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productStoreSlice } from "../../features/ProductStoreSlice";
import FavoriteProductCard from "./FavoriteProductCard";
import {
  deleteFromFavorites,
  favoritesProuctsStore,
  removeItemFromFavorites,
} from "../../features/FavoriteStoreSlice";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { products } = useSelector(productStoreSlice);
  const { favorites } = useSelector(favoritesProuctsStore);
  const [cookie] = useCookies(["token"]);
  const dispatch = useDispatch();

  const removeFromFavorite = useCallback((id: number, index: number) => {
    dispatch(removeItemFromFavorites(index));
    dispatch(deleteFromFavorites({ token: cookie["token"], id: id }));
  }, []);

  return (
    <Fragment>
      <div className="products__container favorites__container">
        {favorites &&
          cookie["token"] &&
          favorites.map((favorite, index) => {
            const product = products.find(
              (item) => item.id === favorite.product_id
            );
            return (
              product && (
                <FavoriteProductCard
                  onclick={() => removeFromFavorite(favorite.id, index)}
                  key={favorite.product_id}
                  data={product}
                />
              )
            );
          })}
      </div>

      {!cookie["token"] && (
        <div className="text-center">
          <p className=" opacity-[.6] text-[2rem] mt-[var(--margin)] ">
            No item/s in Favorites{" "}
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
    </Fragment>
  );
};

export default Favorites;
