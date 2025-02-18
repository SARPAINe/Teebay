import { useNavigate } from "react-router-dom";
import { ProductCardProps } from "../types";
import { convertTimestampToReadableDate } from "../utils/helper";
import { useEffect, useRef, useState } from "react";

const ProductCard = ({
  id,
  title,
  category,
  price,
  description,
  createdAt,
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
    navigate(`/products/${id}`);
  };

  return (
    <div
      className="p-4 border border-gray-200 rounded-md shadow-md hover:shadow-lg cursor-pointer transition-shadow"
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">Categories: {category.join(", ")}</p>
      <p className="text-sm font-semibold">Price: ${price}</p>
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
      <p className="text-sm font-semibold">
        Date Posted :{convertTimestampToReadableDate(createdAt)}
      </p>
    </div>
  );
};

export default ProductCard;
