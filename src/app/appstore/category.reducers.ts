import { updateCategory,createCategory,deleteCategory,loadCategory } from './category.actions';
import { createReducer, on } from '@ngrx/store';
import { CategoryService } from '../inventoryServices/category.service';


//const categoryService:C
export const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(loadCategory, (state) =>state+1),








  on(updateCategory, (state) => state - 1),
  on(createCategory, (state) => 0),
  on(deleteCategory, (state) => 0)
);