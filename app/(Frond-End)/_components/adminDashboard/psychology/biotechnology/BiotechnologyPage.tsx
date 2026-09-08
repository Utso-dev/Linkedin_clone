"use client"

import { useState } from "react"
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes"
import CreateNewProductAction from "./CreateNewProductAction"
import ProductCatalogSection from "../ProductCatalogSection"
import CreateProductModal, {
  ProductFormValues,
  parsePlacement,
} from "../CreateProductModal"
import DeleteProductModal from "../DeleteProductModal"
import { biotechnologyCatalogs, ProductCatalog } from "./catalogData"
import { Product } from "../ProductCard"

export default function BiotechnologyPage() {
  const [catalogs, setCatalogs] = useState<ProductCatalog[]>(biotechnologyCatalogs)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<{
    product: Product
    catalogId: string
  } | null>(null)
  const [deleting, setDeleting] = useState<{
    productId: string
    catalogId: string
  } | null>(null)

  const openAddModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEditModal = (product: Product, catalogId: string) => {
    setEditing({ product, catalogId })
    setModalOpen(true)
  }

  const handleDelete = () => {
    if (!deleting) return

    setCatalogs((prev) =>
      prev.map((catalog) =>
        catalog.id === deleting.catalogId
          ? {
              ...catalog,
              products: catalog.products.filter(
                (product) => product.id !== deleting.productId,
              ),
            }
          : catalog,
      ),
    )
  }

  const handleSubmit = (data: ProductFormValues) => {
    const { catalogId, tabId } = parsePlacement(data.placement)
    const targetCatalog = catalogs.find((catalog) => catalog.id === catalogId)
    const tab = targetCatalog?.tabs.find((item) => item.id === tabId)
    if (!targetCatalog || !tab) return

    const nextProduct: Product = {
      id: editing?.product.id ?? `product-${Date.now()}`,
      title: data.title,
      subtitle: data.subtitle,
      tag: data.tag,
      categoryId: tabId,
      category: tab.label,
      description: data.description,
      imageUrl: data.imageUrl,
      learnMoreHref: data.learnMoreHref,
    }

    setCatalogs((prev) =>
      prev.map((catalog) => {
        if (editing) {
          const withoutProduct = catalog.products.filter(
            (product) => product.id !== editing.product.id,
          )
          if (catalog.id === catalogId) {
            return { ...catalog, products: [...withoutProduct, nextProduct] }
          }
          return { ...catalog, products: withoutProduct }
        }

        if (catalog.id !== catalogId) return catalog
        return { ...catalog, products: [...catalog.products, nextProduct] }
      }),
    )
  }

  return (
    <>
      <div className="pb-4 border-b border-[#E0E0E0]">
        <CustomTitleDescription
          title="Psychology Structure"
          description="Manage your industry sections and tabs."
          action={
            <div className="flex gap-2">
              <input type="text" placeholder="Search" className="w-full" />
              <CreateNewProductAction onClick={openAddModal} />
            </div>
          }
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {catalogs.map((catalog) => (
          <ProductCatalogSection
            key={catalog.id}
            id={catalog.id}
            title={catalog.title}
            tabs={catalog.tabs}
            products={catalog.products}
            onEdit={(product) => openEditModal(product, catalog.id)}
            onRemove={(productId) =>
              setDeleting({ productId, catalogId: catalog.id })
            }
          />
        ))}
      </div>

      <CreateProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={editing ? "edit" : "add"}
        catalogs={catalogs}
        product={editing?.product}
        catalogId={editing?.catalogId}
        onSubmit={handleSubmit}
      />

      <DeleteProductModal
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        onConfirm={handleDelete}
      />
    </>
  )
}
