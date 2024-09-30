import React, { memo } from "react";
import CartSheet from "./CartSheet";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Props {
  showCart: boolean;
}

function ShopHeader(props: Props) {
  const { showCart } = props;

  return (
    <header className="flex py-4 align-middle bg-gray-100">
      <div className="container flex justify-between items-center px-4 mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-black hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Products
        </Link>
        {showCart && <CartSheet />}
      </div>
    </header>
  );
}

ShopHeader.propTypes = {};

export default ShopHeader;
