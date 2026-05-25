/**
 * Vercel 一键部署脚本
 * 使用 Vercel Deployment API 直接上传文件部署
 * 用法: node scripts/vercel-deploy.mjs <VERCEL_TOKEN>
 */

const token = process.argv[2];
if (!token) {
  console.error("请提供 Vercel Token");
  console.error("用法: node scripts/vercel-deploy.mjs <TOKEN>");
  process.exit(1);
}

const API = "https://api.vercel.com";
const PROJECT_NAME = "raphael-ai-bot";
const TEAM_ID = "team_Nd6XSXZFwnCC9H72GyZ8tJdE";

// ---------- 读取文件 ----------
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// .gitignore 中的忽略规则快速实现
const IGNORE_LIST = [
  "node_modules", ".next", "out", "build", "coverage", ".vercel",
  "data", "ngrok.exe", "ngrok.yml", "ngrok.log", "*.zip",
  "dev-out.txt", "dev-err.txt", "wh-out.txt", "wh-err.txt",
  "lt.log", "start-all.log", "test-server.js", "cloudflared.exe",
  "dev-proc.xml", ".env", ".env.*", "*.tsbuildinfo", "next-env.d.ts",
  ".git", ".gitignore",
];

function shouldIgnore(name) {
  return IGNORE_LIST.some(pattern => {
    if (pattern.startsWith("*.")) return name.endsWith(pattern.slice(1));
    if (pattern.endsWith("/*")) return name === pattern.slice(0, -2);
    return name === pattern || name.startsWith(pattern + ".");
  });
}

function collectFiles(dir, baseDir = dir) {
  const entries = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (shouldIgnore(item.name)) continue;
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
    if (item.isDirectory()) {
      entries.push(...collectFiles(fullPath, baseDir));
    } else {
      const content = fs.readFileSync(fullPath, "utf-8");
      entries.push({ file: relativePath, data: content, encoding: "utf-8" });
    }
  }
  return entries;
}

// ---------- 环境变量 ----------
function getEnvVars() {
  const envPath = path.join(ROOT, ".env.local");
  const vars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      vars[key] = val;
    }
  }
  return vars;
}

// ---------- 主函数 ----------
async function main() {
  console.log("📦 收集项目文件...");
  const files = collectFiles(ROOT);
  console.log(`   共 ${files.length} 个文件`);

  const envVars = getEnvVars();
  console.log(`   环境变量: ${Object.keys(envVars).length} 个`);

  console.log("\n🚀 正在部署到 Vercel...");
  
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 1. 创建或查找项目
  console.log("\n📁 检查项目...");
  let projectResp = await fetch(`${API}/v2/projects/${PROJECT_NAME}?teamId=${TEAM_ID}`, { headers });
  
  if (projectResp.status === 404) {
    console.log("   项目不存在，创建中...");
    projectResp = await fetch(`${API}/v2/projects?teamId=${TEAM_ID}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: PROJECT_NAME,
        framework: "nextjs",
        buildCommand: "next build",
        outputDirectory: ".next",
        installCommand: "npm install",
      }),
    });
    const projectData = await projectResp.json();
    if (!projectResp.ok) {
      console.error("   创建项目失败:", projectData.error?.message || JSON.stringify(projectData));
      process.exit(1);
    }
    console.log(`   项目已创建: ${projectData.id || projectData.name}`);
  } else {
    const projectData = await projectResp.json();
    console.log(`   项目已存在: ${projectData.id || projectData.name}`);
  }

  // 2. 创建部署
  console.log("\n📤 上传文件并创建部署...");
  
  const deployResp = await fetch(`${API}/v13/deployments?teamId=${TEAM_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: PROJECT_NAME,
      version: 2,
      files,
      projectSettings: {
        framework: "nextjs",
        buildCommand: "next build",
        outputDirectory: ".next",
        installCommand: "npm install",
      },
      // 环境变量需要在项目级别设置
    }),
  });

  const deployData = await deployResp.json();

  if (!deployResp.ok) {
    console.error("❌ 部署失败:", deployData.error?.message || JSON.stringify(deployData));
    process.exit(1);
  }

  const deployUrl = deployData.url || deployData.alias?.[0];
  console.log(`\n✅ 部署成功!`);
  console.log(`   部署 URL: https://${deployUrl}`);
  console.log(`   Webhook:  https://${deployUrl}/api/feishu/webhook`);

  // 3. 设置环境变量
  console.log("\n🔧 设置环境变量...");
  const envEntries = Object.entries(envVars);
  let envSuccess = 0;
  
  for (const [key, value] of envEntries) {
    const envResp = await fetch(
      `${API}/v10/projects/${PROJECT_NAME}/env?teamId=${TEAM_ID}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          key,
          value,
          type: "encrypted",
          target: ["production", "preview", "development"],
        }),
      }
    );
    if (envResp.ok) {
      envSuccess++;
    } else {
      const envData = await envResp.json();
      console.log(`   ${key}: ${envData.error?.message || "已存在或跳过"}`);
    }
  }
  console.log(`   环境变量已配置: ${envSuccess}/${envEntries.length}`);

  // 4. 触发重新部署（让环境变量生效）
  if (envSuccess > 0) {
    console.log("\n🔄 触发重新部署以应用环境变量...");
    const redeployResp = await fetch(
      `${API}/v13/deployments?teamId=${TEAM_ID}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: PROJECT_NAME,
          version: 2,
          files, // 重新上传文件
          projectSettings: {
            framework: "nextjs",
            buildCommand: "next build",
            outputDirectory: ".next",
            installCommand: "npm install",
          },
        }),
      }
    );
    const redeployData = await redeployResp.json();
    if (redeployResp.ok) {
      console.log(`✅ 重新部署成功！`);
      console.log(`\n🎉🎉🎉 最终部署 URL:`);
      console.log(`   https://${redeployData.url}`);
      console.log(`\n📋 请在飞书开放平台配置事件订阅 URL:`);
      console.log(`   https://${redeployData.url}/api/feishu/webhook`);
    }
  }

  console.log("\n✨ 部署完成!");
}

main().catch((e) => {
  console.error("❌ 错误:", e.message);
  process.exit(1);
});
