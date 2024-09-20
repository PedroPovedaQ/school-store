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
    <header className="bg-gray-100 py-4 flex align-middle">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/shop"
          className="text-black hover:underline inline-flex items-center"
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
