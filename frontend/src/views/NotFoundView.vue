<script setup lang="ts"></script>

<template>
  <main class="status-page">
    <div class="standard-container">
      <section class="status-card not-found">
        <h1>Page not found</h1>
        <p>
          The page you were looking for doesn&apos;t exist or may have been moved. Please check the
          address or return to the onboarding page.
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.status-page {
  min-height: calc(100vh - 80px);
  padding: var(--spacing-page);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
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
    padding: 2.5rem;
  }

  .status-card h1 {
    font-size: 1.9rem;
  }
}
</style>

