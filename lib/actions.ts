import { prisma } from "./prisma";

export interface FilterParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export async function getFilteredProducts(params: FilterParams) {
  try {
    const { category, brand, minPrice, maxPrice, inStock } = params;

    const whereClause: any = {};

    if (category) {
      whereClause.category = { slug: category };
    }
    if (brand && brand.trim() !== "") {
      const brandArray = brand.split(",");
      whereClause.brand = { in: brandArray };
    }
    if (minPrice || maxPrice) {
      whereClause.price = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };
    }
    if (inStock) {
      whereClause.inStock = true;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: products };
  } catch (err) {
    console.error("Ошибка Server Action при фильтрации:", err);
    return { success: false, error: "Не удалось загрузить товары" };
  }
}
