<template>
    <div class="menu">
        <!-- Верхняя панель управления -->
        <nav class="admin-panel">
            <ul>
                <li @click="openForm('section')">Создать раздел</li>
                <li @click="openForm('category')">Создать категорию</li>
                <li @click="openForm('subcategory')">Создать подкатегорию</li>
                <li @click="openForm('product')">Создать товар</li>
                <li @click="openForm('brand')">Создать бренд</li>
                <li class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
                    <span>Фильтры</span>
                    <ul v-if="showDropdown" class="filter-dropdown-menu">
                        <li @click="openForm('filter')">Создать фильтр</li>
                        <!-- <li @click="toggleFiltersList">Список всех фильтров</li> -->
                    </ul>
                </li>

                <li @click="exportToExcel">Выгрузить в Excel</li>
            </ul>
        </nav>
        <FiltersList v-if="showFiltersList" :menu="menu" />
        <!-- Формы управления -->
        <div v-if="formType === 'section'" class="form-container">
            <h2>Создать раздел</h2>
            <form @submit.prevent="addSection" class="form-inline">
                <input v-model="newName" placeholder="Название раздела" required />
                <div class="buttons">
                    <button type="submit" class="btn save-btn">Сохранить</button>
                    <button type="button" @click="closeForm" class="btn cancel-btn">Отмена</button>
                </div>
            </form>
        </div>

        <div v-if="formType === 'filter'" class="form-container">
            <h2>Создать фильтр</h2>
            <form @submit.prevent="addFilter">
                <label>Выберите раздел:</label>
                <select v-model="selectedSectionId" @change="updateCategories">
                    <option disabled value="">Выберите раздел</option>
                    <option v-for="section in menu" :key="section.id" :value="section.id">
                        {{ section.name }}
                    </option>
                </select>
                <!-- Выбор категорий -->
                <div v-if="categories.length > 0">
                    <label>Выберите категории:</label>
                    <div v-for="category in categories" :key="category.id" class="checkbox-group">
                        <input type="checkbox" :id="'category-' + category.id" :value="category.id"
                            v-model="selectedCategoryIds" />
                        <label :for="'category-' + category.id">{{ category.name }}</label>
                        <div v-if="category.subcategories && category.subcategories.length > 0"
                            class="subcategory-checkboxes">
                            <div v-for="subcategory in category.subcategories" :key="subcategory.id"
                                class="checkbox-group">
                                <input type="checkbox" :id="'subcategory-' + subcategory.id" :value="subcategory.id"
                                    v-model="selectedSubcategoryIds" />
                                <label :for="'subcategory-' + subcategory.id">{{ subcategory.name }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Название фильтра -->
                <label>Название фильтра:</label>
                <input v-model="filterName" placeholder="Введите название фильтра" required />

                <!-- Значения фильтра -->
                <label>Значения фильтра (через запятую):</label>
                <input v-model="filterValues" placeholder="Введите значения фильтра" required />

                <!-- Кнопки -->
                <div class="buttons">
                    <button type="submit" class="btn save-btn">Сохранить</button>
                    <button type="button" @click="closeForm" class="btn cancel-btn">Отмена</button>
                </div>
            </form>
        </div>


        <div v-if="formType === 'category'" class="form-container">
            <h2>Создать категорию</h2>
            <form @submit.prevent="addCategory">
                <select v-model="selectedSectionId" required>
                    <option disabled value="">Выберите раздел</option>
                    <option v-for="section in menu" :key="section.id" :value="section.id">
                        {{ section.name }}
                    </option>
                </select>
                <input v-model="newName" placeholder="Название категории" required />
                <div class="buttons">
                    <button type="submit" class="btn save-btn">Сохранить</button>
                    <button type="button" @click="closeForm" class="btn cancel-btn">Отмена</button>
                </div>
            </form>
        </div>

        <div v-if="formType === 'subcategory'" class="form-container">
            <h2>Создать подкатегорию</h2>
            <form @submit.prevent="addSubcategory">
                <select v-model="selectedSectionId" @change="updateCategories" required>
                    <option disabled value="">Выберите раздел</option>
                    <option v-for="section in menu" :key="section.id" :value="section.id">
                        {{ section.name }}
                    </option>
                </select>
                <select v-model="selectedCategoryId" required>
                    <option disabled value="">Выберите категорию</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
                <input v-model="newName" placeholder="Название подкатегории" required />
                <div class="buttons">
                    <button type="submit" class="btn save-btn">Сохранить</button>
                    <button type="button" @click="closeForm" class="btn cancel-btn">Отмена</button>
                </div>
            </form>
        </div>
        <div v-if="formType === 'brand'" class="form-container">
            <h2>Добавить бренд</h2>
            <form @submit.prevent="addBrand">
                <input v-model="newName" placeholder="Название бренда" required />
                <div class="buttons">
                    <button type="submit" class="btn save-btn">Сохранить</button>
                    <button type="button" @click="closeForm" class="btn cancel-btn">Отмена</button>
                </div>
            </form>
        </div>

        <div v-if="formType === 'product'" class="form-container">
            <h2>Добавить товар</h2>
            <form @submit.prevent="addProduct">
                <!-- Выбор категории -->
                <select v-model="selectedSectionId" @change="updateCategories" required>
                    <option disabled value="">Выберите раздел</option>
                    <option v-for="section in menu" :key="section.id" :value="section.id">
                        {{ section.name }}
                    </option>
                </select>

                <select v-model="selectedCategoryId" @change="updateSubcategoriesAndFilters" required>
                    <option disabled value="">Выберите категорию</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>

                <!-- Выбор подкатегории -->
                <select v-model="selectedSubcategoryId" @change="updateFilters" required>
                    <option disabled value="">Выберите подкатегорию</option>
                    <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                        {{ subcategory.name }}
                    </option>
                </select>

                <!-- Фильтры -->
                <div v-if="filters.length > 0">
                    <h3>Фильтры</h3>
                    <div v-for="filter in filters" :key="filter.name">
                        <label :for="'filter-' + filter.name">{{ filter.name }}:</label>
                        <select v-model="productFilters[filter.name]" :id="'filter-' + filter.name" required>
                            <option disabled value="">Выберите значение</option>
                            <option v-for="value in filter.values" :key="value" :value="value">
                                {{ value }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Название товара -->
                <input v-model="newName" placeholder="Название товара" required />

                <!-- Описание товара -->
                <textarea v-model="newDescription" placeholder="Описание товара" required></textarea>

                <!-- Выбор бренда -->
                <label>Выберите бренд:</label>
                <select v-model="selectedBrand" required>

                    <option disabled value="">Выберите бренд</option>
                    <option v-for="brand in brands" :key="brand.name" :value="brand.name">
                        {{ brand.name }}
                    </option>
                </select>

                <div class="buttons">
                    <button type="submit" class="btn save-btn">Сохранить</button>
                    <button type="button" @click="closeForm" class="btn cancel-btn">Отмена</button>
                </div>
            </form>
        </div>

        <!-- <div>
            <pre>Сохранённое меню: {{ menu }}</pre>
            <pre>Отображаемые товары: {{ displayedProducts }}</pre>
        </div> -->

    </div>
</template>

<script>
import * as XLSX from "xlsx";
import FiltersList from "./FiltersList.vue";
export default {
    name: "MainMenu",
    components: {
        FiltersList,
    },
    props: {
        menu: Array, 
    },
    data() {
        return {
            formType: "", 
            newName: "",
            selectedSectionId: "",
            selectedCategoryId: "",
            selectedSubcategoryId: "",
            categories: [],
            subcategories: [],
            filterName: "",
            filterValues: "",
            filters: [],
            productFilters: {},
            showDropdown: false,
            showFiltersList: false,
            selectedCategoryIds: [], 
            selectedSubcategoryIds: [], 

        };
    },
    computed: {
        getSubcategoriesForSelectedCategories() {
            if (!this.categories || this.categories.length === 0) return [];
            const subcategories = [];
            this.categories.forEach((category) => {
                if (this.selectedCategoryIds.includes(category.id) && category.subcategories) {
                    subcategories.push(...category.subcategories);
                }
            });
            return subcategories;
        },
    },

    methods: {
        openForm(type) {
            this.formType = type;
            this.newName = "";
            this.selectedSectionId = "";
            this.selectedCategoryId = "";
            this.selectedSubcategoryId = "";
            this.filterName = "";
            this.filterValues = "";
            this.categories = [];
            this.subcategories = [];
            this.showFiltersList = false;

            if (type === "filter" || type === "product") {
                this.updateCategories();
            }

            if (type === "product") {
                const brandsSection = this.menu.find((section) => section.name === "Brands");
                this.brands = brandsSection ? brandsSection.brands : [];
            }
        },
        toggleFiltersList() {
            this.showFiltersList = !this.showFiltersList;
        },

        exportToExcel() {
            const dataForExport = [];

            if (!this.menu || !Array.isArray(this.menu)) {

                return;
            }

          
            this.menu.forEach((section) => {
                if (section.categories && Array.isArray(section.categories)) {
                    section.categories.forEach((category) => {
                        if (category.subcategories && Array.isArray(category.subcategories)) {
                            category.subcategories.forEach((subcategory) => {
                                if (subcategory.products && Array.isArray(subcategory.products)) {
                           
                                    subcategory.products.forEach((product) => {
                                
                                        dataForExport.push({
                                            Раздел: section.name || "Не указано",
                                            Категория: category.name || "Не указано",
                                            Подкатегория: subcategory.name || "Не указано",
                                            Товар: product.name || "Не указано",
                                            Бренд: product.brand || "Не указано",
                                            Описание: product.description || "Не указано",
                                            Фильтры: this.formatFilters(product.filters), 
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });

            if (dataForExport.length === 0) {

                return;
            }

         
            const worksheet = XLSX.utils.json_to_sheet(dataForExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Товары");
            XLSX.writeFile(workbook, "products-data.xlsx");
        },

      
        formatFilters(filters) {
            if (!filters || Object.keys(filters).length === 0) {
                return "Нет фильтров";
            }
            return Object.entries(filters)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
        },


        closeForm() {
            this.formType = "";
        },
        addSection() {
            if (!this.newName.trim()) return;
            this.$emit("update-menu", {
                type: "section",
                data: {
                    id: Date.now(),
                    name: this.newName.trim(),
                    categories: [],
                },
            });
            this.closeForm();
        },
        addCategory() {
            if (!this.newName.trim() || !this.selectedSectionId) return;

            const section = this.menu.find((section) => section.id === parseInt(this.selectedSectionId));
            if (section && section.categories.some((cat) => cat.name === this.newName.trim())) {
                alert("Категория с таким названием уже существует!");
                return;
            }

            this.$emit("update-menu", {
                type: "category",
                data: {
                    sectionId: parseInt(this.selectedSectionId),
                    category: {
                        id: Date.now(),
                        name: this.newName.trim(),
                        subcategories: [],
                    },
                },
            });

            this.closeForm();
        },

        addBrand() {
            if (!this.newName.trim()) return;

            this.$emit("update-menu", {
                type: "brand",
                data: {
                    name: this.newName.trim(),
                },
            });
            this.newName = "";
            this.closeForm();
        },
        addSubcategory() {
            if (!this.newName.trim() || !this.selectedCategoryId) return;
            this.$emit("update-menu", {
                type: "subcategory",
                data: {
                    sectionId: parseInt(this.selectedSectionId),
                    categoryId: parseInt(this.selectedCategoryId),
                    subcategory: this.newName.trim(),
                },
            });
            this.closeForm();
        },
        updateSubcategories() {
            const category = this.categories.find((cat) => cat.id === parseInt(this.selectedCategoryId));
            if (category && category.subcategories) {
                this.subcategories = category.subcategories; 

            } else {
                this.subcategories = [];

            }
        },
        saveMenuToLocalStorage() {
            localStorage.setItem("menuData", JSON.stringify(this.menu));

        },

        addFilter() {
            if (!this.filterName.trim() || !this.filterValues.trim()) return;

            const valuesArray = this.filterValues.split(",").map((value) => value.trim());
            const newFilter = {
                name: this.filterName.trim(),
                values: valuesArray,
            };

        
            this.selectedCategoryIds.forEach((categoryId) => {
                const category = this.categories.find((cat) => cat.id === categoryId);
                if (!category.filters) {
                    category.filters = [];
                }
                category.filters.push(newFilter);
            });

         
            this.selectedSubcategoryIds.forEach((subcategoryId) => {
                const category = this.categories.find((cat) => cat.subcategories.some((subcat) => subcat.id === subcategoryId));
                const subcategory = category?.subcategories.find((subcat) => subcat.id === subcategoryId);

                if (subcategory) {
                    if (!subcategory.filters) {
                        subcategory.filters = [];
                    }
                    subcategory.filters.push(newFilter);
                }
            });



 
            this.saveMenuToLocalStorage();
            this.closeForm();
        },

        updateCategories() {
            const section = this.menu.find((section) => section.id === parseInt(this.selectedSectionId));
            this.categories = section?.categories || [];

        },

        updateSubcategoriesAndFilters() {
   
            this.updateSubcategories();

   
            const category = this.categories.find((cat) => cat.id === parseInt(this.selectedCategoryId));
            this.filters = category?.filters || [];
            this.initializeFilterValues();
        },
        updateFilters() {
         
            const category = this.categories.find((cat) => cat.id === parseInt(this.selectedCategoryId));
            const subcategory = category?.subcategories.find(
                (subcat) => subcat.id === parseInt(this.selectedSubcategoryId)
            );
            this.filters = subcategory?.filters || category?.filters || [];
            this.initializeFilterValues();
        },
        initializeFilterValues() {
        
            this.productFilters = {};
            this.filters.forEach((filter) => {
                this.productFilters[filter.name] = "";
            });
        },

        addProduct() {
            if (!this.newName.trim() || !this.selectedSubcategoryId || !this.selectedBrand) {

                return;
            }

   
            const missingFilters = this.filters.filter((filter) => !this.productFilters[filter.name]);
            if (missingFilters.length > 0) {
                alert(`Не заполнены значения для фильтров: ${missingFilters.map((f) => f.name).join(", ")}`);
                return;
            }

            const newProduct = {
                name: this.newName.trim(),
                description: this.newDescription.trim(),
                subcategoryId: parseInt(this.selectedSubcategoryId),
                brand: this.selectedBrand,
                filters: this.productFilters, 
            };



            this.$emit("update-menu", {
                type: "product",
                data: newProduct,
            });

            this.newName = "";
            this.newDescription = "";
            this.closeForm();
        },
    },
};
</script>


<style>
.form-container {
    margin: 20px auto;
    padding: 20px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 400px;
    max-width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-container form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
select,
textarea {
    /* width: 100%; */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}


button {
    padding: 10px;
    cursor: pointer;
}


.buttons {
    display: flex;
    gap: 5px;
}

.btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.save-btn {
    background-color: #28a745;
    color: white;
}

.cancel-btn {
    background-color: #dc3545;
    color: white;
}

.admin-panel ul {
    display: flex;
    list-style: none;
    padding: 10px 20px;
    background-color: #333;
    color: #fff;
    margin: 0;
    gap: 20px;
    font-family: Arial, sans-serif;
    font-size: 16px;
    border-bottom: 3px solid #444;
}

.admin-panel li {
    position: relative;
    cursor: pointer;
    padding: 10px 15px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.admin-panel li:hover {
    background-color: #444;
}

.filter-dropdown {
    position: relative;
    cursor: pointer;
    padding: 10px;
    margin-right: 20px;
    font-size: 16px;
    color: #fff;
    transition: background-color 0.3s ease;
}

.filter-dropdown-title {
    font-weight: bold;
}

.filter-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: block;
    list-style: none;
    padding: 10px 0;
    margin: 5px 0 0;
    border-radius: 5px;
    min-width: 200px;
}

.filter-dropdown-item {
    padding: 10px 20px;
    color: #333;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.filter-dropdown-item:hover {
    background-color: #f0f0f0;
    color: #000;
    font-weight: bold;
}



.dropdown-menu li {
    padding: 10px 20px;
    color: white;
    white-space: nowrap;
    transition: background-color 0.3s ease;
}


.dropdown:hover .dropdown-menu {
    display: block;
}


.admin-panel li span {
    font-weight: bold;
}

.checkbox-group {
    margin-bottom: 10px;
}

.checkbox-group input {
    margin-right: 5px;
}
</style>