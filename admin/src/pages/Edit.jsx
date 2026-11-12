import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCheck, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { backendUrl } from "../config/config";
import { toast } from "react-toastify";

const Edit = ({ token }) => {
  // Get the product ID from the URL
  const { productId } = useParams();

  const navigate = useNavigate();

  // Store newly selected product images
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // Store existing product images from Cloudinary
  const [existingImages, setExistingImages] = useState([]);

  // Store product information
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Store loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store selected image previews
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

  // Group our 4 image states into one array so we can use .map()
  const selectedImages = [image1, image2, image3, image4];

  // Group the four state setter functions
  const imageSetters = [setImage1, setImage2, setImage3, setImage4];

  // Retrieve existing product details
  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(backendUrl + "/api/product/list");

        if (!active) return;

        if (response.data.success) {
          // Find product by Firestore document ID
          const product = response.data.products.find(
            (item) => item.id === productId,
          );

          if (!product) {
            toast.error("Product not found");
            navigate("/list");
            return;
          }

          // Populate the form with existing product information
          setName(product.name || "");
          setDescription(product.description || "");
          setPrice(product.price ?? "");
          setCategory(product.category || "");
          setSubCategory(product.subCategory || "");
          setBestSeller(product.bestseller ?? false);
          setSizes(product.sizes || []);

          // Store existing Cloudinary images
          setExistingImages(product.image || []);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        if (!active) return;

        console.error("Fetch Product Error:", err);
        toast.error(
          err.response?.data?.message || "Failed to load product details",
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchProduct();

    return () => {
      active = false;
    };
  }, [productId, navigate]);

  // Generate and clean up previews for newly selected images
  useEffect(() => {
    const previews = selectedImages.map((file) =>
      file ? URL.createObjectURL(file) : null,
    );

    setImagePreviews(previews);

    return () => {
      // Loop through every generated preview URL
      previews.forEach((url) => {
        // Check whether the URL exists and
        // release the temporary URL and its associated browser resources
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [image1, image2, image3, image4]);

  // Add or remove a selected product size
  const handleSizeChange = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  // Submit updated product information
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate required fields
    if (!name.trim() || !description.trim()) {
      return toast.error("Please complete all required fields");
    }

    if (!category || !subCategory) {
      return toast.error("Please select a category and subcategory");
    }

    if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
      return toast.error("Please enter a valid product price");
    }

    if (sizes.length === 0) {
      return toast.error("Please select at least one size");
    }

    setIsSubmitting(true);

    try {
      // Create FormData to store updated product details
      const formData = new FormData();

      // Add product information
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestSeller);

      // Convert sizes array to JSON string
      formData.append("sizes", JSON.stringify(sizes));

      // Add images only if new files are selected
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // Send updated product data to backend with admin token
      const response = await axios.put(
        backendUrl + "/api/product/" + productId,
        formData,
        { headers: { token } },
      );

      // Check whether the product was updated successfully
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Update Product Error:", err);

      // Display backend error message
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="p-6">Loading product details...</p>;
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Product Images */}
      <div>
        <p className="mb-2 text-sm font-medium">Product Images</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {selectedImages.map((image, index) => (
            <label
              key={index}
              htmlFor={`image ${index + 1}`}
              className="flex flex-col items-center justify-center w-28 h-28 gap-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-primary/5 transition-colors overflow-hidden"
            >
              {imagePreviews[index] || existingImages[index] ? (
                // Show new preview or existing Cloudinary image
                <img
                  src={imagePreviews[index] || existingImages[index]}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                // Show upload icon if no image exists
                <>
                  <FaCloudUploadAlt className="w-10 h-10 text-secondary-foreground" />
                  <span className="text-xs text-primary/60">Upload Image</span>
                </>
              )}

              <input
                onChange={(e) =>
                  imageSetters[index](e.target.files?.[0] || null)
                }
                type="file"
                id={`image ${index + 1}`}
                accept="image/*"
                hidden
              />
            </label>
          ))}
        </div>

        <p className="mt-2 text-xs text-primary/30">
          Select an image to replace an existing one. Unchanged images will be
          kept.
        </p>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Enter product name"
          required
          className="w-full max-w-125 px-3 py-2 text-primary/60"
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Enter product description"
          required
          className="w-full max-w-125 px-3 py-2 text-primary/60"
        />
      </div>

      {/* Category*/}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            required
            className="w-full px-3 py-2 text-primary/60"
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            required
            className="w-full px-3 py-2 text-primary/60"
          >
            <option value="" disabled>
              Select subcategory
            </option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Outerwear">Outerwear</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            required
            className="w-full px-3 py-2 sm:w-30 text-primary/60"
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex flex-wrap gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 cursor-pointer ${sizes.includes(size) ? "bg-pink-100" : "bg-primary/10"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={(e) => setBestSeller(e.target.checked)}
          checked={bestSeller}
          type="checkbox"
          id="bestseller"
        />

        <label htmlFor="bestseller" className="cursor-pointer">
          Add to bestseller
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-slate-800 text-secondary rounded-lg cursor-pointer disabled:opacity/50 transition duration-200"
        >
          <FaCheck className="text-green-500" />
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/list")}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white border border-border rounded-lg cursor-pointer transition duration-200"
        >
          <FaXmark />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Edit;
