import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { useCookies } from "react-cookie";
import SearchCategory from "./SearchCategory";
import { useDispatch, useSelector } from "react-redux";
import { logout, productStoreSlice } from "../../features/ProductStoreSlice";
import React, { useCallback, useState } from "react";
import { favoritesProuctsStore } from "../../features/FavoriteStoreSlice";
import { cartItemsSlice } from "../../features/CartSlice";

// Optimization for children components when their props change
const SearchCategoryMemo = React.memo(SearchCategory);
const ShoppingCartOutlinedMemo = React.memo(ShoppingCartOutlined);
const HeartOutlinedMemo = React.memo(HeartOutlined);
const UserOutlinedMemo = React.memo(UserOutlined);
const LogoutOutlinedMemo = React.memo(LogoutOutlined);

const Navbar = () => {
  const navigate = useNavigate();
  const [cookie, , removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user } = useSelector(productStoreSlice);
  const { favorites } = useSelector(favoritesProuctsStore);
  const { cart } = useSelector(cartItemsSlice);

  const signout = useCallback(() => {
    removeCookie("token");
    dispatch(logout());
    navigate("/signin");
    setShowProfileModal(false);
  }, []);

  const goToProfilePage = useCallback(() => {
    navigate("/profile");
    setShowProfileModal(false);
  }, []);
  const path = location.pathname;

  return (
    <>
      <nav>
        <div className="logo">
          <Link to={"/"}>
            <h2 className="cursor-pointer">
              Amaeton Fashion <span className="h_sup">H</span>
            </h2>
          </Link>
        </div>

        <form className="search_sec" action="" method="get">
          <input
            className="search"
            type="search"
            name="search"
            id="search"
            placeholder="Search products , brands and categories"
            required
          />
          <button>Search</button>
        </form>

        <div className="navlinks">
          <div className="wishlist_icon icon_div" data-tooltip="wishlist">
            <p className="favorites_count pointer-events-none">
              {favorites.length}
            </p>
            <HeartOutlinedMemo
              className="icon"
              onClick={() => navigate("/favorites")}
            />
          </div>

          {cookie["token"] ? (
            <Avatar
              style={{
                backgroundColor: "var(--accent-clr)",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              size="default"
              onClick={() => setShowProfileModal((x) => !x)}
              className="avatar"
            >
              {user &&
                user.length >= 0 &&
                user[0]?.username.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <div className="user_icon icon_div" data-tooltip="Sign In">
              <Link to={"/signin"}>
                <UserOutlinedMemo className="icon" />
              </Link>
            </div>
          )}

          <div className="cart_icon icon_div" data-tooltip="Cart">
            <p className="favorites_count pointer-events-none">{cart.length}</p>
            <Link to={"/cart"}>
              <ShoppingCartOutlinedMemo className="icon" />
            </Link>
          </div>
        </div>
      </nav>
      <div
        className={showProfileModal ? "profile_modal active" : "profile_modal"}
      >
        <div className="user_details">
          <Avatar
            className="avatar"
            style={{
              backgroundColor: "var(--accent-clr)",
              verticalAlign: "middle",
              cursor: "pointer",
            }}
            size="large"
          >
            {user &&
              user.length >= 0 &&
              user[0]?.username.charAt(0).toUpperCase()}
          </Avatar>
          <p>{user[0]?.username}</p>
          <p>{user[0]?.email}</p>
        </div>

        <Link
          to={"/profile"}
          onClick={goToProfilePage}
          className="cursor-pointer"
        >
          Customize user profile
        </Link>
        <Link
          to="/signin"
          onClick={signout}
          className="content-end cursor-pointer"
        >
          <LogoutOutlinedMemo /> Log out
        </Link>
      </div>

      {path == "/profile" ? "" : <SearchCategoryMemo />}
    </>
  );
};

export default Navbar;
