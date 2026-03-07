<script setup lang="ts"></script>

<template>
  <main class="status-page">
    <section class="status-card">
      <h1>Page in development</h1>
      <p>
        The feature you tried to access is currently being built. Please check back soon while we
        finish polishing it for you.
      </p>
    </section>
  </main>
</template>

<style scoped>
.status-page {
  max-width: var(--app-max-width);
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  padding: var(--spacing-page);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-card {
  width: 100%;
  max-width: 600px;
  padding: var(--spacing-card);
  border-radius: 1rem;
  background: var(--color-white);
  border: 1px solid var(--color-surface-border);
  box-shadow: var(--shadow-card-strong);
  text-align: left;
}

.status-card h1 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-main);
  line-height: 1.3;
}

.status-card p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

@media (min-width: 640px) {
  .status-card {
    border-radius: 1.25rem;
  }

  .status-card h1 {
    font-size: 1.6rem;
  }

  .status-card p {
    font-size: 0.95rem;
  }
}

@media (min-width: 1024px) {
  .status-card {
    max-width: var(--app-max-container-width);
  }

  .status-card h1 {
    font-size: 1.9rem;
  }
}
</style>

