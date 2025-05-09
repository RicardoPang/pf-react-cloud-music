# 云音乐项目部署指南

这个文档将指导你如何将云音乐项目部署到Cloudflare Pages上。

## 什么是Cloudflare Pages？

Cloudflare Pages是一个静态网站托管服务，它提供了：
- 全球CDN加速
- 自动HTTPS
- 持续部署
- 自定义域名
- 零配置部署

简单来说，它就像一个"网站的家"，可以让你的网站在互联网上被所有人访问到，而且速度非常快。

## 部署前的准备工作

1. 确保你有一个Cloudflare账户
   - 你已经有了账户：Ricardo.pangj@gmail.com
   - 账户ID: ac3283c45717d166d8c828bb3d93077c

2. 确保你的项目可以在本地正常运行
   - 运行 `npm start` 确认项目可以正常启动
   - 确认主要功能都能正常使用

## 部署步骤

### 方法一：使用自动部署脚本（推荐）

我们已经为你准备了一个自动部署脚本，只需几个简单的步骤即可完成部署：

1. 打开终端，进入项目根目录
   ```bash
   cd /Users/pangjianfeng/code/pf-react-cloud-music
   ```

2. 运行部署脚本
   ```bash
   node cloudflare-deploy.js
   ```

3. 按照脚本提示进行操作
   - 如果需要登录Cloudflare账户，脚本会提示你
   - 脚本会自动构建项目并部署到Cloudflare Pages

### 方法二：手动部署

如果你想了解更多部署细节，或者自动脚本遇到问题，可以按照以下步骤手动部署：

1. 安装Cloudflare Wrangler CLI工具
   ```bash
   npm install -g wrangler
   ```

2. 登录到你的Cloudflare账户
   ```bash
   wrangler login
   ```

3. 构建项目
   ```bash
   npm run build
   ```

4. 部署到Cloudflare Pages
   ```bash
   wrangler pages publish dist
   ```

5. 按照终端提示完成部署

## 部署后的配置

部署成功后，你可以在Cloudflare仪表板中进行以下配置：

1. 设置自定义域名（可选）
   - 登录Cloudflare仪表板
   - 进入Pages项目
   - 点击"自定义域"
   - 添加你的域名并按照指引完成设置

2. 配置环境变量（如果需要）
   - 在Pages项目中点击"设置"
   - 找到"环境变量"部分
   - 添加必要的环境变量

## 常见问题解答

### 部署后网站无法访问API

如果部署后发现API请求失败，可能是因为跨域问题。确保你的API配置正确：

1. 检查 `src/api/config.js` 中的 `baseUrl` 设置
2. 确认API服务器允许来自Cloudflare域名的请求

### 部署后路由不正常

单页应用(SPA)在Cloudflare Pages上需要特殊配置才能正常处理路由。我们已经在部署脚本中创建了必要的 `_redirects` 文件来解决这个问题。

### 如何更新已部署的网站？

当你修改代码后，只需再次运行部署脚本即可：
```bash
node cloudflare-deploy.js
```

## 技术支持

如果你在部署过程中遇到任何问题，可以参考以下资源：

- [Cloudflare Pages官方文档](https://developers.cloudflare.com/pages/)
- [Cloudflare社区论坛](https://community.cloudflare.com/)

## 部署成功后

部署成功后，你将获得一个Cloudflare Pages提供的URL（通常是 `项目名.pages.dev`）。你可以通过这个URL访问你的云音乐应用。

祝你部署顺利！🎉
