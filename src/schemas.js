import { z } from 'zod';

export const slugSchema = z.string()
  .min(1, 'El slug es requerido')
  .regex(/^[a-z0-9-]+$/, 'Slug invalido');

export const paisSchema = z.string()
  .min(1, 'El pais es requerido')
  .regex(/^[a-zA-Z\u00C0-\u00FF\s]+$/, 'Pais invalido');

export const searchSchema = z.string()
  .min(3, 'El texto de busqueda debe tener al menos 3 caracteres');

export const mundialSchema = z.object({
  nombre: z.string().min(1),
  anio: z.number().int().min(1930),
  sede: z.string().min(1),
  campeon: z.string().min(1),
  subcampeon: z.string().min(1),
  goleador: z.string().min(1),
  equipos: z.number().int().positive(),
  imagen: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  resumen: z.string().min(1),
  descripcion: z.string().min(1),
});