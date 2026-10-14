import { Plus } from "lucide-react";
import Link from "next/link";
import AdvertisementsPage from "../_component/advertisements/AdvertisementsPage";

function page() {
  return (
    <div>
      {/* Top Header: Title + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
        <div className="max-w-113">
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
            Product Dashboard
          </h1>
          <p className="text-sm leading-[140%] sm:text-base text-descriptionColor mt-1">
            Submit, track and measure clinical outreach campaigns across the
            Mind Unite professional network.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            href="/mu/products/create-products"
            className="flex items-center gap-1.5 bg-primaryColor hover:bg-primaryColor/90 text-white px-4 py-2 lg:py-3 rounded-sm text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>
      <AdvertisementsPage />
    </div>
  );
}

export default page;
