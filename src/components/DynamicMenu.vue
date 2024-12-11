<template>
    <div class="dynamic-menu">
        <nav class="menu-bar">
            <ul style="display: flex;">
                <!-- Отображение разделов -->
                <li v-for="section in menu" :key="section.id" @mouseover="showDropdown(section)"
                    @mouseleave="hideDropdown">
                    <!-- Название раздела -->
                    <span>{{ section.name }}</span>

                    <!-- Выпадающее меню -->
                    <div v-if="activeSection === section.id" class="dropdown">
                        <!-- Логика для Brands -->
                        <div v-if="section.name === 'Brands'" class="brands-dropdown">
                            <!-- Алфавит -->
                            <div class="alphabet">
                                <span v-for="letter in alphabet" :key="letter"
                                    @mouseover="filterBrands(letter, section.brands)"
                                    :class="{ active: letter === activeLetter }">
                                    {{ letter }}
                                </span>
                            </div>
                            <!-- Список брендов -->
                            <div class="brand-list">
                                <div v-for="brand in filteredBrands" :key="brand.name" class="brand-item">
                                    <router-link :to="{ name: 'BrandsPage', params: { brandName: brand.name } }">
                                        {{ brand.name }}
                                    </router-link>
                                </div>
                            </div>
                        </div>

                        <!-- Логика для категорий -->
                        <div v-else>
                            <div v-for="category in section.categories" :key="category.id" class="category-item">
                                <!-- Ссылка на страницу категории -->
                                <router-link :to="{ name: 'CategoriesPage', params: { categoryId: category.id } }"
                                    class="category-link">
                                    <h4>{{ category.name }}</h4>
                                    <ul v-if="category.subcategories && category.subcategories.length > 0"
                                        class="subcategory-list">
                                        <li v-for="subcategory in category.subcategories" :key="subcategory.id"
                                            class="subcategory-item">
                                            <router-link v-if="subcategory.id"
                                                :to="{ name: 'SubcategoriesPage', params: { subcategoryId: subcategory.id } }">
                                                {{ subcategory.name }}
                                            </router-link>
                                            <span v-else>Подкатегория без ID</span>
                                        </li>
                                    </ul>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>


<script>
export default {
    name: "DynamicMenu",
    props: {
        menu: Array,
    },
    data() {
        return {
            alphabet: ["09", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))],
            activeSection: null,
            activeLetter: "09",
            filteredBrands: [],
        };
    },
    methods: {
        showDropdown(section) {
            this.activeSection = section.id;
        },
        hideDropdown() {
            this.activeSection = null;
        },
        filterBrands(letter, brands) {
            this.activeLetter = letter;

            if (!brands) {

                this.filteredBrands = [];
                return;
            }


            if (letter === "09") {
                this.filteredBrands = brands.filter((brand) => /^[09]/.test(brand.name));
            } else {
                this.filteredBrands = brands.filter((brand) => brand.name.toLowerCase().startsWith(letter.toLowerCase()));
            }



        },

    },
};
</script>


<style>
/* Стили для выпадающего списка брендов */
.brands-dropdown {
    display: flex;
    flex-direction: column;
    /* Размещаем алфавит и список брендов вертикально */
    gap: 15px;
    padding: 15px;
}

.alphabet {
  display: inline !important;
    flex-wrap: wrap;
    /* Если алфавит не помещается, переносим буквы */
    padding: auto;
    font-size: 14px;
}

.alphabet span {
    cursor: pointer;
    padding: 5px 18px;
    border: 1px solid transparent;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.alphabet span.active {
    font-weight: bold;
    border-color: #000;
    color: #000;
}

.alphabet span:hover {
    background-color: #f8f8f8;
    border-radius: 4px;
}

/* Стили для списка брендов */
.brand-list {
    display: flex;
    flex-direction: column;
    /* Выстраиваем бренды в колонку */
    gap: 10px;
    max-height: 300px;
    /* Ограничиваем высоту списка */
    overflow-y: auto;
    /* Скролл, если список слишком длинный */
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

.brand-item a {
    text-decoration: none;
    color: #333;
    font-size: 14px;
    transition: color 0.3s ease;
}

.brand-item a:hover {
    color: #000;
    font-weight: bold;
}


.dynamic-menu {
    background-color: #000;
    color: #fff;
    padding: 10px;
}

.menu-bar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-bar li {
    position: relative;
    cursor: pointer;
    margin-right: 20px;
}

.menu-bar span {
    font-size: 16px;
    font-weight: bold;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    color: #000;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: block;
    padding: 15px;
    z-index: 1000;
    min-width: 200px;
}

.dropdown div {
    margin-bottom: 15px;
    display: flex;
    gap: 20px;
}

.dropdown div h4 {
    margin: 0;
    font-size: 22px;
    font-weight: bold;
    color: #333;
}

.dropdown ul {
    list-style: none;
    padding: 0;
}

.dropdown ul li {
    margin: 5px 0;
}

.dropdown ul li a {
    text-decoration: none;
    color: #555;
    font-size: 14px;
}

.dropdown ul li a:hover {
    color: #000;
    font-weight: bold;
}


.category-item {
    margin-bottom: 15px;
}


.category-link {
    text-decoration: none;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}


.subcategory-list {
    list-style: none;
    padding-left: 15px;
    margin: 0;
    display: block;
}

.subcategory-item {
    margin-bottom: 5px;
    display: block;
}


.subcategory-link {
    text-decoration: none;
    color: #555;
    font-size: 14px;
}

.subcategory-link:hover {
    color: #000;
    font-weight: bold;
}
</style>