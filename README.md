## 📝 主要功能实现

### 播放器功能

- 使用 HTML5 的 Audio 实现音频播放
- 使用 Redux 管理播放状态
- 使用 better-scroll 实现歌词滚动
- 使用 createKeyframeAnimation 实现播放器动画
- 支持多种播放模式切换
- 支持倍速播放功能

### 数据管理

- 使用 Redux 管理全局状态
- 使用 Immutable.js 确保数据不可变性
- 使用 Redux-thunk 处理异步操作

### 性能优化

- 路由懒加载
- 图片懒加载
- 函数组件 + Hooks
- React.memo 优化渲染
- 防抖和节流处理

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📚 打开方式:

1. 将项目 clone 下来

   ```shell
   $ git clone https://github.com/RicardoPang/pf-react-cloud-music.git
   $ cd cloud-music
   $ npm install

   // 下载子模块
   $ git clone https://github.com/RicardoPang/NeteaseCloudMusicApi.git
   $ cd NeteaseCloudMusicApi
   $ npm install
   ```

   接下来，要记得把`src/api/config.js`中把`baseUrl`改成接口的地址。（一定要记得,不然报 404!）

2. 运行

   ```shell
   $ npm run start
   ```

   现在就在本地的 3000 端口访问了。如果要打包到线上，执行`npm run build`即可。

## 📄 许可证

本项目基于 MIT 许可证开源，详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [网易云音乐 API](https://github.com/RicardoPang/NeteaseCloudMusicApi)
- [Create React App](https://github.com/facebook/create-react-app)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
