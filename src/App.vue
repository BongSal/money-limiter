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
      <!-- Categories Grid -->
      <div class="flex-1">
        <div
          v-if="!categories.length"
          class="flex h-full text-center justify-center items-center"
        >
          <div class="text-center w-full text-muted-foreground">
            <div class="inline-block">
              <Empty />
            </div>
            <p class="text-sm">There are no categories to display right now.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-6" v-else>
          <Card
            v-for="(category, index) in categories"
            :key="index"
            variant="outline"
            class="border rounded-xl"
          >
            <CardContent class="p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">{{ category.name }}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger as="div">
                    <Button variant="ghost" size="icon" class="h-6 w-6">
                      <ChevronDownIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      @click="handleEditCategoryClick(category)"
                    >
                      <PencilSquareIcon class="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="deleteCategory(index)"
                      class="text-red-600 focus:text-red-600"
                    >
                      <TrashIcon class="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div class="text-xs text-muted-foreground mb-1">
                Limited: {{ category.limit }}
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs">
                  Spent:
                  {{
                    category.items.reduce((sum, item) => sum + item.amount, 0)
                  }}
                </div>
                <Badge
                  v-if="
                    category.items.reduce((sum, item) => sum + item.amount, 0) >
                    category.limit
                  "
                  variant="destructive"
                  class="text-xs"
                >
                  Exceed
                </Badge>
                <Badge v-else variant="secondary" class="text-xs">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div class="flex gap-3">
        <!-- Clear Button -->
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
                  <Input
                    v-model="categoryModel.name"
                    placeholder="Category name"
                    v-bind="componentField"
                  />
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
                      v-model="categoryModel.limit"
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
          <Button class="flex-1" variant="outline" @click="closeEditDialog">
            Cancel
          </Button>
          <Button class="flex-1" @click="handleEditCategory">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Dialog -->
    <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Make changes to the category details here.
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
                  <Input
                    v-model="categoryModel.name"
                    placeholder="Category name"
                    v-bind="componentField"
                  />
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
                      v-model="categoryModel.limit"
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
          <Button class="flex-1" @click="handleAddCategory">
            Save changes
          </Button>
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
          <Button class="flex-1" variant="destructive" @click="clearItems">
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Empty } from "./components/icons/empty";
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
import {
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
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
const resetModel = () => {
  Object.assign(categoryModel, {
    id: 0,
    name: "",
    limit: 0,
    items: [],
  });
};
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
const handleEditCategory = handleSubmit(() => {
  update(categoryModel.id, categoryModel);
  isEditDialogOpen.value = false;
});
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  resetModel();
};

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
      (_, index) => index !== deleteIndex.value
    );
  }
  isDeleteDialogOpen.value = false;
  deleteIndex.value = 0;
};

const clearItems = () => {
  categories.value = [];
};
</script>
