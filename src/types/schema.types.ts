import { z } from 'zod';

const carRequestSchema = z.object({
  id: z.string().optional(),
  dealer: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number().gt(1900).lt(2024),
  color: z.string(),
  price: z.number().positive(),
  registerNumber: z.string(),
  mileage: z.number().positive(),
  description: z.string(),
  registeredAt: z.coerce.date(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

type CarPostRequest = z.infer<typeof carRequestSchema>;

type Car = Required<CarPostRequest>;

export { CarPostRequest, Car, carRequestSchema };
