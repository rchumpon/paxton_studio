import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Title from "../components/common/Title";
import ProductItem from "../components/layout/ProductItem";

const Collection = () => {
  // Get product data and search information from ShopContext
  const { products, search, showSearch } = useContext(ShopContext);

  //=====================================
  // State
  //=====================================

  // Control whether the filters are visible on mobile
  const [showFilter, setShowFilter] = useState(false);

  // Store the products that should be displayed
  const [filterProducts, setFilterProducts] = useState([]);

  // Store selected categories, e.g. ["Men", "Women"]
  const [category, setCategory] = useState([]);

  // Store selected subcategories, e.g. ["Topwear", "Bottomwear"]
  const [subCategory, setSubCategory] = useState([]);

  // Store the selected sorting option "relevant", "low-high", or "high"
  const [sortType, setSortType] = useState("relevant");

  //=====================================
  // Category Filter
  //=====================================

  // Add or remove a category when the user clicks a checkbox
  const toggleCategory = (e) => {
    // If category is already selected, remove it
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      // If  category is not selected, add it
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  //=====================================
  // Sub-Category Filter
  //=====================================

  // Add or remove a sub-category when the user clicks a checkbox
  const toggleSubCategory = (e) => {
    // If sub-category is already selected, remove it
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      // if not selected, add it
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  //=====================================
  // Apply Filters
  //=====================================

  // Apply the selected filters
  const applyFilter = () => {
    // Start with all products
    // slice() creates a copy of the array
    let productsCopy = products.slice();

    // Search Filter - Only search if the SearchBar is open and the user has typed something
    if (showSearch && search)
      [
        (productsCopy = productsCopy.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        )),
      ];

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }
    // Save the final filtered products
    setFilterProducts(productsCopy);
  };

  //=====================================
  // Sort Products
  //=====================================

  const sortProduct = () => {
    // Make a copy of the currently filtered products
    let filterProductsCopy = filterProducts.slice();

    // Check which sorting option the user selected
    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductsCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(filterProductsCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  //=====================================
  // Run Filter
  //=====================================

  // useEffect(() => {
  //   setFilterProducts(products);
  // }, []);

  // Run applyFilter() whenever category changes, subCategory changes, search changes, and showSearch changes
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  // useEffect(() => {
  //   console.log(subCategory);
  // }, [subCategory]);

  //=====================================
  // Run Sort
  //=====================================

  // Run sortProduct() whenever the sorting option changes
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  //=====================================
  // Display Page
  //=====================================
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 ">
      {/* Left side - Filters */}
      <div className="min-w-60">
        {/* When the user click "setShowFilter", give it the opposite value of showFilter (true => false, false => true) */}
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center my-2 text-xl cursor-pointer gap-2"
        >
          FILTERS
          {/* Rotate arrow when filters are open */}
          <FaChevronRight
            className={`h-3 transition-transform duration-300 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-border pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-primary">
            {/* Men */}
            <p className="flex gap-2">
              <input
                onChange={toggleCategory}
                type="checkbox"
                value={"Men"}
                className="w-3"
              />
              Men
            </p>

            {/* Women */}
            <p className="flex gap-2">
              <input
                onChange={toggleCategory}
                type="checkbox"
                value={"Women"}
                className="w-3"
              />
              Women
            </p>

            {/* Kids */}
            <p className="flex gap-2">
              <input
                onChange={toggleCategory}
                type="checkbox"
                value={"Kids"}
                className="w-3"
              />
              Kids
            </p>
          </div>
        </div>

        {/* Sub-category Filter */}
        <div
          className={`border border-border pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-primary">
            <p className="flex gap-2">
              <input
                onChange={toggleSubCategory}
                type="checkbox"
                className="w-3"
                value={"Topwear"}
              />
              Topwear
            </p>

            <p className="flex gap-2">
              <input
                onChange={toggleSubCategory}
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
              />
              Bottomwear
            </p>

            <p className="flex gap-2">
              <input
                onChange={toggleSubCategory}
                type="checkbox"
                className="w-3"
                value={"Outerwear"}
              />
              Outerwear
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Products */}
      <div className="flex-1">
        {/* Title and sorting */}
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Sorting dropdown */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-border text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Mapping Products*/}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item.id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Collection;
