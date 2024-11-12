import { ICategory } from "../models/Category";

type CategoryResponse = {
    _id: string;
    name: string;
}

function toCategoryResponse(category: ICategory): CategoryResponse {
    return {
        _id: category._id.toString(),
        name: category.name
    }
}

export function toCategoryResponses(categories: ICategory[]): CategoryResponse[] {
    const categoryResponses: CategoryResponse[] = [];
    for (const category of categories) {
        categoryResponses.push(toCategoryResponse(category));
    }
    return categoryResponses;
}