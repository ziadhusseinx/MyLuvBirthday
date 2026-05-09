import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";
import fs from "fs";

// Custom plugin to serve /hero directory as static assets
function serveHeroAssets() {
  return {
    name: "serve-hero-assets",
    configureServer(server: any) {
      server.middlewares.use("/hero", (req: any, res: any, next: any) => {
        const filePath = path.join(process.cwd(), "hero", req.url || "");
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Accept-Ranges", "bytes");
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

// Custom plugin to serve /src images at /srcc/ URL
function serveSrcImages() {
  const mimeTypes: Record<string, string> = {
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  return {
    name: "serve-src-images",
    configureServer(server: any) {
      server.middlewares.use("/srcc", (req: any, res: any, next: any) => {
        const filePath = path.join(process.cwd(), "src", req.url || "");
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || "application/octet-stream";
            res.setHeader("Content-Type", contentType);
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Cache-Control", "public, max-age=31536000");
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

// Custom plugin to serve generated images from brain directory
function serveBrainImages() {
  const mimeTypes: Record<string, string> = {
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  const brainPath = "C:\\Users\\pc\\.gemini\\antigravity\\brain\\0f27608d-2afe-47fb-b342-ab1162e84647";

  return {
    name: "serve-brain-images",
    configureServer(server: any) {
      server.middlewares.use("/brain", (req: any, res: any, next: any) => {
        const filePath = path.join(brainPath, req.url || "");
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || "application/octet-stream";
            res.setHeader("Content-Type", contentType);
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Cache-Control", "public, max-age=31536000");
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), serveHeroAssets(), serveSrcImages(), serveBrainImages(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
