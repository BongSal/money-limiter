<template>
  <Card
    variant="outline"
    class="border rounded-xl transition duration-200 transform hover:cursor-pointer"
    @mousedown="isPressed = true"
    :class="{ 'scale-95': isPressed }"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
    @click="handleCardClick"
  >
    <CardContent class="p-4">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium">{{ category.name }}</span>
        <DropdownMenu>
          <DropdownMenuTrigger as="div" @click.stop>
            <Button variant="ghost" size="icon" class="h-6 w-6">
              <ChevronDownIcon class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="$emit('edit', category)">
              <PencilSquareIcon class="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="$emit('delete', category.id)"
              class="text-red-600 focus:text-red-600"
            >
              <TrashIcon class="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div class="text-xs text-muted-foreground mb-2">
        Limited: {{ category.limit.toLocaleString() }}
      </div>
      <div class="flex justify-between items-center">
        <div class="text-xs">
          Available:
          <Badge v-if="available > 0" variant="outline">
            {{ available.toLocaleString() }}
          </Badge>
          <Badge v-else variant="destructive" class="text-xs"> None </Badge>
        </div>
      </div>
    </CardContent>

    <Dialog
      :open="isAddItemDialogOpen"
      @update:open="isAddItemDialogOpen = $event"
    >
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle> Add Item to {{ category.name }} </DialogTitle>
          <DialogDescription>
            The Category feature is used to manage daily expenses and item
            spending effectively.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <form @submit="handleAddItem" class="grid gap-4">
            <FormField
              v-slot="{ componentField }"
              name="name"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <Label for="name">Name</Label>
                  <Input placeholder="Item name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="amount"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <div class="grid gap-2">
                    <Label for="amount">Amount</Label>
                    <Input
                      type="number"
                      v-bind="componentField"
                      placeholder="Enter amount"
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
            @click="
              () => {
                isAddItemDialogOpen = false;
                isItemsListDialogOpen = true;
              }
            "
          >
            Cancel
          </Button>
          <Button class="flex-1" @click="handleAddItem"> Save </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      :open="isEditItemDialogOpen"
      @update:open="isEditItemDialogOpen = $event"
    >
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle> Edit item of {{ category.name }} </DialogTitle>
          <DialogDescription>
            The Category feature is used to manage daily expenses and item
            spending effectively.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <form @submit="handleAddItem" class="grid gap-4">
            <FormField
              v-slot="{ componentField }"
              name="name"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <Label for="name">Name</Label>
                  <Input placeholder="Item name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="amount"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormControl>
                  <div class="grid gap-2">
                    <Label for="amount">Amount</Label>
                    <Input
                      type="number"
                      v-bind="componentField"
                      placeholder="Enter amount"
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
            variant="destructive"
            @click="handleDeleteItem"
          >
            Delete
          </Button>
          <Button class="flex-1" @click="handleEditItem"> Save </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      :open="isItemsListDialogOpen"
      @update:open="isItemsListDialogOpen = $event"
    >
      <DialogContent class="max-w-[360px] sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{{ category.name }}</DialogTitle>
          <DialogDescription>
            The Category feature is used to manage daily expenses and item
            spending effectively.
          </DialogDescription>
        </DialogHeader>

        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <Label class="text-xs text-gray-600">Limited</Label>
            <p class="font-semibold">{{ category.limit.toLocaleString() }}</p>
          </div>
          <div>
            <Label class="text-xs text-gray-600">Expense</Label>
            <p class="font-semibold">{{ totalExpense.toLocaleString() }}</p>
          </div>
          <div>
            <Label class="text-xs text-gray-600">Available</Label>
            <div>
              <Badge variant="outline" class="text-xs" v-if="available > 0">
                {{ available.toLocaleString() }}
              </Badge>
              <Badge variant="destructive" class="text-xs" v-else> None </Badge>
            </div>
          </div>
        </div>

        <div
          v-if="!category.items.length"
          class="flex h-48 text-center justify-center items-center"
        >
          <div class="text-center w-full text-muted-foreground">
            <div class="inline-block">
              <DocumentMagnifyingGlassIcon class="w-16" />
            </div>
            <p class="text-sm">There are no items to display right now.</p>
          </div>
        </div>
        <div class="py-4 flex flex-col gap-2 max-h-96 overflow-auto" v-else>
          <Label class="text-gray-600">Items</Label>
          <Card
            v-for="item in category.items"
            :key="item.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="handleEditItemClick(item)"
          >
            <CardContent class="p-4 py-2">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <h3 class="font-medium">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ formatTimestamp(item.id) }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="font-medium">
                    {{ item.amount.toLocaleString() }}
                  </span>
                  <ChevronRightIcon class="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter class="flex-row gap-2">
          <Button class="flex-1" variant="outline" @click="handleAddItemClick">
            Add Item
          </Button>
          <Button class="flex-1" @click="isItemsListDialogOpen = false">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>

<script setup lang="ts">
import type { Category, CategoryItem } from "../../../types/category";
import { defineProps, defineEmits, ref, reactive, computed } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  ChevronRightIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const isPressed = ref<boolean>(false);
const props = defineProps<{ category: Category }>();
const emit = defineEmits(["edit", "delete"]);
const validationSchema = toTypedSchema(
  z.object({
    name: z
      .string({ message: "Name is required" })
      .min(1, { message: "Name is required" })
      .max(50),
    amount: z
      .number({ message: "Amount is required" })
      .min(1, { message: "Amount is required" })
      .max(100000000),
  })
);
const { isFieldDirty, handleSubmit, setValues } = useForm({ validationSchema });
const isAddItemDialogOpen = ref(false);
const handleAddItem = handleSubmit((values) => {
  const item: CategoryItem = {
    id: Date.now(),
    name: values.name,
    amount: values.amount,
  };
  props.category.items.push(item);
  isAddItemDialogOpen.value = false;
  isItemsListDialogOpen.value = true;
});

const isEditItemDialogOpen = ref(false);
const selectedItem = reactive<Partial<CategoryItem>>({});
const handleEditItemClick = (item: CategoryItem) => {
  Object.assign(selectedItem, item);
  setValues({ name: item.name, amount: item.amount });
  isItemsListDialogOpen.value = false;
  isEditItemDialogOpen.value = true;
};
const handleEditItem = handleSubmit((values) => {
  const itemIndex = props.category.items.findIndex(
    (item) => item.id === selectedItem.id
  );
  if (itemIndex !== -1) {
    props.category.items[itemIndex] = {
      ...props.category.items[itemIndex],
      ...values,
    };
  }

  isItemsListDialogOpen.value = true;
  isEditItemDialogOpen.value = false;
});
const handleDeleteItem = () => {
  isEditItemDialogOpen.value = false;
  isItemsListDialogOpen.value = true;
  props.category.items = props.category.items.filter(
    (item) => item.id !== selectedItem.id
  );
};

const isItemsListDialogOpen = ref(false);
const handleCardClick = () => {
  isItemsListDialogOpen.value = true;
};
const handleAddItemClick = () => {
  isItemsListDialogOpen.value = false;
  isAddItemDialogOpen.value = true;
};
const formatTimestamp = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
};
const totalExpense = computed(() => {
  return props.category.items.reduce((sum, item) => sum + item.amount, 0);
});
const available = computed(() => {
  const total = props.category.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const leftAmount = props.category.limit - total;
  if (leftAmount > 0) return leftAmount;
  return 0;
});
</script>

<style lang="scss" scoped></style>
