// Prefix a file in public/ with the site's base path, so it works locally AND on GitHub Pages.
// Usage: asset('models/crow.glb'). Never start the path with '/'.
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '');
}
