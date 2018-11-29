# MP-PUSH

开发此项目的目的是实现一个自己的[Server酱](http://sc.ftqq.com/)，方便自定义。

零痛苦部署，极度简单的API，代码开源，自由扩展。

## 一、特性

一个频道可以被多个微信订阅，一个微信也可以订阅多个频道。当有消息到达频道时，会向所有订阅的微信推送通知。

## 二、配置

### 1、准备工具

- 微信服务号
  - 点击[链接](https://mp.weixin.qq.com/)注册服务号
  - 或点击[链接](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)注册测试号（在服务号管理后台的**开发者工具**中也可以找打）
- LeanCloud
  1. 点击[链接](https://leancloud.cn/dashboard/login.html#/signin)注册LeanCloud账号
  2. 新建一个应用，在控制台创建 `Channel` 和 `UserToChannel` 两个 Class

### 2、新建消息模版【微信】

参考[模板消息运营规范](http://t.cn/EPO1HE9)配置一个消息模板，需要带一个 `text` 字段：

![](https://i.loli.net/2018/11/29/5bff98bf557fd.png)

### 3、自定义环境变量【Leancloud】

在**云引擎**的**设置**里面添加**自定义环境变量**：

- `WX_APP_ID`：测试号 appID
- `WX_APP_SC`：测试号 appsecret
- `WX_TOKEN`：需和接口配置信息的 Token 一致
- `WX_TEMPLATE_ID`：新建的模板 ID
- `WX_TEMPLATE_DEST`：模板的详情要打开的 URL，目前可以瞎填

### 4、设置web主机域名【Leancloud】

在云引擎的设置里面设置**Web 主机域名**：

![](https://i.loli.net/2018/10/16/5bc5ae204fd6b.png)

### 5、确认接口配置信息

在[测试号管理](https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)页面确认接口配置信息。

- URL：为 `https://二级域名.leanapp.cn/wx`
- Token：需和 `WX_TOKEN` 一致

## 三、部署Leancloud

### 1、本地部署

首先确认本机已经安装 [LeanCloud 命令行工具](https://leancloud.cn/docs/leanengine_cli.html)，然后执行下列指令：

```sh
$ git clone https://github.com/youngjuning/mp-push-leancloud.git
$ cd mp-push-leancloud
```

登录并关联应用：

```sh
$ lean login
$ lean switch
```

部署到 LeanEngine：

```sh
$ lean deploy
```

### 2、GitHub部署【推荐】

> 推荐的原因是速度优于本地部署

- 打开 [mp-push-leancloud](https://github.com/youngjuning/mp-push-leancloud) 并 **Fork** 到自己的github账号下
- 在云引擎的设置里面填写源码部署的代码库地址，保存即可
- 在云引擎的部署中选择部署目标 -> 填写分支或版本号 -> 勾选下载最新依赖后点击部署即可

## 四、测试接口

关注测试号，发送 `link 频道名称` 绑定频道。

发送 POST 请求触发推送：

```sh
curl -X POST 'https://二级域名.leanapp.cn/push' \
-H 'content-type: application/json' \
-d '{ "channelName": "频道名称", "text": "OK" }'
```
