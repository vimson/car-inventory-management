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

const carPutRequestSchema = z.object({
  dealer: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().gt(1900).lt(2024).optional(),
  color: z.string().optional(),
  price: z.number().positive().optional(),
  registerNumber: z.string().optional(),
  mileage: z.number().positive().optional(),
  description: z.string().optional(),
  registeredAt: z.coerce.date().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  updatedAt: z.string().datetime().optional(),
});

const carSearchSchema = z.object({
  regNumber: z.string().optional(),
  dealer: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  registeredAfter: z.coerce.date().optional(),
  registeredBefore: z.coerce.date().optional(),
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),
  limit: z.number().lt(25).optional(),
  nextPageOffset: z.string().optional(),
  sortBy: z.enum(['asc', 'desc']).optional(),
});

type CarPostRequest = z.infer<typeof carRequestSchema>;

type CarPutRequest = z.infer<typeof carPutRequestSchema>;

type Car = Required<CarPostRequest>;

type CarSearchParams = z.infer<typeof carSearchSchema>;

type SearchResult = {
  results?: Car[];
  nextPageOffset?: string;
};

type EnvironmentVars = {
  [key: string]: string;
};

export { CarPostRequest, CarPutRequest, Car, CarSearchParams, EnvironmentVars, SearchResult };

export { carRequestSchema, carPutRequestSchema, carSearchSchema };
