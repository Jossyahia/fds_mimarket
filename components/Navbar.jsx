"use client";
import React, { useState } from "react";
import { Menu, Person, Search, ShoppingCart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const searchWork = async () => {
    router.push(`/search/${query}`);
  };

  const cart = user?.cart;

  return (
    <div className="navbar">
      <a href="/">
        <Logo />
      </a>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchWork()}
        />
        <IconButton disabled={query === ""} onClick={searchWork}>
          <Search sx={{ color: "red" }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user && (
          <a href="/cart" className="cart">
            <ShoppingCart sx={{ color: "gray" }} />
            Cart <span>({cart?.length})</span>
          </a>
        )}

        <div className="navbar_right_account">
          <IconButton onClick={() => setDropdownMenu(!dropdownMenu)}>
            {user ? (
              <img
                src={user.profileImagePath}
                alt="profile"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <Menu sx={{ color: "gray" }} />
            )}
          </IconButton>
        </div>

        {dropdownMenu && (
          <div className="navbar_right_accountmenu">
            {!user ? (
              <>
                <Link href="/login">Log In</Link>
                <Link href="/register">Sign Up</Link>
              </>
            ) : (
              <>
                <Link href="/wishlist">Wishlist</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/order">Orders</Link>
                <Link href={`/shop?id=${user._id}`}>Your Shop</Link>
                <Link href="/create-work">Sell Your Work</Link>
                <a onClick={handleLogout}>Log Out</a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
