export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 16px/1.5 'Inter', system-ui, -apple-system, sans-serif; background: #f9f7f2; color: #1f1e1b; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; border: 1px solid #1d3527; border-radius: 12px; background: #ffffff; }
      h1 { font-family: 'Fraunces', Georgia, serif; font-size: 1.75rem; margin: 0 0 0.5rem; color: #1d3527; }
      p { color: #553c2b; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 6px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: background 0.15s ease; }
      .primary { background: #ff6b35; color: #fff; }
      .primary:hover { background: #e0531b; }
      .secondary { background: #fff; color: #1d3527; border-color: #1d3527; }
      .secondary:hover { background: #f9f7f2; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
