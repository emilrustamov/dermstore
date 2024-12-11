export const menuData = [
    {
      id: 1,
      name: "Skin Care",
      categories: [
        {
          id: 101,
          name: "Cleansers",
          subcategories: [
            { id: 1001, name: "Face Wash" },
            { id: 1002, name: "Makeup Remover" },
          ],
        },
        {
          id: 102,
          name: "Serums & Treatments",
          subcategories: [
            { id: 1003, name: "Anti-aging" },
            { id: 1004, name: "Hydration" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Hair Care",
      categories: [
        {
          id: 201,
          name: "Shampoo",
          subcategories: [
            { id: 2001, name: "For Dry Hair" },
            { id: 2002, name: "For Oily Hair" },
          ],
        },
      ],
    },
    {
      id: 3, // Уникальный ID раздела "Бренды"
      name: "Brands",
      brands: [
        { name: "African Botanics" },
        { name: "Alterna" },
        { name: "BABOR" },
        { name: "BeautyStat Cosmetics" },
        { name: "BIOEFFECT" },
        { name: "Bioderma" },
      ],
    },
  ];
  