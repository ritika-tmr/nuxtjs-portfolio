<template>
  <div class="isolate flex min-h-screen flex-col overflow-x-clip bg-paper text-ink">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-bridal focus:px-4 focus:py-2 focus:text-on-bridal">Skip to content</a>
    <FirstVisitLoader />
    <PageTurn />
    <AppHeader />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <BackToTop />
    <CustomCursor />
  </div>
</template>
