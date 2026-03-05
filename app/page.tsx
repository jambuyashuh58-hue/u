// app/page.tsx
export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>UltraMind Companion</h1>
      <p>Your deployment is working. This is the root route: <code>/</code></p>
      <ul>
        <li><a href="/api/health">API Health Check</a></li>
      </ul>
    </main>
  );
}
