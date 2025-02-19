import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Select from "react-select";
import Button from "../components/Button";
import Label from "../components/Label";
import {
  CATEGORIES,
  CategoryType,
  RENT_CATEGORIES,
  RentCategoryType,
} from "../types/index";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT_MUTATION } from "../graphql/mutation";
import { GET_USER_PRODUCTS } from "../graphql/queries";
import { toast } from "react-toastify";

const categoryOptions = Object.keys(CATEGORIES).map((cat) => ({
  value: cat,
  label: CATEGORIES[cat as CategoryType],
}));

const rentCategoryOptions = Object.keys(RENT_CATEGORIES).map((cat) => ({
  value: cat,
  label: RENT_CATEGORIES[cat as RentCategoryType],
}));
const CreateProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categories: z
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

const CreateProduct = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      title: "",
      categories: [],
      description: "",
      price: 5,
      rentPrice: 0,
      // rentCategory: { value: "", label: "" },
    },
  });
  console.log("🚀 ~ CreateProduct ~ errors:", errors);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: GET_USER_PRODUCTS }],
    onCompleted: () => {
      toast.success("Product created successfully");
      navigate("/user/products");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    createProduct({
      variables: {
        input: {
          title: data.title,
          category: data.categories.map((cat: any) => cat.value),
          description: data.description,
          price: data.price,
          rentPrice: data.rentPrice,
          rentCategory: data.rentCategory.value,
        },
      },
    });
  };

  const handleNextPage = async () => {
    let fieldsToValidate: Array<
      | "title"
      | "categories"
      | "description"
      | "price"
      | "rentPrice"
      | "rentCategory"
    > = [];

    if (page === 1) {
      fieldsToValidate = ["title"];
    } else if (page === 2) {
      fieldsToValidate = ["categories"];
    } else if (page === 3) {
      fieldsToValidate = ["description"];
    } else if (page === 4) {
      fieldsToValidate = ["rentPrice", "rentCategory"];
    }

    const isValid = await trigger(fieldsToValidate);
    console.log("🚀 ~ handleNextPage ~ isValid:", isValid);
    if (isValid) {
      setPage(page + 1);
    }
  };

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <div>
            <Label>Select a title for your product</Label>
            <InputField
              id="title"
              label=""
              type="text"
              placeholder="Enter product title"
              register={control.register}
              error={errors?.title?.message}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <Label>Select categories</Label>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categoryOptions}
                  isMulti
                  className="w-full"
                />
              )}
            />
            {errors.categories && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categories.message}
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <Label>Select description</Label>
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
        );
      case 4:
        return (
          <div>
            <Label>Select price</Label>
            <InputField
              id="price"
              label=""
              type="number"
              placeholder="Enter product price"
              register={control.register}
              error={errors?.price?.message}
              valueAsNumber
            />
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col">
                <Label>Rent</Label>
                <div className="flex gap-4 items-center mb-4">
                  <InputField
                    id="rentPrice"
                    label=""
                    type="number"
                    placeholder="Enter rent price"
                    register={control.register}
                    // error={errors?.rentPrice?.message}
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
            </div>
          </div>
        );
      case 5:
        const formData = watch();
        return (
          <div>
            <Label>Summary</Label>
            <p>Title: {formData.title}</p>
            <p>
              Categories:{" "}
              {formData.categories.map((cat) => cat.label).join(", ")}
            </p>
            <p>Description: {formData.description}</p>
            <p>Price: ${formData.price}</p>
            <p>
              To rent: ${formData.rentPrice} per {formData.rentCategory.label}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <form>
        {renderPage()}
        <div
          className={`flex mt-4 ${
            page === 1 ? "justify-end" : "justify-between"
          }`}
        >
          {page > 1 && (
            <Button
              variant="confirm"
              type="button"
              onClick={() => setPage(page - 1)}
            >
              Back
            </Button>
          )}
          {page < 5 ? (
            <Button variant="confirm" type="button" onClick={handleNextPage}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleFormSubmit}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
