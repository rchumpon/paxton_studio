import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../config/config";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const List = ({ token }) => {
  // Store the products retrieved from Firestore
  const [list, setList] = useState([]);

  // Fetch all products from the backend
  const fetchList = async () => {
    try {
      // Send GET request to retrieve all products
      const response = await axios.get(backendUrl + "/api/product/list");

      // Check whether the request was successful
      if (response.data.success) {
        // Update the product list
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Fetch Products Error:", err);

      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Remove a product using its Firestore document ID
  const removeProduct = async (id) => {
    try {
      // Send DELETE request with the product ID in the URL
      const response = await axios.delete(backendUrl + "/api/product/" + id, {
        headers: { token },
      });

      // Check whether the product was removed
      if (response.data.success) {
        toast.success(response.data.message);

        // Refresh product list
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Remove Product Error:", err);

      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 px-2 py-1 border border-primary/10 bg-secondary/60 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[70px_minmax(0,1fr)_40px]  md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 px-2 py-1 border text-sm"
          >
            {/* Product Image and Mobile Price */}
            <div className="flex flex-col items-center gap-1 md:block">
              <img src={item.image[0]} alt={item.name} className="w-12" />

              {/* Price - Mobile Only */}
              <p className="text-xs font-medium md:hidden">
                {currency} {item.price}
              </p>
            </div>

            {/* Product Name */}
            <p className="min-w-0 wrap-break-word">{item.name}</p>

            {/* Product Category - Desktop only */}
            <p className="hidden md:block">{item.category}</p>

            {/* Product Price - Desktop only */}
            <p className="hidden md:block">
              {currency} {item.price}
            </p>

            {/* Delete Product */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => removeProduct(item.id)}
                className="cursor-pointer text-lg text-red-500 hover:text-red-700"
                aria-label={`Delete ${item.name}`}
              >
                <FaTrash />
              </button>
            </div>
            {/* <p
              onClick={() => removeProduct(item.id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p> */}
          </div>
        ))}
      </div>
    </>
  );
};
export default List;
