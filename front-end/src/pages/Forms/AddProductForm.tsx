import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

type ProductForm = {
  title: string;
  category: string;
  sku: string;
  originalPrice: string;
  sellingPrice: string;
  quantity: string;
  description: string;
};

export default function ProductFormPage() {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    category: "",
    sku: "",
    originalPrice: "",
    sellingPrice: "",
    quantity: "",
    description: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "books", label: "Books" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (name: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.sellingPrice) {
      alert("Title and selling price are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      files.forEach((file) => formData.append("images", file));

      // 🔥 Replace with your API
      await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      alert("Product created successfully");

      setFiles([]);
      setForm({
        title: "",
        type: "",
        category: "",
        brand: "",
        sku: "",
        originalPrice: "",
        sellingPrice: "",
        quantity: "",
        description: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <ComponentCard title="Product Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input name="title" id="title" placeholder="Verbatim Silent Dual Mode Wireless Mouse" value={form.title} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              options={categories}
              id="category"
              onChange={(v) => handleSelect("category", v)}
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input placeholder="LAPTOP-DEL-7480-I7" id="sku" name="sku" value={form.sku} onChange={handleChange} />
          </div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="10"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              type="number"
              name="originalPrice"
              id="originalPrice"
              placeholder="Tk: 1450"
              value={form.originalPrice}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="sellingPrice">Selling Price *</Label>
            <Input
              type="number"
              id="sellingPrice"
              placeholder="Tk: 1500"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="description" >Description</Label>
          <TextArea
            id="description"
            placeholder="Receipt Info (optional)"
            rows={5}
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Images">
        <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
          <div
            {...getRootProps()}
            className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
              ${
                isDragActive
                  ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
              }
            `}
          >
            {/* Hidden Input */}
            <input {...getInputProps()} />

            <div className="dz-message flex flex-col items-center m-0!">
              {/* Icon Container */}
              <div className="mb-[22px] flex justify-center">
                <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <svg
                    className="fill-current"
                    width="29"
                    height="28"
                    viewBox="0 0 29 28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
              </h4>

              <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                Drag and drop your PNG, JPG, WebP, SVG images here or browse
              </span>

              <span className="font-medium underline text-theme-sm text-brand-500">
                Browse File
              </span>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <p className="text-sm mt-2">{files.length} file(s) selected</p>
        )}
      </ComponentCard>

      <div className="mt-6 text-end">
        <button disabled={loading} type="submit" className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600 mr-auto">Save</button> 
      </div>
    </form>
  );
}
