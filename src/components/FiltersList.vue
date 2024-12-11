<template>
    <div>
      <!-- <h2>Список всех фильтров</h2>
      <ul>
        <li v-for="filter in filters" :key="filter.name">
          <strong>{{ filter.name }}</strong>: {{ filter.values.join(', ') }}
        </li>
      </ul> -->
    </div>
  </template>
  
  <script>
  export default {
    name: "FiltersList",
    props: {
      menu: {
        type: Array,
        required: true,
      },
    },
    computed: {
      filters() {
        // Собираем все фильтры из меню
        let filters = [];
        this.menu.forEach((section) => {
          // Проверяем наличие категорий в разделе
          if (section.categories) {
            section.categories.forEach((category) => {
              // Добавляем фильтры категории
              if (category.filters) {
                filters.push(...category.filters);
              }
              // Проверяем наличие подкатегорий в категории
              if (category.subcategories) {
                category.subcategories.forEach((subcategory) => {
                  // Добавляем фильтры подкатегорий
                  if (subcategory.filters) {
                    filters.push(...subcategory.filters);
                  }
                });
              }
            });
          }
        });
        return filters;
      },
    },
  };
  </script>
  
  <style>
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  </style>
  