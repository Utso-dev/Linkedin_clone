"use client";

import { useState } from "react";
import CategoryTabs, { CategoryTab } from "./CategoryTabs";
import SectionHeader from "./SectionHeader";
import ProductGrid from "./ProductGrid";
import { Product } from "./ProductCard";

interface ProductCatalogSectionProps {
    id: string;
    title: string;
    tabs: CategoryTab[];
    products: Product[];
    onEdit?: (product: Product) => void;
    onRemove?: (id: string) => void;
}

export default function ProductCatalogSection({
    id,
    title,
    tabs,
    products,
    onEdit,
    onRemove,
}: ProductCatalogSectionProps) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "all");
    const [expanded, setExpanded] = useState(false);

    const visibleProducts =
        activeTab === "all"
            ? products
            : products.filter((product) => product.categoryId === activeTab);

    const canExpand = visibleProducts.length > 3;
    const displayedProducts =
        expanded || !canExpand
            ? visibleProducts
            : visibleProducts.slice(0, 3);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setExpanded(false);
    };

    return (
        <section className="rounded-[8px] bg-[#F6F8FA] p-4">
            <SectionHeader
                title={title}
                expanded={expanded}
                canExpand={canExpand}
                onToggleExpand={() => setExpanded((prev) => !prev)}
            />
            <CategoryTabs
                tabs={tabs}
                value={activeTab}
                onValueChange={handleTabChange}
            />
            <div className="mt-4">
                <ProductGrid
                    products={displayedProducts}
                    onEdit={(productId) => {
                        const product = products.find((item) => item.id === productId);
                        if (product) onEdit?.(product);
                    }}
                    onRemove={onRemove}
                />
            </div>
        </section>
    );
}
