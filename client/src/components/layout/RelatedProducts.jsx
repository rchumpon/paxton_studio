import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "../common/Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  // Get all products from ShopContext
  const { products } = useContext(ShopContext);

  // Store the products that are related to the current product
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Run when the products from ShopContext change
  useEffect(() => {
    // Make sure products are available
    if (products.length > 0) {
      // Make a copy of all products
      let productsCopy = products.slice();

      // Keep products with the same category
      productsCopy = productsCopy.filter((item) => category === item.category);

      // Keep products with the same sub-category
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory,
      );
      // Only show the first 5 related products
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products]);
  return (
    <div className="my-24">
      {/* Section title */}
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      {/* Display related products in a responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
        {/* Loop through the related products */}
        {relatedProducts.map((item, index) => (
          // Display each product using ProductItem
          <ProductItem
            key={index}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};
export default RelatedProducts;
