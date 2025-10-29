import { z } from 'zod';

export const ProductSchema = z
  .object({
    id: z.number(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number().nonnegative(),
    deluxePrice: z.number().optional(),
    image: z.string(),
  })
  .passthrough();

export const ProductListSchema = z.array(ProductSchema);
