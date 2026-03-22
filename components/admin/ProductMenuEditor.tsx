"use client";

import { useState } from "react";

type MenuItem = {
  productId?: string;
  label: string;
  href: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function ProductMenuEditor({
  initialSections,
  productOptions
}: {
  initialSections: MenuSection[];
  productOptions: Array<{ id: string; name: string; slug: string }>;
}) {
  const [sections, setSections] = useState<MenuSection[]>(initialSections);

  const updateSection = (sectionIndex: number, title: string) => {
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex ? { ...section, title } : section
      )
    );
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    productId: string
  ) => {
    const product = productOptions.find((item) => item.id === productId);
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, childIndex) =>
                childIndex === itemIndex
                  ? {
                      ...item,
                      productId,
                      label: product?.name || "",
                      href: product ? `/product/${product.slug}` : "/#trending"
                    }
                  : item
              )
            }
          : section
      )
    );
  };

  const addSection = () => {
    setSections((current) => [
      ...current,
      {
        title: "New Section",
        items: [
          {
            productId: productOptions[0]?.id,
            label: productOptions[0]?.name || "Select Product",
            href: productOptions[0] ? `/product/${productOptions[0].slug}` : "/#trending"
          }
        ]
      }
    ]);
  };

  const removeSection = (sectionIndex: number) => {
    setSections((current) => current.filter((_, index) => index !== sectionIndex));
  };

  const addItem = (sectionIndex: number) => {
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  productId: productOptions[0]?.id,
                  label: productOptions[0]?.name || "Select Product",
                  href: productOptions[0]
                    ? `/product/${productOptions[0].slug}`
                    : "/#trending"
                }
              ]
            }
          : section
      )
    );
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.filter((_, childIndex) => childIndex !== itemIndex)
            }
          : section
      )
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Navbar Product Menu</h2>
          <p className="mt-1 text-xs text-slate-500">
            Add sections and choose items only from products already added or imported
            in the catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Add Section
        </button>
      </div>

      <input
        type="hidden"
        name="productsMenuSections"
        value={JSON.stringify(sections)}
      />

      <div className="mt-5 space-y-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={`${section.title}-${sectionIndex}`}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={section.title}
                onChange={(event) => updateSection(sectionIndex, event.target.value)}
                placeholder="Section title"
                className="min-w-[240px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => addItem(sectionIndex)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => removeSection(sectionIndex)}
                className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                Remove Section
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {section.items.map((item, itemIndex) => (
                <div
                  key={`${item.label}-${itemIndex}`}
                  className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-[1fr_1fr_auto]"
                >
                  <input
                    value={item.label}
                    readOnly
                    placeholder="Selected product"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <select
                    value={item.productId || ""}
                    onChange={(event) =>
                      updateItem(sectionIndex, itemIndex, event.target.value)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">Select product</option>
                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeItem(sectionIndex, itemIndex)}
                    className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
