<template>
  <div class="page-placeholder">
    <div class="container">
      <div class="placeholder-content">
        <h1>Detalles del Empleo</h1>
        <p>Esta página mostrará información detallada sobre una oferta de trabajo específica.</p>
        <router-link to="/jobs" class="btn btn-primary">Volver a Empleos</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-placeholder {
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) 0;
}

.placeholder-content {
  text-align: center;
}
</style>
