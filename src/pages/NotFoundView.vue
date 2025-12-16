<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="not-found-illustration">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="4" opacity="0.2"/>
            <text x="100" y="120" text-anchor="middle" font-size="80" font-weight="700" fill="currentColor">404</text>
          </svg>
        </div>
        <h1 class="not-found-title">Página No Encontrada</h1>
        <p class="not-found-description">
          La página que buscas no existe o ha sido movida.
        </p>
        <div class="not-found-actions">
          <router-link to="/" class="btn btn-primary btn-lg">Ir al Inicio</router-link>
          <router-link to="/jobs" class="btn btn-outline btn-lg">Explorar Empleos</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) 0;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.not-found-illustration {
  margin-bottom: var(--spacing-2xl);
  color: var(--color-primary-500);
}

.not-found-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.not-found-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
}
</style>
