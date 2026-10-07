import { ShopContext } from "../../context/ShopContext";
import { useContext } from "react";
import Title from "../common/Title";
import ProductItem from "./ProductItem";

const Latestcollection = () => {
  const { products } = useContext(ShopContext);
  const latestProducts = products.slice(0, 10);

  // const [latestProducts, setLatestProducts] = useState([]);

  // useEffect(() => {
  //   setLatestProducts(products.slice(0, 10));
  // }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our latest collection, where modern style meets everyday
          comfort. Explore fresh designs, premium-quality clothing, and timeless
          pieces made to elevate your wardrobe. Find your new favorites and stay
          ahead of the latest trends.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};
export default Latestcollection;
