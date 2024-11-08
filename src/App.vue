<template>
  <Card class="max-w-lg mx-auto border-none shadow-none">
    <!-- Header -->
    <CardHeader
      class="flex flex-row items-center justify-between space-y-0 pb-4"
    >
      <CardTitle class="text-lg font-medium">Money Limiter</CardTitle>
      <span class="text-sm text-muted-foreground">{{ currentDate() }}</span>
    </CardHeader>

    <CardContent class="px-4 pb-4">
      <Card>
        <CardContent class="grid grid-cols-3 gap-4 text-center py-4">
          <div>
            <Label class="text-xs text-gray-600">Total Limited</Label>
            <p class="font-semibold">{{ totalLimited.toLocaleString() }}</p>
          </div>
          <div>
            <Label class="text-xs text-gray-600">Total Expense</Label>
            <p class="font-semibold">{{ totalExpense.toLocaleString() }}</p>
          </div>
          <div>
            <Label class="text-xs text-gray-600">Total Available</Label>
            <p class="font-semibold">{{ totalAvailable.toLocaleString() }}</p>
          </div>
        </CardContent>
      </Card>
    </CardContent>

    <CardContent
      class="pb-4 flex flex-col px-4"
      style="height: calc(100dvh - (68px + 106px))"
    >
      <div
        class="flex-1 overflow-auto"
        style="height: calc(100dvh - (68px + 36px + 106px))"
      >
        <div
          v-if="!categories.length"
          class="flex h-full text-center justify-center items-center"
        >
          <div class="text-center w-full text-muted-foreground">
            <div class="inline-block">
              <DocumentMagnifyingGlassIcon class="w-16" />
            </div>
            <p class="text-sm mb-2">
              There are no categories to display right now.
            </p>
            <Button variant="outline" @click="initSampleCategories()">
              Create sample categories
            </Button>
          </div>
        </div>
        <div v-else>
          <draggable
            v-model="categories"
            :delay="200"
            :delay-on-touch-only="true"
            class="grid grid-cols-2 gap-3"
            item-key="id"
          >
            <template #item="{ element, index }">
              <CardCategory
                :key="index"
                @edit="handleEditCategoryClick"
                @delete="deleteCategory"
                :category="element"
                variant="outline"
                class="border rounded-xl"
              />
            </template>
          </draggable>
        </div>
      </div>

      <div class="flex gap-3 mt-2">
        <Button
          variant="destructive"
          class="w-full"
          @click="isClearDialogOpen = true"
        >
          Clear all items
        </Button>
        <Button class="w-full" @click="isAddDialogOpen = true">
          Add Category
        </Button>
      </div>
    </CardContent>

    <!-- Edit Dialog -->
    <Dialog :open="isEditDialogOpen" @update:open="isEditDialogOpen = $event">
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the category details here.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <form @submit="handleEditCategory" class="grid gap-4">
            <FormField
              v-slot="{ componentField }"
              name="name"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <Label for="name">Name</Label>
                  <Input placeholder="Category name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="limit"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <div class="grid gap-2">
                    <Label for="limit">Limit</Label>
                    <Input
                      type="number"
                      v-bind="componentField"
                      placeholder="Enter limit"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </form>
        </div>
        <DialogFooter class="flex-row gap-2">
          <Button
            class="flex-1"
            variant="outline"
            @click="isEditDialogOpen = false"
          >
            Cancel
          </Button>
          <Button class="flex-1" @click="handleEditCategory"> Save </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Dialog -->
    <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            The Category feature is used to manage daily expenses and item
            spending effectively.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <form @submit="handleAddCategory" class="grid gap-4">
            <FormField
              v-slot="{ componentField }"
              name="name"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <Label for="name">Name</Label>
                  <Input placeholder="Category name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="limit"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <div class="grid gap-2">
                    <Label for="limit">Limit</Label>
                    <Input
                      type="number"
                      v-bind="componentField"
                      placeholder="Enter limit"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </form>
        </div>
        <DialogFooter class="flex-row gap-2">
          <Button
            class="flex-1"
            variant="outline"
            @click="isAddDialogOpen = false"
          >
            Cancel
          </Button>
          <Button class="flex-1" @click="handleAddCategory"> Save </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Dialog -->
    <Dialog
      :open="isDeleteDialogOpen"
      @update:open="isDeleteDialogOpen = $event"
    >
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex-row gap-2">
          <Button
            class="flex-1"
            variant="outline"
            @click="isDeleteDialogOpen = false"
          >
            Cancel
          </Button>
          <Button class="flex-1" variant="destructive" @click="confirmDelete">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Clear all items Dialog -->
    <Dialog :open="isClearDialogOpen" @update:open="isClearDialogOpen = $event">
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Clear all items</DialogTitle>
          <DialogDescription>
            Are you sure you want to clear all items in each category? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex-row gap-2">
          <Button
            class="flex-1"
            variant="outline"
            @click="isClearDialogOpen = false"
          >
            Cancel
          </Button>
          <Button class="flex-1" variant="destructive" @click="clearAllItems">
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Category as CardCategory } from "./components/card/category";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { DocumentMagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import type { Category, CategoryItem } from "./types/category";
import { useCategoryStore } from "./stores/category";
import { storeToRefs } from "pinia";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import Draggable from "vuedraggable";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

const validationSchema = toTypedSchema(
  z.object({
    name: z
      .string({ message: "Name is required" })
      .min(1, { message: "Name is required" })
      .max(50),
    limit: z.number({ message: "Limit is required" }).min(0).max(100000000),
  })
);
const { isFieldDirty, handleSubmit, setValues } = useForm({ validationSchema });
const { create, update, initSampleCategories } = useCategoryStore();
const { categories } = storeToRefs(useCategoryStore());

const isAddDialogOpen = ref(false);
const categoryModel = reactive<Category>({
  id: 0,
  name: "",
  limit: 0,
  items: [],
});
const handleAddCategory = handleSubmit((values) => {
  const category: Partial<Category> = {
    ...values,
    items: [],
  };
  create(category);
  isAddDialogOpen.value = false;
});

const isEditDialogOpen = ref(false);
const handleEditCategoryClick = (category: Category) => {
  Object.assign(categoryModel, JSON.parse(JSON.stringify(category)));
  setValues(categoryModel);
  isEditDialogOpen.value = true;
};
const handleEditCategory = handleSubmit((values) => {
  update(categoryModel.id, values);
  isEditDialogOpen.value = false;
});

const isDeleteDialogOpen = ref(false);
const deleteIndex = ref<number>(0);
const deleteCategory = (index: number) => {
  deleteIndex.value = index;
  isDeleteDialogOpen.value = true;
};
const isClearDialogOpen = ref(false);

const confirmDelete = () => {
  if (deleteIndex.value !== null) {
    categories.value = categories.value.filter(
      (item) => item.id != deleteIndex.value
    );
  }
  isDeleteDialogOpen.value = false;
  deleteIndex.value = 0;
};

const clearAllItems = () => {
  categories.value.forEach((item) => (item.items = []));
  isClearDialogOpen.value = false;
};
const currentDate = () => {
  const today = new Date();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(today);
};
const totalLimited = computed(() =>
  categories.value.reduce((sum, item) => sum + item.limit, 0)
);
const totalExpense = computed(() =>
  categories.value.reduce(
    (sum, category) =>
      sum +
      category.items.reduce(
        (count: number, item: CategoryItem) => count + item.amount,
        0
      ),
    0
  )
);
const totalAvailable = computed(() => {
  const available = totalLimited.value - totalExpense.value;
  if (available > 0) {
    return available;
  }
  return 0;
});
</script>
