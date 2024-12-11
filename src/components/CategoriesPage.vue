<template>
    <div>
        <h1>Товары в категории {{ categoryName }}</h1>
        <FiltersDisplay v-if="category && category.filters" :filters="category.filters" />

        <!-- Фильтры категории -->
        <div style="display: flex; gap:30px;">
            <div v-if="categoryFilters.length > 0" >
                <div v-for="filter in categoryFilters" :key="filter.name" class="filter-group" style="display: flex">
                    <label :for="'filter-' + filter.name">{{ filter.name }}:</label>
                    <select :id="'filter-' + filter.name" v-model="selectedFilters[filter.name]"
                        @change="filterByFilters">
                        <option value="">Все</option>
                        <option v-for="value in filter.values" :key="value" :value="value">{{ value }}</option>
                    </select>
                </div>
            </div>

            <!-- Фильтр по бренду -->
            <div class="filter">
                <label for="brandFilter">Фильтр по бренду:</label>
                <select id="brandFilter" v-model="selectedBrand" @change="filterByBrand">
                    <option value="">Все бренды</option>
                    <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
                </select>
            </div>
        </div>
        <!-- Сетка товаров -->
        <div class="product-grid">
            <div style="display: flex; gap:30px;" v-if="filteredProducts.length > 0">
                <div v-for="product in filteredProducts" :key="product.name" class="product-card">
                    <h3>{{ product.name }}</h3>
                    <p>{{ product.description }}</p>
                    <p><strong>Бренд:</strong> {{ product.brand }}</p>
                    <div v-if="product.filters && Object.keys(product.filters).length > 0">
                        <h4 style="margin: 0;">Фильтры:</h4>
                        <ul style="margin: 0;">
                            <li v-for="(value, name) in product.filters" :key="name">
                                <strong>{{ name }}:</strong> {{ value }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <p v-else>В этой категории пока нет товаров.</p>
        </div>

    </div>

</template>

<script>
import FiltersDisplay from "./FiltersDisplay.vue";
export default {
    name: "CategoriesPage",
    components: {
        FiltersDisplay,
    },
    data() {
        return {
            products: [],
            filteredProducts: [],
            categoryName: "",
            brands: [],
            selectedBrand: "",
            categoryFilters: [],
            selectedFilters: {},
        };
    },
    created() {
        this.loadCategoryData(this.$route.params.categoryId);
    },
    beforeRouteUpdate(to, from, next) {
        this.loadCategoryData(to.params.categoryId);
        next();
    },
    methods: {
        loadCategoryData(categoryId) {
            const menu = JSON.parse(localStorage.getItem("menuData")) || [];

            if (!menu || menu.length === 0) {
                console.error("Меню отсутствует или пустое.");
                return;
            }


            const section = menu.find((section) =>
                section.categories.some((category) => category.id === parseInt(categoryId))
            );

            if (!section) {
                console.error("Раздел не найден для категории ID:", categoryId);
                return;
            }

            const category = section.categories.find((cat) => cat.id === parseInt(categoryId));

            if (!category) {
                console.error("Категория не найдена для ID:", categoryId);
                return;
            }

            this.categoryName = category.name;


            this.products = [
                ...(category.products || []),
                ...(category.subcategories?.flatMap((subcat) => subcat.products || []) || []),
            ];


            this.filteredProducts = [...this.products];


            this.brands = [...new Set(this.products.map((product) => product.brand))];


            this.categoryFilters = Array.from(
                new Map(
                    [
                        ...(category.filters || []),
                        ...(category.subcategories?.flatMap((subcat) => subcat.filters || []) || []),
                    ].map((filter) => [filter.name, filter])
                ).values()
            );



            this.selectedFilters = this.categoryFilters.reduce((acc, filter) => {
                acc[filter.name] = "";
                return acc;
            }, {});
        },

        filterByBrand() {
            let filtered = [...this.products];

            if (this.selectedBrand) {
                filtered = filtered.filter((product) => product.brand === this.selectedBrand);
            }


            const activeFilters = Object.entries(this.selectedFilters).filter(([, value]) => value);

            if (activeFilters.length > 0) {
                filtered = filtered.filter((product) =>
                    activeFilters.every(([filterName, filterValue]) =>
                        product.filters?.[filterName] === filterValue
                    )
                );
            }

            this.filteredProducts = filtered;
        },

        filterByFilters() {
            let filtered = [...this.products];

            const activeFilters = Object.entries(this.selectedFilters).filter(([, value]) => value);

            if (activeFilters.length > 0) {
                filtered = filtered.filter((product) =>
                    activeFilters.every(([filterName, filterValue]) =>
                        product.filters?.[filterName] === filterValue
                    )
                );
            }


            if (this.selectedBrand) {
                filtered = filtered.filter((product) => product.brand === this.selectedBrand);
            }

            this.filteredProducts = filtered;
        },
    },

};
</script>
