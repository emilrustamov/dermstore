<template>
    <div>
        <h1>Товары в подкатегории {{ subcategoryName }}</h1>

        <!-- Фильтры подкатегории -->
        <div style="display: flex; gap:30px;">
            <div v-if="subcategoryFilters.length > 0" class="subcategory-filters">
                <div v-for="filter in subcategoryFilters" :key="filter.name" class="filter-group" style="display: flex">
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
            <div v-if="filteredProducts.length > 0" style="display: flex;gap:30px">
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
            <p v-else>В этой подкатегории пока нет товаров.</p>
        </div>


    </div>
</template>


<script>
export default {
    name: "SubcategoriesPage",
    data() {
        return {
            products: [],
            subcategoryName: "",
            brands: [],
            selectedBrand: "",
            filteredProducts: [],
            subcategoryFilters: [],
            selectedFilters: {},
        };
    },
    created() {
        this.loadSubcategoryData(this.$route.params.subcategoryId);
    },
    beforeRouteUpdate(to, from, next) {
        this.loadSubcategoryData(to.params.subcategoryId);
        next();
    },
    methods: {
        loadSubcategoryData(subcategoryId) {
            const menu = JSON.parse(localStorage.getItem("menuData")) || [];

            const subcategory = menu
                .flatMap((section) => section.categories || [])
                .flatMap((category) => category.subcategories || [])
                .find((subcat) => subcat.id === parseInt(subcategoryId));

            if (subcategory) {
                this.subcategoryName = subcategory.name;
                this.products = subcategory.products || [];
                this.filteredProducts = [...this.products];


                this.subcategoryFilters = subcategory.filters || [];


                this.brands = [...new Set(this.products.map((product) => product.brand))];


                this.selectedFilters = this.subcategoryFilters.reduce((acc, filter) => {
                    acc[filter.name] = "";
                    return acc;
                }, {});
            } else {

                this.subcategoryName = "";
                this.products = [];
                this.filteredProducts = [];
                this.subcategoryFilters = [];
                this.brands = [];
                this.selectedFilters = {};
            }
        },
        filterByBrand() {

            let filtered = [...this.products];


            if (this.selectedBrand) {
                filtered = filtered.filter((product) => product.brand === this.selectedBrand);
            }


            const activeFilters = Object.entries(this.selectedFilters).filter(
                ([, value]) => value
            );

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

            const activeFilters = Object.entries(this.selectedFilters).filter(
                ([, value]) => value
            );

            let filtered = [...this.products];

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
        }
    },
};
</script>


<style>
.filter {
    margin-bottom: 20px;
}

.filter label {
    margin-right: 10px;
    font-weight: bold;
}

.filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
}

/* .subcategory-filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
} */

.product-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.product-card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
    margin: 0 0 10px;
}

.product-card p {
    margin:
        0;
}

.category-filters {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.filter-group,
.filter {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    flex: 1;
    align-items: flex-start;
}

.filter-group label,
.filter label {
    margin-bottom: 5px;
    font-weight: bold;
}
</style>