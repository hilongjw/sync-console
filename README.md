# SyncConsole SDK

前端远程实时调试 SDK

## 安装

```html
<script src="https://sync-console-fe.luojilab.com/client/sync-console.js"></script>
```

```bash

npm i sync-console --save-dev

```

```javascript
import Vue from 'vue'
import SyncConsoleManager from 'sync-console'

var syncConsoleManager = new SyncConsoleManager({
    project: 'some_project_name',
    Vue: Vue
})
```

## 使用

### 客户端

- 开启控制台 `https://yourdomain.com/?_sync_console_show=true`
- 开启远程控制模式 `https://yourdomain.com/?_sync_console_remote=true`


### 控制端

1. 登陆 [https://fd.igetget.com](https://fd.igetget.com/)
2. 点击 `SyncConsole` 项目
3. 跳转授权验证网址 `https://sync-console-fe.luojilab.com/api/token/gen?token=<your fd token>&link=true`
4. 授权通过跳转至 `https://sync-console-fe.luojilab.com/?_sync_console_show=true&_sync_console_token=436ec9e3-d120-48a3-a6aa-df1d440e3b30`

5. 设置控制项目 `https://yourdomain.com/?_sync_console_project=some_project_name`

6. 点击 `Remote` 选择远程控制的客户端
7. `Console` `Network` `System` 将和被选中客户端同步，你也可以在 `Console` 视图实时执行任意合法的 Javascript 代码。


## Build Setup

``` bash
# install dependencies
npm i

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Directory

- build     webpack config
- client    front end project
- server    back end project (router/view) 
- app.js    app entry

