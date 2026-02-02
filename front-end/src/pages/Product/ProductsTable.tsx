import { useState } from "react";
import { Link } from "react-router";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  date: string;
  image: string;
};

const productsData: Product[] = [
  {
    id: 1,
    name: "ASUS ROG Gaming Laptop",
    category: "Laptop",
    price: 2199,
    stock: 12,
    date: "01 Dec, 2027",
    image: "/images/product/product-03.jpg",
  },
  {
    id: 2,
    name: "Airpods Pro 2nd Gen",
    category: "Accessories",
    price: 839,
    stock: -23,
    date: "29 Jun, 2027",
    image: "/images/product/product-01.jpg",
  },
];

export default function ProductsTable() {
  const [search, setSearch] = useState<string>("");

  const filtered = productsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div className="relative flex-1 sm:flex-auto">
          <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            placeholder="Search..."
            className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>

        <div className="flex gap-3">
          <Link to="/add-product" className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600" >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10.0002H15.0006M10.0002 5V15.0006" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p: Product) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-5 py-4 flex items-center gap-3">
                  <img src={p.image} alt="" className="h-10 w-10 rounded-md" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-5 py-4">{p.category}</td>
                <td className="px-5 py-4">${p.price}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      p.stock > 0
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-4">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
