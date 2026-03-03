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
  padding: 2.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-card {
  width: 100%;
  max-width: var(--app-max-container-width);
  padding: 2rem 2.25rem;
  border-radius: 1.25rem;
  background: var(--color-white);
  border: 1px solid var(--color-surface-border);
  box-shadow: var(--shadow-card-strong);
  text-align: left;
}

.status-card h1 {
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-main);
}

.status-card p {
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

@media (min-width: 720px) {
  .status-card h1 {
    font-size: 1.9rem;
  }
}
</style>

