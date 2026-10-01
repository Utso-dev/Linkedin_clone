export type IndustryType = "biotechnology" | "psychotropics" | string;

export interface CategoryItem {
  id: number;
  category_name: string;
}

export interface CategorySection {
  id: number;
  industry_type: IndustryType;
  name: string;
  categories: CategoryItem[];
}

export interface CategoryPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more_pages: boolean;
}

export interface NetworkCategoryData {
  network: string;
  sections: CategorySection[];
  pagination: CategoryPagination;
}

export interface GetCategorySectionsResponse {
  success: boolean;
  message: string;
  data: NetworkCategoryData;
}

export interface GetCategorySectionsQueryParams {
  type?: IndustryType | "";
  per_page?: number;
  page?: number;
  [key: string]: unknown;
}

export interface GetCategorySectionsParams {
  network?: string;
  query?: GetCategorySectionsQueryParams;
}

export interface GetPsychologySectionsParams {
  query?: GetCategorySectionsQueryParams;
}

export interface GetNeuroscienceSectionsParams {
  query?: GetCategorySectionsQueryParams;
}

// ============ Section CRUD Types ============

export interface CreateSectionPayload {
  industry_type: IndustryType;
  name: string;
}

export interface CreateSectionArgs {
  network?: string;
  body: CreateSectionPayload;
}

export interface CreateSectionResponse {
  success: boolean;
  message?: string;
  data?: CategorySection;
}

export interface UpdateSectionPayload {
  industry_type: IndustryType;
  name: string;
}

export interface UpdateSectionArgs {
  network?: string;
  id: number | string;
  body: UpdateSectionPayload;
}

export interface UpdateSectionResponse {
  success: boolean;
  message?: string;
  data?: CategorySection;
}

export interface DeleteSectionArgs {
  id: number | string;
}

export interface DeleteSectionResponse {
  success: boolean;
  message?: string;
}

// ============ Category / Subcategory Tab CRUD Types ============

export interface CreateCategoryTabPayload {
  section_id: number | string;
  category_name: string;
}

export interface UpdateCategoryTabPayload {
  category_name: string;
}

export interface CreateCategoryTabArgs {
  section_id?: number | string;
  body?: UpdateCategoryTabPayload;
  category_name?: string;
}

export interface UpdateCategoryTabArgs {
  id: number | string;
  body?: UpdateCategoryTabPayload;
  category_name?: string;
}

export interface CreateCategoryTabResponse {
  success: boolean;
  message?: string;
  data?: CategoryItem;
}

export interface UpdateCategoryTabResponse {
  success: boolean;
  message?: string;
  data?: CategoryItem;
}

export interface DeleteCategoryTabResponse {
  success: boolean;
  message?: string;
}
