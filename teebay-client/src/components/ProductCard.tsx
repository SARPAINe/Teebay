import { useNavigate } from "react-router-dom";
import { ProductCardProps } from "../types";
import {
  convertTimestampToReadableDate,
  formatCategory,
} from "../utils/helper";
import { useEffect, useRef, useState } from "react";
import { Trash } from "lucide-react";

const ProductCard = ({
  id,
  title,
  category,
  price,
  description,
  createdAt,
  onDelete,
  showDelete = false,
  routePath = `/products/${id}`,
  rentPrice,
  rentCategory,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight,
        10
      );
      const descriptionHeight = descriptionRef.current.offsetHeight;
      setIsTruncated(descriptionHeight > lineHeight);
    }
  }, [description]);

  const handleClick = () => {
    navigate(routePath);
  };
  console.log("🚀 ~ rentPrice:", rentPrice);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(String(id));
  };

  return (
    <div
      className="p-4 border border-gray-200 rounded-md shadow-md hover:shadow-lg cursor-pointer transition-shadow relative"
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">
        Categories: {category.map(formatCategory).join(", ")}
      </p>
      <p className="text-sm font-semibold">{`Price: ${price} ${
        rentPrice ? `| Rent: $${rentPrice} ${rentCategory?.toLowerCase()}` : ""
      }`}</p>
      <p className="text-sm text-gray-600" ref={descriptionRef}>
        {description}{" "}
        {isTruncated && (
          <span
            className="text-blue-500 font-semibold hover:underline"
            onClick={handleClick}
          >
            More Details
          </span>
        )}
      </p>
      {createdAt && (
        <p className="text-sm font-semibold">
          Date Posted :{convertTimestampToReadableDate(createdAt!)}
        </p>
      )}
      {showDelete && (
        <button
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          onClick={handleDelete}
        >
          <Trash />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
