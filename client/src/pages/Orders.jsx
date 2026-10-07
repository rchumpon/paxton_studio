import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/common/Title";

const Orders = () => {
  const { products, currency } = useContext(ShopContext);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-4 border-t border-b text-secondary-foreground"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-secondary-foreground/60">
                  <p className="text-lg">
                    {currency} {item.price}
                  </p>
                  <p className="">Quantity: 1</p>
                  <p>Size: M</p>
                </div>
                <p className="mt-2">
                  Date:{" "}
                  <span className="text-secondary-foreground/60">
                    16, September, 2026
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">Ready to ship</p>
              </div>
              <button className="border bg-primary text-primary-foreground hover:bg-primary/20 px-4 py-2 text-sm font-medium rounded-sm">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orders;
