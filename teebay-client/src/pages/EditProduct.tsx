import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import InputField from "../components/InputField";
import Select from "react-select";
import Button from "../components/Button";
import Label from "../components/Label";
import {
  CATEGORIES,
  CategoryType,
  RENT_CATEGORIES,
  RentCategoryType,
} from "../types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GET_PRODUCT_DETAILS, GET_USER_PRODUCTS } from "../graphql/queries";
import { UPDATE_PRODUCT_MUTATION } from "../graphql/mutation";
import { toast } from "react-toastify";
import { formatCategory } from "../utils/helper";

const categoriesOptions = Object.keys(CATEGORIES).map((cat) => ({
  value: cat,
  label: CATEGORIES[cat as CategoryType],
}));

const rentCategoryOptions = Object.keys(RENT_CATEGORIES).map((cat) => ({
  value: cat,
  label: RENT_CATEGORIES[cat as RentCategoryType],
}));

const EditProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "At least one category is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number({ required_error: "Price is required" }),
  rentPrice: z.number({ required_error: "Rent price is required" }),
  rentCategory: z
    .object({
      value: z.string().nonempty("Rent category must be selected"),
      label: z.string(),
    })
    .refine(
      (value) =>
        rentCategoryOptions.some((option) => option.value === value.value),
      {
        message: "Rent category is required and must be a valid option",
      }
    ),
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EditProductSchema),
  });
  const navigate = useNavigate();
  console.log("🚀 ~ EditProduct ~ errors:", errors);

  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    fetchPolicy: "network-only",
    variables: { id: parseInt(id!) },
    onCompleted: (data) => {
      const product = data.product;
      console.log("🚀 ~ EditProduct ~ product:", product);
      setValue("title", product.title);
      setValue(
        "category",
        product.category.map((cat: string) => ({
          value: cat,
          label: formatCategory(cat),
        }))
      );
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("rentPrice", product.rentPrice);
      setValue("rentCategory", {
        value: product.rentCategory,
        label: RENT_CATEGORIES[product.rentCategory as RentCategoryType],
      });
    },
  });

  const [editProduct] = useMutation(UPDATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: GET_USER_PRODUCTS }],
    onCompleted: () => {
      toast.success("Product updated successfully");
      navigate("/user/products");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    editProduct({
      variables: {
        id: parseInt(id!),
        editInput: {
          title: data.title,
          category: data.category.map((cat) => cat.value),
          description: data.description,
          price: data.price,
          rentPrice: data.rentPrice,
          rentCategory: data.rentCategory.value,
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Title</Label>
          <InputField
            id="title"
            label=""
            type="text"
            placeholder="Enter product title"
            register={control.register}
            error={errors?.title?.message}
          />
        </div>
        <div>
          <Label>Categories</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={categoriesOptions}
                isMulti
                className="w-full"
              />
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            id="description"
            placeholder="Enter product description"
            className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B51F8] focus:border-transparent"
            {...control.register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex flex-col w-1/2 items-start">
            <Label>Price</Label>
            <InputField
              id="price"
              label=""
              type="number"
              placeholder="Enter product price"
              register={control.register}
              error={errors?.price?.message}
              valueAsNumber
              step="0.01"
            />
          </div>
          <div className="flex flex-col w-1/2 items-start">
            <Label>Rent</Label>
            <div className="flex gap-4 items-center">
              <InputField
                id="rentPrice"
                label=""
                type="number"
                step="0.01"
                placeholder="Enter rent price"
                register={control.register}
                error={errors?.rentPrice?.message}
                valueAsNumber
              />
              <Controller
                name="rentCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select option"
                    options={rentCategoryOptions}
                    className="w-full"
                  />
                )}
              />
            </div>
            {errors.rentPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rentPrice.message}
              </p>
            )}
            {errors.rentCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rentCategory.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Edit Product</Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
