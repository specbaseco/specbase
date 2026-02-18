export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string;
  description: string;
  partnership_status: 'active' | 'pending' | 'none';
  featured: boolean;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Product {
  id: string;
  manufacturer_id: string;
  category_id: string;
  model_number: string;
  name: string;
  description: string;
  specifications: Record<string, any>;
  datasheet_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
  manufacturer?: Manufacturer;
  category?: ProductCategory;
}

export interface SearchQuery {
  query?: string;
  category?: string;
  manufacturer?: string;
  specs?: Record<string, any>;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'name' | 'manufacturer' | 'newest';
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  facets: {
    categories: { name: string; count: number }[];
    manufacturers: { name: string; count: number }[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    request_id?: string;
  };
  error?: string;
}

export interface CompareRequest {
  product_ids: string[];
}

export interface CompareResult {
  products: Product[];
  comparison_fields: string[];
}
