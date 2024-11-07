<template>
  <Card class="max-w-lg mx-auto border-none shadow-none">
    <!-- Header -->
    <CardHeader
      class="flex flex-row items-center justify-between space-y-0 pb-4"
    >
      <CardTitle class="text-lg font-medium">Money Limiter</CardTitle>
      <span class="text-sm text-muted-foreground">Dec 12, 2024</span>
    </CardHeader>

    <CardContent class="pb-4 flex flex-col" style="height: calc(100vh - 68px)">
      <div class="flex-1">
        <div
          v-if="!categories.length"
          class="flex h-full text-center justify-center items-center"
        >
          <div class="text-center w-full text-muted-foreground">
            <div class="inline-block">
              <DocumentMagnifyingGlassIcon class="w-16" />
            </div>
            <p class="text-sm">There are no categories to display right now.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-6" v-else>
          <CardCategory
            v-for="(category, index) in categories"
            :key="index"
            @edit="handleEditCategoryClick"
            @delete="deleteCategory"
            :category="category"
            variant="outline"
            class="border rounded-xl"
          />
        </div>
      </div>

      <div class="flex gap-3">
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
            Are you sure you want to clear all items? This action cannot be
            undone.
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
import type { Category } from "./types/category";
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
const { create, update } = useCategoryStore();
const { categories } = storeToRefs(useCategoryStore());

const isAddDialogOpen = ref(false);
const categoryModel = reactive<Category>({
  id: 0,
  name: "",
  limit: 0,
  items: [],
});
const handleAddCategory = handleSubmit(() => {
  create(categoryModel);
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
</script>
