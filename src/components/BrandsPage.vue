<template>
  <div>
    <h1>Товары бренда {{ brandName }}</h1>

    <!-- Список товаров -->
    <div class="product-grid">
      <div style="display: flex;" v-if="products.length > 0">
        <div v-for="product in products" :key="product.name" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p><strong>Категория:</strong> {{ product.category }}</p>
        </div>
      </div>
      <p v-else>Для данного бренда пока нет товаров.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BrandsPage",
  data() {
    return {
      products: [],
      brandName: "",
    };
  },
  created() {
    const brandName = this.$route.params.brandName;
    const menu = JSON.parse(localStorage.getItem("menuData")) || [];

    const brandsSection = menu.find((section) => section.name === "Brands");
    const brand = brandsSection?.brands.find((b) => b.name === brandName);

    if (brand) {
      this.brandName = brandName;
      this.products = brand.products || [];
   
    }
  },
};
</script>