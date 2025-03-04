import { join } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import unocss from "unocss/vite"
import unimport from "unimport/unplugin"
import dotenv from "dotenv"
import nitro from "./nitro.config"
import { projectDir } from "./shared/dir"
import pwa from "./pwa.config"

// 加载环境变量（需确保顺序正确）
dotenv.config({
  path: join(projectDir, ".env.server"),
})

// 合并所有配置到 defineConfig 中
export default defineConfig({
  // 构建输出目录配置
  build: {
    outDir: 'dist/output/public'
  },
  // 路径别名
  resolve: {
    alias: {
      "~": join(projectDir, "src"),
      "@shared": join(projectDir, "shared"),
    },
  },
  // 插件列表
  plugins: [
    TanStackRouterVite({
      // 如果启用 autoCodeSplitting 导致问题，可暂时关闭
      // autoCodeSplitting: true,
    }),
    unimport.vite({
      dirs: ["src/hooks", "shared", "src/utils", "src/atoms"],
      presets: ["react", {
        from: "jotai",
        imports: ["atom", "useAtom", "useAtomValue", "useSetAtom"],
      }],
      imports: [
        { from: "clsx", name: "default", as: "$" },
        { from: "jotai/utils", name: "atomWithStorage" },
      ],
      dts: "imports.app.d.ts",
    }),
    unocss(),
    react(),
    pwa(),   // 确保 pwa.config.ts 导出的是合法插件
    nitro(), // 确保 nitro.config.ts 导出的是合法插件
  ],
})
