<template>
  <Card variant="outline" class="border rounded-xl">
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
      <div class="text-xs text-muted-foreground mb-1">
        Limited: {{ category.limit }}
      </div>
      <div class="flex justify-between items-center">
        <div class="text-xs">
          Spent:
          {{ category.items.reduce((sum, item) => sum + item.amount, 0) }}
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
        <Badge v-else variant="secondary" class="text-xs"> Active </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Category } from "../../../types/category";
import { defineProps, defineEmits } from "vue";
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
} from "@heroicons/vue/24/outline";
import { Button } from "../../ui/button";

const props = defineProps<{ category: Category }>();
const emit = defineEmits(['edit', 'delete'])
</script>

<style lang="scss" scoped></style>
