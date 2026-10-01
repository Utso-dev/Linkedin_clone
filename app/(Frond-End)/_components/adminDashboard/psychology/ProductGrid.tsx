import ProductCard, { Product } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
    onEdit?: (id: string) => void;
    onRemove?: (id: string) => void;
    onDuplicate?: (id: string) => void;
}

export default function ProductGrid({
    products,
    onEdit,
    onRemove,
    onDuplicate,
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <p className="py-12 text-center text-sm text-[#9A9CA3]">
                No products in this category.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    category={product.category}
                    description={product.description}
                    imageUrl={product.imageUrl}
                    learnMoreHref={product.learnMoreHref}
                    onEdit={onEdit}
                    onRemove={onRemove}
                    onDuplicate={onDuplicate}
                />
            ))}
        </div>
    );
}
