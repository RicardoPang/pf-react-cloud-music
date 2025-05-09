// 云音乐项目Cloudflare部署脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// 打印带颜色的消息
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查是否安装了Cloudflare CLI
function checkCloudflareCliInstalled() {
  try {
    execSync('which wrangler', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// 安装Cloudflare CLI
function installCloudflareCli() {
  log('正在安装Cloudflare Wrangler CLI...', 'yellow');
  try {
    execSync('npm install -g wrangler', { stdio: 'inherit' });
    log('Cloudflare Wrangler CLI安装成功!', 'green');
    return true;
  } catch (error) {
    log(`安装Cloudflare Wrangler CLI失败: ${error.message}`, 'red');
    return false;
  }
}

// 创建Cloudflare Pages配置文件
function createCloudflareConfig() {
  const configPath = path.join(process.cwd(), 'wrangler.toml');
  
  // 检查配置文件是否已存在
  if (fs.existsSync(configPath)) {
    log('Cloudflare配置文件已存在，跳过创建步骤。', 'yellow');
    return true;
  }
  
  // 创建基本配置
  const configContent = `
# Cloudflare Pages配置
name = "pf-react-cloud-music"
type = "webpack"
account_id = "ac3283c45717d166d8c828bb3d93077c"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./dist"
entry-point = "workers-site"

[build]
command = "npm run build"
upload.format = "service-worker"

[build.upload]
format = "service-worker"
`;

  try {
    fs.writeFileSync(configPath, configContent);
    log('Cloudflare配置文件创建成功!', 'green');
    return true;
  } catch (error) {
    log(`创建Cloudflare配置文件失败: ${error.message}`, 'red');
    return false;
  }
}

// 创建Cloudflare Pages适配的_redirects文件
function createRedirectsFile() {
  const redirectsPath = path.join(process.cwd(), 'public', '_redirects');
  
  // 确保public目录存在
  if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
  }
  
  // 创建_redirects文件内容
  const redirectsContent = `
# 处理SPA路由
/* /index.html 200

# API代理
/api/* https://zhulang-music.vercel.app/api/:splat 200
`;

  try {
    fs.writeFileSync(redirectsPath, redirectsContent);
    log('_redirects文件创建成功!', 'green');
    return true;
  } catch (error) {
    log(`创建_redirects文件失败: ${error.message}`, 'red');
    return false;
  }
}

// 修改package.json添加部署脚本
function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // 添加部署脚本
    if (!packageJson.scripts.deploy) {
      packageJson.scripts.deploy = 'wrangler pages publish dist';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      log('package.json更新成功，添加了deploy脚本!', 'green');
    } else {
      log('deploy脚本已存在，跳过更新步骤。', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`更新package.json失败: ${error.message}`, 'red');
    return false;
  }
}

// 构建项目
function buildProject() {
  log('正在构建项目...', 'yellow');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('项目构建成功!', 'green');
    return true;
  } catch (error) {
    log(`项目构建失败: ${error.message}`, 'red');
    return false;
  }
}

// 部署到Cloudflare Pages
function deployToCloudflare() {
  log('正在部署到Cloudflare Pages...', 'yellow');
  try {
    execSync('npx wrangler pages publish dist', { stdio: 'inherit' });
    log('部署成功! 🎉', 'bright');
    log('你的应用现在可以在Cloudflare Pages上访问了!', 'green');
    return true;
  } catch (error) {
    log(`部署失败: ${error.message}`, 'red');
    log('请确保你已经登录到Cloudflare账户。可以运行 "npx wrangler login" 进行登录。', 'yellow');
    return false;
  }
}

// 主函数
async function main() {
  log('===== 云音乐项目Cloudflare部署工具 =====', 'bright');
  
  // 步骤1: 检查Cloudflare CLI
  if (!checkCloudflareCliInstalled()) {
    log('未检测到Cloudflare Wrangler CLI', 'yellow');
    if (!installCloudflareCli()) {
      return;
    }
  } else {
    log('Cloudflare Wrangler CLI已安装 ✓', 'green');
  }
  
  // 步骤2: 创建配置文件
  if (!createCloudflareConfig()) {
    return;
  }
  
  // 步骤3: 创建_redirects文件
  if (!createRedirectsFile()) {
    return;
  }
  
  // 步骤4: 更新package.json
  if (!updatePackageJson()) {
    return;
  }
  
  // 步骤5: 构建项目
  if (!buildProject()) {
    return;
  }
  
  // 步骤6: 部署到Cloudflare
  if (!deployToCloudflare()) {
    return;
  }
  
  log('\n部署流程完成!', 'bright');
  log('如果你遇到任何问题，请查看Cloudflare Pages文档: https://developers.cloudflare.com/pages/', 'cyan');
}

// 执行主函数
main().catch(error => {
  log(`发生错误: ${error.message}`, 'red');
  process.exit(1);
});
