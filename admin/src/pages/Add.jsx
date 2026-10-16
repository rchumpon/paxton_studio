import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import { backendUrl } from "../config/config";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Create FormData to store product details and images
      const formData = new FormData();

      // Add product information
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestSeller);

      // Convert sizes array to JSON string
      formData.append("sizes", JSON.stringify(sizes));

      // Add images only if selected
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // Send product data to the backend with admin token
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      // Check whether product was added successfully
      if (response.data.success) {
        toast.success(response.data.message);

        // Clear form after successful submission
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setBestSeller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Add Product Error", err);
      // Display backend error message
      toast.error(err.response?.data?.message || err.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2 text-sm font-medium">Upload Image</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label
            htmlFor="image1"
            className="flex flex-col items-center justify-center w-28 h-28 gap-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
          >
            {!image1 ? (
              // Show upload icon when no image is selected
              <>
                <FaCloudUploadAlt className="h-10 w-10  text-secondary-foreground" />
                <span className="text-xs text-primary/60">Upload Image</span>
              </>
            ) : (
              // Show image preview when an image is selected
              <img
                src={URL.createObjectURL(image1)}
                alt="Product preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              accept="image/*"
              hidden
            />
          </label>
          <label
            htmlFor="image2"
            className="flex flex-col items-center justify-center w-28 h-28 gap-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
          >
            {!image2 ? (
              <>
                <FaCloudUploadAlt className="w-10 h-10 text-secondary-foreground" />
                <span className="text-xs text-primary/60">Upload Image</span>
              </>
            ) : (
              <img
                src={URL.createObjectURL(image2)}
                alt="Product preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              accept="image/*"
              hidden
            />
          </label>
          <label
            htmlFor="image3"
            className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-primary/5 transition-colors "
          >
            {!image3 ? (
              <>
                <FaCloudUploadAlt className="w-10 h-10 text-secondary-foreground" />
                <span className="text-xs text-primary/60">Upload Image</span>
              </>
            ) : (
              <img
                src={URL.createObjectURL(image3)}
                alt="Product preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              accept="image/*"
              hidden
            />
          </label>
          <label
            htmlFor="image4"
            className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
          >
            {!image4 ? (
              <>
                <FaCloudUploadAlt className="w-10 h-10 text-secondary-foreground" />
                <span className="text-xs text-primary/60">Upload Image</span>
              </>
            ) : (
              <img
                src={URL.createObjectURL(image4)}
                alt="Product preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Enter product name"
          required
          className="w-full max-w-125 px-3 py-2"
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type="text"
          placeholder="Enter product description"
          required
          className="w-full max-w-125 px-3 py-2"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Outerwear">Outerwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="Number"
            placeholder="0"
            className="w-full px-3 py-2 sm:w-30"
          />
        </div>
      </div>
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("S")
                  ? prev.filter((item) => item !== "S")
                  : [...prev, "S"],
              )
            }
          >
            <p
              className={`${sizes.includes("S") ? "bg-pink-100" : "bg-primary/10"} px-3 py-1 cursor-pointer`}
            >
              S
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("M")
                  ? prev.filter((item) => item !== "M")
                  : [...prev, "M"],
              )
            }
          >
            <p
              className={`${sizes.includes("M") ? "bg-pink-100" : "bg-primary/10"} px-3 py-1 cursor-pointer`}
            >
              M
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("L")
                  ? prev.filter((item) => item !== "L")
                  : [...prev, "L"],
              )
            }
          >
            <p
              className={`${sizes.includes("L") ? "bg-pink-100" : "bg-primary/10"} px-3 py-1 cursor-pointer`}
            >
              L
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XL")
                  ? prev.filter((item) => item !== "XL")
                  : [...prev, "XL"],
              )
            }
          >
            <p
              className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-primary/10"} px-3 py-1 cursor-pointer`}
            >
              XL
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XXL")
                  ? prev.filter((item) => item !== "XXL")
                  : [...prev, "XXL"],
              )
            }
          >
            <p
              className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-primary/10"} px-3 py-1 cursor-pointer`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to bestseller
        </label>
      </div>
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-primary text-secondary rounded-lg"
      >
        Add
      </button>
    </form>
  );
};
export default Add;
