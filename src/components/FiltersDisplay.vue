<template>
    <div v-if="filters && filters.length > 0" class="filters-display">
      <h3>Фильтры1</h3>
      <ul>
        <li v-for="filter in filters" :key="filter.name">
          <strong>{{ filter.name }}:</strong> {{ filter.values.join(', ') }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "FiltersDisplay",
    props: {
      filters: {
        type: Array,
        default: () => [],
      },
    },
  };
  </script>
  
  <style>
  .filters-display {
    margin: 20px 0;
    padding: 10px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .filters-display ul {
    list-style: none;
    padding: 0;
  }
  
  .filters-display li {
    margin-bottom: 10px;
  }
  </style>
  