import { Injectable } from '@nestjs/common';
import { z, ZodObject, ZodTypeAny } from 'zod';
import { FieldConfig, SchemaConfig } from './schema-config.interface';

@Injectable()
export class SchemabuilderService {
  buildSchema(config: SchemaConfig): ZodObject<Record<string, ZodTypeAny>> {
    const shape: Record<string, ZodTypeAny> = {};

    for (const field of config.fields) {
      shape[field.name] = this.buildFieldSchema(field);
    }

    return z.object(shape);
  }

  private buildFieldSchema(field: FieldConfig): ZodTypeAny {
    switch (field.type) {
      case 'string':
        return z.string().describe(field.description);
      case 'number':
        return z.number().describe(field.description);
      case 'boolean':
        return z.boolean().describe(field.description);
      case 'array':
        return this.buildArraySchema(field);
      default:
        return z.string().describe(field.description);
    }
  }

  private buildArraySchema(field: FieldConfig): ZodTypeAny {
    if (field.arrayItemType === 'object' && field.nestedFields) {
      const nestedShape: Record<string, ZodTypeAny> = {};
      for (const nested of field.nestedFields) {
        nestedShape[nested.name] = this.buildFieldSchema(nested);
      }
      return z.array(z.object(nestedShape)).describe(field.description);
    }

    const itemSchema =
      field.arrayItemType === 'number' ? z.number() : z.string();
    return z.array(itemSchema).describe(field.description);
  }
}
