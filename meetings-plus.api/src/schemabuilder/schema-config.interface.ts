export interface FieldConfig {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  arrayItemType?: 'string' | 'number' | 'object';
  nestedFields?: FieldConfig[]; // For object types in arrays
}

export interface SchemaConfig {
  id: string;
  name: string;
  description: string;
  fields: FieldConfig[];
  createdAt: Date;
  updatedAt: Date;
}
