import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Category } from "@/types/category";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Array<Category>>(
    JSON.parse(localStorage.getItem("categories") || "[]")
  );
  const create = (category: Partial<Category>) => {
    category.id = Date.now();
    categories.value.push(JSON.parse(JSON.stringify(category)));
  };
  const remove = (id: number) => {
    categories.value = categories.value.filter((item) => item.id !== id);
  };
  const update = (id: number, updatedData: Partial<Category>) => {
    const itemIndex = categories.value.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      categories.value[itemIndex] = {
        ...categories.value[itemIndex],
        ...updatedData,
      };
    }
  };

  const initSampleCategories = () => {
    const expenseCategories = [
      "Food & Groceries",
      "Transportation",
      "Housing",
      "Personal Care",
      "Health & Wellness",
      "Entertainment & Leisure",
      "Dining Out",
      "Clothing & Accessories",
      "Education & Learning",
      "Household Supplies",
      "Miscellaneous",
    ];
    const defaultCategories: Array<Category> = expenseCategories.map((item) => ({
      id: Date.now(),
      name: item,
      items: [],
      limit: 10000,
    }))
    categories.value = defaultCategories
  };

  watch(
    categories,
    (newCategories) => {
      localStorage.setItem("categories", JSON.stringify(newCategories));
    },
    { deep: true }
  );

  return { categories, create, remove, update, initSampleCategories };
});
