<template>
  <div id="app">
    <!-- Меню -->
    <MainMenu :menu="menu" @update-menu="handleMenuUpdate" />
    <DynamicMenu :menu="menu" />

    <!-- Область маршрутов -->
    <router-view />
  </div>
</template>


<script>
import MainMenu from "./components/Menu.vue";
import DynamicMenu from "./components/DynamicMenu.vue";

export default {
  name: "App",
  components: {
    MainMenu,
    DynamicMenu,
  },
  data() {
    return {
      menu: [], // Меню данных
      displayedProducts: [], // Продукты для отображения
    };
  },
  created() {
    const savedMenu = localStorage.getItem("menuData");
    this.menu = savedMenu ? JSON.parse(savedMenu) : [];
  },
  methods: {
    handleMenuUpdate({ type, data }) {
      if (type === "product") {
        let subcategory = null;

        const section = this.menu.find((section) =>
          section.categories.some((category) =>
            category.subcategories.some((subcat) => subcat.id === data.subcategoryId)
          )
        );

        if (section) {
          const category = section.categories.find((cat) =>
            cat.subcategories.some((subcat) => subcat.id === data.subcategoryId)
          );
          subcategory = category.subcategories.find((subcat) => subcat.id === data.subcategoryId);

          if (subcategory) {
            if (!subcategory.products) subcategory.products = [];
            subcategory.products.push({
              name: data.name,
              description: data.description,
              brand: data.brand,
              filters: data.filters, // Сохраняем фильтры товара
            });

            // Реактивно обновляем подкатегорию
            this.menu = [...this.menu];
          }
        }

        const brandsSection = this.menu.find((section) => section.name === "Brands");
        if (brandsSection) {
          const brand = brandsSection.brands.find((b) => b.name === data.brand);
          if (brand) {
            if (!brand.products) brand.products = [];
            brand.products.push({
              name: data.name,
              description: data.description,
              subcategory: subcategory ? subcategory.name : null, // Привязываем подкатегорию
              filters: data.filters, // Сохраняем фильтры для бренда
            });
          }
        }
      } else if (type === "section") {
        this.menu.push(data);
      } else if (type === "category") {
        const section = this.menu.find((section) => section.id === data.sectionId);
        if (section) section.categories.push(data.category);
      } else if (type === "subcategory") {
        const section = this.menu.find((section) => section.id === data.sectionId);
        const category = section.categories.find((cat) => cat.id === data.categoryId);
        if (category) {
          category.subcategories.push({
            id: Date.now(),
            name: data.subcategory,
            products: [], // Добавляем массив продуктов для подкатегории
          });
        }
      } else if (type === "brand") {
        let brandsSection = this.menu.find((section) => section.name === "Brands");
        if (!brandsSection) {
          brandsSection = { id: Date.now(), name: "Brands", brands: [] };
          this.menu.push(brandsSection);
        }
        brandsSection.brands.push(data);
      }

      this.saveMenuToLocalStorage();
      this.menu = JSON.parse(localStorage.getItem("menuData"));
    },

    saveMenuToLocalStorage() {
      localStorage.setItem("menuData", JSON.stringify(this.menu));
    },

    updateDisplayedProducts(filterType, filterValue) {


      if (filterType === "subcategory") {
        const section = this.menu.find((section) =>
          section.categories.some((category) =>
            category.subcategories.some((subcat) => subcat.id === filterValue)
          )
        );



        if (section) {
          const category = section.categories.find((cat) =>
            cat.subcategories.some((subcat) => subcat.id === filterValue)
          );



          const subcategory = category.subcategories.find((subcat) => subcat.id === filterValue);



          this.displayedProducts = subcategory ? subcategory.products : [];


        }
      }
    }
  },
};
</script>


