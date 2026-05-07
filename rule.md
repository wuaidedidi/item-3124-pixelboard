# 模型生成规则 (Rule.md)

本文件定义了在生成代码、构建项目和编写文档时必须遵守的严格规则。所有生成内容必须符合以下标准。

---

## 1. 跨平台项目判断规则

- 如果是跨平台项目，需要自行判断后续所有规则的适用部分
- 核心依据：根据用户需求来判断
- **跨平台项目前端**：**不使用 Docker**
- **跨平台项目后端**：
  - 有独立后端 → 使用 Docker
  - 没有独立后端 → 前后端都完全不用 Docker

## 2. 脚手架与版本规范

- 确认好脚手架
- 确认好版本
- **最好使用 CLI 版本构建项目**，以免版本依赖互相冲突

---

## 3. 项目交付细则

### 3.1 项目运行与验证

- 项目需要能够实际运行和验证
- 需要提供明确的启动或运行方式说明
- 需要能够在不修改核心代码的前提下完成启动或运行
- 需要实际运行结果与最后交付的说明基本一致

### 3.2 项目主题要求

- 项目不能偏离 Prompt 主题
- 交付内容需要围绕 Prompt 所描述的业务目标或使用场景展开
- 实现内容要与 Prompt 主题强相关
- 不能擅自替换、弱化或忽略 Prompt 中的核心问题定义

### 3.3 功能完整性

- 需要保证 Prompt 功能实现的完整性
- 一定要完整覆盖 Prompt 中明确提出的核心需求
- 要实现 Prompt 中明确列出的所有核心功能点

### 3.4 项目形态要求

- 项目需要具备从 0 到 1 的基本交付形态，而非仅提供局部功能、示意性实现或片段式代码
- 不能以 mock/hardcode 形式替代真实逻辑但未作说明的情况
- 需要提供完整的项目结构，而非零散代码或单文件示例
- 需要提供基本的项目说明（如 README 或等效文档）

### 3.5 工程结构与模块划分

- 项目在当前问题规模下需要采用合理的工程结构与模块划分
- 项目结构要清晰，模块职责需要相对明确
- 项目不能存在在单一文件下进行代码堆叠的情况
- 项目需要体现出基本的可维护性与可扩展性意识，而非临时性或堆叠式实现
- 不能存在明显职责混乱或高度耦合的情况
- 核心逻辑需要具备基本的扩展空间，而非完全写死

### 3.6 专业工程实践水准

- 项目在工程细节与整体形态上需要体现出专业工程实践水准
- 包括但不限于：错误处理、日志、校验、接口设计
- 项目需要具备真实产品或服务应有的功能组织形态，而非停留在示例或演示级实现
- 错误处理需要具备基本的可理解性与友好性
- 日志需要用于辅助问题定位，而非随意打印或完全缺失
- 需要在关键输入或边界条件处提供必要校验
- 交付产物一定要具备真实产品或服务应有的功能组织形态，而非教学示例或演示型 Demo

### 3.7 业务目标准确性

- 项目需要准确理解并响应 Prompt 所描述的业务目标
- 交付产物整体应该呈现为真实应用形态
- 需要准确实现 Prompt 的核心业务目标
- 不能存在明显误解需求语义或偏离问题核心的实现
- 不能擅自更改或忽略 Prompt 中的关键约束条件且未作说明

### 3.8 美观度（仅限全栈题目）

- 项目视觉/交互需要贴合场景，且设计美观
- 页面不同功能区域需要具备明确的视觉区分（如背景色、分隔、留白或层级结构）
- 页面整体布局需要合理，元素对齐、间距与比例是否保持基本一致性
- 界面元素（包括文字、图像、图标等）要能够正常渲染与显示
- 视觉元素与页面主题及文字内容保持一致，图片、插图或装饰元素不能出现实际内容明显不匹配的情况
- 提供基本的交互反馈机制（如悬停、点击、过渡效果等），以支持用户理解当前操作状态
- 字体、字号、颜色及图标样式需要具备基本统一性，不能存在风格混杂或规范不一致的问题

---

## 4. Docker 交付标准

### 4.1 Cross 项目特殊规则

- 如果是 cross 项目，前端不要使用 Docker
- 后端如果需要就采用 Docker
- 如果后端显示 none，不要使用 Docker

### 4.2 端口映射规范

- 前端默认映射到宿主机 **3000**（或其他常用端口）
- 后端映射到 **8000**（或其他常用端口）
- **必须在 README 中写明端口映射**

### 4.3 零依赖原则

- **严禁**要求 QA 在本地安装 Node, Python, Java
- 所有依赖必须打入镜像

### 4.4 数据持久化

- 数据库请使用 Docker Volume 或 SQLite 或题目要求文件
- 确保重启容器数据不丢

---

## 5. 📝 文档规范 (README.md)

`README.md` 是交付的一部分，**必须**包含且仅包含以下真实有效的信息，后续按照项目实际情况编写修改：

```markdown
# 项目名称

## 🛠 技术栈
- Frontend: [技术栈，如 React + Tailwind]
- Backend: [技术栈，如 FastAPI]
- Database: [技术栈，如 PostgreSQL]

## 🚀 启动指南 (How to Run)
1. 确保 Docker Desktop 已启动。
2. 在根目录执行：`docker compose up --build`
3. 等待容器启动完成...

## 🔗 服务地址 (Services)
- Frontend: http://localhost:3000
- Backend Swagger: http://localhost:8000/docs
- Database: localhost:3306 (user: root / pass: root)

## 🧪 测试账号
- Admin: admin / 123456
```

---

## 6. 🐳 Docker 镜像源配置 (Docker Registry Configuration)

### 6.1 推荐配置（基于实际项目验证）

#### Docker 镜像源

**使用官方 Docker Hub 镜像**（已验证稳定可用）

```yaml
# docker-compose.yml 示例
services:
  db:
    image: mysql:8.0                    # MySQL 数据库
  
  backend:
    build: ./backend
    # Dockerfile 中使用：
    # - Node.js: node:20-alpine
    # - Java: maven:3.9-eclipse-temurin-17-alpine (构建)
    #         eclipse-temurin:17-jre-alpine (运行)
    # - Python: python:3.11-slim
  
  frontend:
    build: ./frontend
    # Dockerfile 中使用：
    # - node:20-alpine (构建)
    # - nginx:alpine (运行)
```

#### npm 依赖源

**使用淘宝镜像**（国内访问快）

在 `Dockerfile` 中添加：

```dockerfile
RUN npm config set registry https://registry.npmmirror.com
```

#### Maven 依赖源

**使用阿里云镜像**（解决 Java 构建慢的问题）

需要在 `backend` 目录下创建 `settings.xml` 并通过 `Dockerfile` 挂载：

```xml
<!-- settings.xml 示例 -->
<settings>
    <mirrors>
        <mirror>
            <id>aliyunmaven</id>
            <mirrorOf>*</mirrorOf>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>
</settings>
```

#### 前端构建加速规范 (Fast Build with npm ci)

为了极致的构建速度和依赖一致性，**必须**遵循以下流程：

1. **本地预处理**: 在提交代码前，**必须**在本地运行一次 `npm install`（或 `yarn install`），确保 `package-lock.json`（或 `yarn.lock`）文件存在且是最新的（这个我自己处理就行了，不用你帮我运行）
2. **锁文件提交**: **绝对严禁**在 `.gitignore` 中忽略锁文件。必须将锁文件提交至仓库，这是容器内高效构建的前提。
3. **容器内安装**: 在 `Dockerfile` 中，必须使用 `npm ci` 代替 `npm install`。
   - **优势**: `npm ci` 比 `npm install` 快 2-3 倍，且会根据锁文件进行 100% 确定性的安装，避免"本地能跑，容器报错"的灵异问题。
   - **注意**: `npm ci` 要求工作目录必须存在 `package-lock.json`，否则会报错。

---

### 6.2 常用镜像推荐

| 技术栈      | 推荐镜像                       | 说明                                                         |
| :---------- | :----------------------------- | :----------------------------------------------------------- |
| MySQL       | `mysql:8.0`                    | 数据库                                                       |
| Node.js     | `node:20-slim`                 | 前端/后端构建                                                |
| Nginx       | `nginx:alpine`                 | 前端生产环境                                                 |
| Java (构建) | `maven:3.9-eclipse-temurin-17` | Spring Boot 构建                                             |
| Java (运行) | `eclipse-temurin:17-jre`       | 核心修改。切换到基于 Ubuntu 的镜像，彻底解决 QA 担心的兼容性风险。 |
| Python      | `python:3.11-slim`             | Python 应用                                                  |
| PostgreSQL  | `postgres:15-alpine`           | PostgreSQL 数据库                                            |
| Redis       | `redis:7-alpine`               | Redis 缓存                                                   |

### 6.3 配置示例

#### Node.js 项目 Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Spring Boot 项目 Dockerfile (加速版)

```dockerfile
# 构建阶段
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
# 拷贝加速配置
COPY settings.xml /usr/share/maven/ref/settings.xml
COPY pom.xml .
# 预下载依赖 (使用 -s 指定配置)
RUN mvn -s /usr/share/maven/ref/settings.xml dependency:go-offline
COPY src ./src
# 打包
RUN mvn -s /usr/share/maven/ref/settings.xml package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 6.4 使用建议

1. ✅ **优先使用官方镜像**：稳定可靠，无需配置镜像代理
2. ✅ **使用 Alpine 版本**：镜像体积小，构建速度快
3. ✅ **配置 npm 淘宝源**：加速国内依赖下载
4. ✅ **多阶段构建**：减小最终镜像体积

### 6.5 常见问题

**Q: Docker 镜像拉取失败？**  
A: 检查网络连接，确保 Docker Desktop 正常运行

**Q: npm install 很慢？**  
A: 确保已配置淘宝镜像源：`npm config set registry https://registry.npmmirror.com`

**Q: 是否需要配置 Docker Hub 镜像加速器？**  
A: 通常不需要，官方镜像可以直接拉取。如遇到问题再考虑配置

**Q: Docker 端口冲突问题？**  
A: 根据项目文件夹的名称进行设置比如 207 文件夹，前端端口设置为 3207，后端端口设置为 8207

> **"使用 Docker Compose 健康检查最佳实践，确保服务按依赖顺序启动，前端等待后端健康后才提供服务"**

---

## 7. 统一的目录标准

```
Project_Root/
├── README.md
├── docker-compose.yml
├── frontend/
├── backend/
└── ...
```

---

## 8. 启动方式

项目必须支持通过以下命令完成启动：

```bash
docker compose up
```

- 不允许额外参数
- 不允许手动修改配置或环境变量
- 不依赖本地语言运行环境

---

## 9. 容器化要求

- 所有运行依赖必须通过 Docker / docker-compose 显式声明
- 不得依赖本地服务、私有资源或公司内网
- 若包含数据库或中间件，必须一并容器化

### 9.1 对于全栈 (Full Stack) 题目

- 必须使用 `docker-compose` 编排
- **Frontend**：必须映射端口（如 3000），且配置好 Nginx 或开发服务器
- **Backend**：必须在容器内完成依赖安装（`pip install` / `mvn package` 等）
- **Database**：如果使用了 MySQL/Redis，必须在 compose 文件中定义对应的 Service，**严禁使用连接本地 localhost 数据库的配置**

**针对全栈 (Full Stack) 题目，强烈建议：必须把前端、后端、数据库全部放在 Docker 里 (All-in-one)。**

如果只放后端和数据库，**不能算作真正的**"一键运行"和"环境解耦"。

- **全放进去**：QA 输入 `docker-compose up` -> 浏览器打开 `localhost:3000` -> 验收通过。
- **只放后端**：QA 输入 `docker-compose up` 启动后端 -> 再打开一个终端 -> `cd frontend` -> `npm install` -> `npm start` -> 等待编译 -> 打开浏览器。这极其繁琐，不符合"高效验收"的标准。

> **标准的 docker-compose.yml 结构**：`docker-compose.yml` 应该至少包含 3 个服务。

---

## 10. 参考 docker-compose.yml 结构

```yaml
version: '3.8'

services:
  # 1. 数据库服务 (Database)
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"

  # 2. 后端服务 (Backend)
  backend:
    build: ./backend  # 后端代码目录
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DB_HOST: db     # 关键：连接数据库必须用服务名，不能用 localhost

  # 3. 前端服务 (Frontend) - 必须要有这个！
  frontend:
    build: ./frontend # 前端代码目录
    ports:
      - "3000:3000"   # 映射端口供 QA 访问
    depends_on:
      - backend
    # 可以在这里定义开发命令，或者在 Dockerfile 里写好
    command: npm start
```

---

## 11. 参考 README 必须要有的部分（如果有缺少，进行补全）

```markdown
#### 🛠 技术栈

- Frontend: React + Tailwind
- Backend: Python FastAPI
- DB: PostgreSQL

#### 🚀 快速启动 (Docker)

1. 确保 Docker Desktop 已运行。
2. 在根目录执行(不要写具体路径，仅写根目录执行就可)：`docker compose up --build`
3. 访问前端：http://localhost:3000
4. 访问后端文档：http://localhost:8000/docs

#### 🧪 测试账号 (如有)

- 用户名：admin
- 密码：password123
```

---

## 12. 日志规范 (Logging)

- **禁止 Print**: 生产环境后端代码严禁使用 `print()` 或 `console.log()`。
- **标准输出**: 使用标准日志库（如 Python `logging`, Node `winston`），并将日志输出到 `stdout/stderr`。
- **可观测性**: 确保通过 `docker compose logs` 能看到清晰的、结构化的运行日志（包含时间戳、级别、模块）。

---

## 13. 错误处理 (Error Handling)

- **优雅降级**: 前端遇到 API 错误时，绝不能白屏崩溃。必须使用 **Error Boundary** 捕获错误。
- **用户反馈**: 网络请求失败时，必须弹出 **Toast** 或 **Notification** 提示用户，而不是静默失败。
- **输入校验**:
  - 前端：使用 Zod/Yup 拦截非法输入。
  - 后端：使用 Pydantic/DTO 进行严格的数据验证，拒绝非法 Payload。

---

## 14. 数据库规范

- **ORM**: 必须使用 ORM（Prisma, SQLAlchemy, TypeORM, GORM）管理数据，**严禁**拼接原始 SQL 字符串。
- **Seeding (数据填充)**: 必须提供初始化脚本（Seed），在容器启动时自动填充演示数据，**拒绝"空库"交付**。QA 打开页面时应有内容可见。

---

## 15. 📱 移动端/小程序特殊规则 (Mobile Specifics)

> **仅限 Mobile App / Cross-Platform 题目**

- **后端**: 必须严格遵守上述 Docker 规范，提供独立 API 服务。
- **前端**:
  - 必须提供清晰的模拟器运行说明。
  - **连通性**: 代码中必须预留 **Base URL** 配置项，并说明如何连接 Docker 后端（例如 Android 模拟器需连接 `10.0.2.2`，真机需连接局域网 IP）。

---

## 16. 后期美观优化要求

1. 界面空白不能过多，美观度要求达到现代官网级别的视觉和交互效果
2. 应该实现一个完整的页面，而不是简单的功能展示
3. 页面一定要美观，没有布局和样式问题
4. **一定不要过度使用紫色背景和紫色！！！**
5. **你的思考过程必须用中文！！**
6. **todolist 也必须中文**

对于美观度方面要求：

> 请生成一个布局美观、视觉层次清晰、交互自然流畅的网页页面。

- 做好响应式适配
- 页面需符合现代设计风格，整体风格简洁、协调、有未来感
- 使用合适的留白与配色方案（推荐浅色或渐变背景）
- 元素对齐统一，排版结构清晰
- 使用圆角、阴影等细节提升层次感
- 按钮、输入框等交互元素需有 hover 与点击反馈
- 页面结构应语义化、可响应式布局（支持 PC 与移动端）
- 保持加载速度与交互流畅度

---

## 17. 必须要注意的规则

### 17.1 Uniapp 跨平台兼容性

如果是 uniapp 项目，请一定要注意语法和功能实现方法一定要兼容 h5 端，微信小程序端，app 端，如果不清楚会有什么问题，可参考官方文档，git 代码，网络询问，要综合考虑

### 17.2 输入框验证

所有的输入框都要有适当的验证，除非本身可填可不填的输入框，或者业务不需要验证的输入框，验证的方法参考最佳实践，不过一切以用户体验为前提

### 17.3 后台项目用户功能

如果是后台项目必须要有用户注册和登陆功能

### 17.4 图标显示

如果有 icon 一定要确保显示

### 17.5 提示信息规范

给出的提示要精准，出现问题不要出现多重提示，给出一个精准友好的提示就行了，网络异常这种提示就不要有了

### 17.6 用户管理中的角色切换

用户管理中，如果有选择角色的功能，则应该是单选，然后管理员禁止切换自己的角色，因为在业务中这样很容易产生 bug，管理员也不能把自己的状态改为禁止，这样也会产生业务上的 bug

### 17.7 登录页面要求

如果有用户注册和登陆的情况，必须给出现代化网页的登陆页面，并确保测试账号能登陆，并且数据一定初始化过，输入框样式需要是现代化的，美观的

### 17.8 数据一致性

如果用户在个人中心修改数据，那么数据要保持一致性，比如修改了昵称，那么右上角的昵称也要同步修改

### 17.9 邮箱和手机号验证

任何有修改或者新增邮箱和手机号的情况，如注册，或者 modal，或者填写表，或者个人中心中修改的等都需要处理以下三种情况：

- 如果无数值，为空的时候可以提交
- 如果填写了，那么需要验证，格式不对就给出错误提示
- 如果有数值格式正确，那么也可以提交

### 17.10 自动填充样式优化

如果出现自动填充问题的样式丑陋问题，按照最佳实践进行优化

### 17.11 数据持久化与一致性

保证数据的持久化，以及数据一致性，更改的数据在其他显示的地方应该一致性的更改

### 17.12 外键约束删除处理

删除操作触发数据库外键约束错误时，系统返回"系统内部错误"，用户无法了解具体原因，这种情况参考下列方式解决：

> 在删除前检查客户是否有关联数据，如有则返回友好错误信息（如"该客户有关联数据，无法删除"），提升用户体验。

---

## 18. 错误处理规范

前后端错误处理需遵循以下原则：

1. **单一错误提示**：同一个错误只显示一个提示信息，不能重复弹窗

2. **消息去重**：
   - 使用 Set 记录最近 2 秒内显示的消息
   - 使用 Element Plus 的 `grouping: true` 自动合并相同消息

3. **业务错误标记**：成功响应中的业务错误需标记 `_isBusinessError = true`，防止错误拦截器重复显示

4. **优先级**：后端业务消息 > HTTP 状态码消息 > 网络错误消息

5. **后端响应格式**：统一返回 `{code: number, message: string, data: any}`

6. **前端拦截器**：
   - 如果 `response.data.message` 存在，显示它
   - 如果后端没返回 message，根据 HTTP 状态码显示默认消息
   - 只有在网络真正断开时才显示"网络错误"
   - 业务错误（HTTP 200 但 code !== 200）必须标记后再 reject，防止错误拦截器再次显示

7. **组件层规范**：
   - 成功时显示成功消息（如"删除成功"）
   - 失败时不处理错误（拦截器已统一处理）
   - catch 块保持空或只做 loading 状态重置

### 错误处理示例

- 用户名重复 → 只显示"用户名已存在"
- 关联数据删除 → 只显示"该房型下有 X 间客房，无法删除"
- Token 过期 → 只显示"登录已过期，请重新登录"，自动跳转登录页
- 服务器宕机 → 只显示"服务器错误，请稍后重试"
- 断网 → 只显示"网络错误，请检查网络连接"
- 快速重复点击 → 只显示一次错误（2 秒去重 + grouping）

### 关键代码模式

```javascript
// 前端拦截器 - 成功响应处理
if (res.code !== 200) {
  showError(res.message)
  const error = new Error(res.message)
  error._isBusinessError = true  // 必须标记！
  return Promise.reject(error)
}

// 前端拦截器 - 错误响应处理
if (error._isBusinessError) {
  return Promise.reject(error)  // 已显示过，跳过
}
showError(message)

// showError 函数
const showError = (message) => {
  if (recentMessages.has(message)) return
  recentMessages.add(message)
  setTimeout(() => recentMessages.delete(message), 2000)
  ElMessage.error({ message, grouping: true })
}
```

---

## 19. 跨平台权限管理

如果是 uniapp 之类的跨平台的技术栈，应该良好的管理好权限：

- 登陆能看见什么，和没登录能看见什么，要规则制定好
- 有些地址给予没登录的想要看的话，直接给予转到登陆页面的友好提示，这样对用户更友好
- 各种权限和页面的判定一定要仔细，不要出现注册页面也要跳转登陆页面之类的笑话

---

## 20. 跨平台兼容性要求

注意跨平台技术栈 uniapp，electron 等项目的兼容性：

- 一定要尽可能保证功能一致，兼容性良好
- 比如 uniapp 在 h5，小程序和 app 端尽可能使用通用的方式做出功能
- 实在不行再去判断平台给出不同策略的解法，完成一致的功能

---

## 21. Uniapp 边界问题

如果是 uniapp，有些端要处理好边界问题和安全距离问题

---

## 22. 按钮交互要求

1️⃣ 页面按钮不能点击无反应

---

## 23. 弹窗规范

2️⃣ 页面中不要出现 alert 弹窗提示，用组件中的或者你帮忙写一个弹窗组件

不允许弹窗为原生弹窗，原生弹窗属于调试级或极简实现，不符合现代后台管理系统的用户体验标准。

**不允许这种出现**：`alert()`，`confirm()`，`prompt("请输入内容")`

需要用 **模态框 (Modal)** 或 **消息通知 (Message/Toast)**, **Notification** 或者其他更合适的组件，或者自己写的组件进行代替保持视觉风格统一

---

## 24. Docker 端口规范

docker 中前端 3000，后端 8000，数据库 mysql 的话 3306，其他的按照最通常的端口来，当然 prompt 中的最优先

---

## 25. Select 组件样式优化

优化 Select 组件的样式。目前下拉箭头（Arrow Icon）太靠右了，请修改：

- 如果是绝对定位，请将 right 值从现在的距离调大（比如 right: 12px）
- 如果是输入框容器，请增加 padding-right（建议 30px 到 40px 之间），防止文字和小图标重叠或靠得太近
- 适当调优整体的边距，让它看起来更精致

---

## 26. 滑动条优化

modal 中或者其他地方的滑动条都按照最佳实践优化

---

## 27. docker-compose.yml name 属性

以后在为我生成 docker-compose.yml 时，请务必在顶层显式指定 name 属性。项目名请参考文件夹含义

---

## 28. Docker 启动规范

构建项目时不需要你帮我 docker compose up，我自己最后一键 docker compose up 启动就好

---

## 29. 超级管理员角色限制

然后超级管理员在前端就应该不能切换自己角色，只能绑定管理员，否则在业务上很容易产生 bug

---

## 30. 角色权限显示

如果用户有不同角色具有不同的权限，根据业务来让每个角色权限显示对应的模块：

- 需要保证模块能显示
- 并且如果在左边的 siderbar 按钮能点击
- 理清楚路由守卫逻辑

---

## 31. 新建用户默认角色

新建的用户默认具有普通用户的角色

---

## 32. 数据库配置一致性

保证数据库配置的一致性，例如：

- docker-compose.yml 里的 MYSQL_DATABASE
- application.yml 里的 jdbc:mysql://.../数据库名 (如果有)
- 初始化 SQL 脚本里的 USE 数据库名

---

## 33. 数据初始化中文不乱码

数据初始化时，保证数据不乱码

**重要要求：确保中文不乱码**，可参考以下方式：

### 33.1 MySQL Docker 配置 (docker-compose.yml)

在 Docker 中，通过 command 参数强制服务器使用 utf8mb4：

```yaml
services:
  library-db:
    image: mysql:8.0
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_DATABASE: library
      MYSQL_ROOT_PASSWORD: root
```

### 33.2 SQL 初始化脚本 (init.sql)

文件开头设置环境，并确保建库建表语句明确指定字符集：

```sql
-- 1. 告诉连接工具使用 utf8mb4
SET NAMES utf8mb4;

-- 2. 建库时指定
CREATE DATABASE IF NOT EXISTS library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE library;

-- 3. 建表时指定（虽然库设置了，但表显式指定更稳妥）
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**注意**：确保你的 SQL 文件在保存时，编码格式本身就是 UTF-8（无 BOM）。

### 33.3 JDBC 连接字符串 (关键点：不要写 utf8mb4)

这是最容易报错的地方。在 Java JDBC 连接字符串中，characterEncoding 必须写 UTF-8，MySQL 驱动会自动将其映射为 utf8mb4。如果写成 utf8mb4，Java 程序会启动失败。

正确的 application.yml 配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://library-db:3306/library?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: root
```

### 33.4 Spring Boot 配置

确保 Spring 在处理 HTTP 请求和返回 JSON 时强制使用 UTF-8：

```yaml
server:
  servlet:
    encoding:
      charset: UTF-8
      force: true  # 强制请求和响应都使用 UTF-8
      enabled: true

spring:
  http:
    encoding:
      charset: UTF-8
      force: true
      enabled: true
```

---

## 34. 个人中心功能要求

如果项目有个人中心功能，请一定要完善，个人中心如果有修改账号密码的功能的话，务必保证能够正确修改账号密码

---

## 35. 测试账号登录保证

需要保证测试账号 admin 一开始就能正确登陆，而不是创建就不管了

可参考下面做法：

### 🔐 关于 BCrypt 密码问题的根本原因和解决方案

当您在 init.sql 中写入静态的 BCrypt 哈希值时，可能会遇到以下问题：

1. **哈希值不匹配**：网上复制的 BCrypt 哈希可能与您使用的 Spring Security 版本或 BCrypt 实现不兼容
2. **编码问题**：SQL 文件中的特殊字符可能被错误转义
3. **版本差异**：不同 BCrypt 库生成的哈希格式可能略有不同

### ✅ 推荐的解决方案

#### 方案一：运行时密码初始化（已为您实现）

创建 DataInitializer.java 组件，在应用启动时自动修复密码：

```java
@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 检查 admin 用户，如果密码不匹配则重新加密
        User admin = userMapper.findByUsername("admin");
        if (admin != null && !passwordEncoder.matches("123456", admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode("123456"));
            userMapper.updateById(admin);
        }
    }
}
```

**优点**：始终保证密码正确，与 Spring Security 版本完全兼容

---

## 36. README 优化提示词

按以下提示词优化 README.md：

> **Role**: 你是一位交付过上百个商业落地项目的**AI 解决方案架构师**。
>
> **Task**: 请深入分析当前项目代码（@Codebase），撰写一份专业的 `README.md` 交付文档。
>
> **Tone**: 专业、简洁、以结果为导向。重点展示项目的业务价值、逻辑架构和数据流，避免堆砌琐碎的配置细节。
>
> **Requirements**:
>
> 1. **Project Executive Summary (项目摘要)**:
>    - 用商业语言（Business Language）描述项目解决了什么痛点，核心价值主张是什么。
>    - 包含一个醒目的标题和一句强有力的 Slogan。
> 2. **System Architecture (系统架构)**:
>    - **必须生成一个 Mermaid 流程图**，清晰展示数据流向（如：User -> Gateway -> Service -> AI Model -> DB）。
>    - 简要说明核心模块（Modules）的职责划分。
> 3. **Database Design (数据设计 - 视情况生成)**:
>    - 如果检测到数据库相关代码（SQL, Entity, Schema），请生成一个 **Mermaid ER 图 (Entity Relationship Diagram)** 来展示核心表关系。
>    - 列出关键的数据库配置参数说明（如 Type, Host, Port），但**严禁**包含具体的账号密码。
> 4. **Installation & Setup (智能部署指南)**:
>    - **策略**：请先分析项目的构建复杂度。
>    - **场景 A (急速启动)**：如果存在 Dockerfile 或自动化脚本，提供 "⚡ Quick Start" 章节，给出核心启动命令。
>    - **场景 B (手动部署)**：如果依赖较多且无自动化脚本，请提供 "🛠 Step-by-Step Guide"，分步骤说明依赖安装、数据库初始化和应用启动。
>    - **配置说明**：仅提示"请复制 `.env.example` 并填入必要 Key"，**不要**列出冗长的环境变量表格。
> 5. **Development Trajectory & Key Features (核心逻辑)**:
>    - 复盘 AI 构建此项目的**关键实现路径 (Critical Path)**。
>    - 格式示例："1. 数据源接入 -> 2. LLM 逻辑编排 -> 3. 前端交互实现"。
>    - 列出 3-5 个**核心功能点**，侧重于业务能力而非代码实现。
> 6. **Project Structure (项目结构)**:
>    - 用树状图列出核心文件夹结构，并一句话注释其作用（帮助接手人快速导航）。
> 7. **Tech Stack (技术栈)**:
>    - 简洁列出 Backend, Frontend, AI/Data, Infra 等关键技术。
> 8. **🔧 Professional Engineering Practices (专业工程实践 )**:
>    - **核心要求**：分析代码中体现出的"生产级"特征，按照以下 5 个维度进行总结。
>    - **1. 日志系统**：
>    - **2. 错误处理**：
>    - **3. 数据校验**：
>    - **4. 接口设计**：
>    - **5. 生产级特性清单**：以表格形式勾选已实现的维度（如响应式、持久化、模块化、版本兼容等）。
>
> **Output**: 直接输出 Markdown 代码。请保持排版整洁，合理使用 emoji (🚀, 🏗️, 💾) 增加可读性，但不要过于花哨，增加可读性，展现"生产级交付"的质感。

---

## 37. 补充开发避坑指南 (Error Rules & Best Practices)

以下规则补充了具体技术栈的常见问题与解决方案，请在开发中严格遵守。

### 37.1 Docker 环境进阶与服务治理

- **数据库连接竞态 (Race Condition)**:
  - 后端 **必须** 实现连接重试机制（带 Backoff 策略），不能仅依赖 `depends_on`。
  - 示例：在应用启动层循环捕获连接异常并 sleep 重试，确保数据库真正的 Ready 状态。
- **Docker Compose 语法**: 
  - 不要包含顶级 `version: 'x.x'` 字段，遵循最新规范。
- **MySQL 健康检查配置**:
  - 在 `docker-compose.yml` 中配置完善的 `healthcheck`（增加重试次数和 `start_period`），确保后端服务只在数据库完全就绪后启动。

### 37.2 数据库与字符集强化

- **环境变量增强**: Dockerfile 中建议设置 `ENV LANG=C.UTF-8` 以确保容器内 Locale 支持中文。
- **PowerShell 安全执行**: 
  - 在 Windows PowerShell 中执行含 `$` 符号的 SQL（如 Update BCrypt Hash）时，必须转义为 `` `$ ``，防止被解析为变量导致数据损坏。

### 37.3 API 设计安全性

- **管理员防自杀 (Self-Lockout)**:
  - 实现 User Update/Delete API 时，**严禁**允许用户禁用或删除**自己**。
  - **严禁**允许删除系统中的**最后一个可用 Admin**。
- **部分更新防覆盖**:
  - 严禁使用全量 Entity 对象接收部分更新请求（如只改昵称却把 role 覆盖为 null）。
  - 必须使用专用 DTO（如 `UpdateProfileRequest`）或独立接口（如 `PUT /profile`, `PUT /password`）。
- **ID 零信任原则**:
  - 修改个人信息接口（`updateProfile`）**必须完全忽略**前端 Request Body 中的 ID 字段。
  - 必须强制从 `SecurityContext` 或 Token 中获取当前登录用户的 ID。

### 37.4 前端与状态管理最佳实践

- **权限数据同步 (Sync)**:
  - 登录或刷新用户信息后，Store 中的 User State 必须采用 **全量替换** 或 **显式字段映射**，严禁简单的 Object Merge，防止旧权限字段（如 `roleCode`）残留。
- **非 Admin 统计图表防护**:
  - 必须在 API 层和 UI 层双重 Guard。
  - 仅前端 `v-if="isAdmin"` 是不够的，后端 API 必须校验权限，防止请求返回 403 导致控制台爆红或前端渲染 crash。

### 37.5 全栈与后端技术栈避坑

#### Spring Boot / Java
- **Security 上下文**:
  - 自定义 Filter 中必须显式调用 `SecurityContextHolder.getContext().setAuthentication(auth)`，否则 `@Authenticated` 接口会报 403。
- **Spring MVC 日期**:
  - 若报错 `LocalDateTime not supported`，必须自定义 ObjectMapper 并注册 `JavaTimeModule`。
- **AOP 日志安全**:
  - 切面记录参数时必须 `try-catch`。
  - **严禁**直接对复杂实体（特别是带懒加载关系的 JPA/MyBatis 实体）调用 `toString()`，防止 `StackOverflow` 或序列化异常。

#### MyBatis-Plus
- **分页类型**: Service 层接口方法的参数和返回值始终声明为 `IPage<T>` 接口，不要写死为 `Page<T>` 实现类。

#### FastAPI (Python)
- **Pydantic v2**: 注意语法迁移，使用 `model_config = ConfigDict(from_attributes=True)` 代替旧版 `orm_mode`。
- **SQLAlchemy 2.0**: 推荐使用新版查询语法 `db.execute(select(User).where(...)).scalar_one_or_none()`。

#### Node.js / Express / NestJS
- **IPv6 解析陷阱**:
  - Alpine 镜像中 `wget` 可能将 `localhost` 解析为 IPv6 `[::1]`。
  - 健康检查 URL 建议显式使用 `http://127.0.0.1:port`。
- **Pinia 状态同步**:
  - 修改用户数据成功后，务必手动调用 Store 的 update 方法同步 UI，不要等待下次刷新。

### 37.6 移动端与纯前端特有规则

#### Android 原生
- **SDK 冲突**: 高德地图 **不要** 同时引入 `3dmap` 和 `location` SDK，前者已包含后者功能。
- **Room 迁移**: 修改实体类必须处理 Database Version 迁移（Migration），否则会导致 App 崩溃。
- **前台服务**: Android 8.0+ 必须显示 Notification，不要试图隐藏。

#### UniApp 跨平台
- **模板表达式**: 微信小程序模版不支持复杂 JS 表达式，复杂逻辑必须封装为 Method。
- **密码框**: 必须使用 `password` 属性（`<input type="text" password />`），不要仅依赖 `type="password"`。
- **导航报错**: 避免在页面栈只有一个页面（即首页）时调用 `navigateBack`。

#### 纯前端项目
- **图片容器**: 使用 `object-fit: cover` 配合 `display: block` 消除底部空隙。
- **持久化**: 推荐使用 Zustand/Pinia 的 persist 插件或 LocalStorage 配合全量同步。
- **React Flow**: 节点 ID 必须保证全局唯一，Handles 类型（Source/Target）必须严格匹配。

---

## 38. Electron 桌面应用开发规则

### 38.1 原生模块编译

- **better-sqlite3 等原生模块**: 必须使用 `electron-rebuild` 针对 Electron 版本重新编译
- 在 `package.json` 中添加 rebuild 脚本：`"rebuild": "electron-rebuild -f -w better-sqlite3"`
- 安装依赖后必须运行 `npm run rebuild`

### 38.2 日期时间处理

- **时区问题**: `new Date().toISOString()` 返回 UTC 时间，在东八区凌晨会导致日期错误
- **本地日期**: 使用手动格式化获取本地日期字符串：
  ```javascript
  const getLocalDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  ```

### 38.3 资产统计快照逻辑

- **总资产计算**: 每种类型「最新一条记录」的金额总和，不是某一天所有记录的总和
- **日变化计算**: 今日快照 - 昨日快照（快照 = 截止该日每种类型最新值的总和）
- **趋势图数据**: 每天使用快照逻辑，未更新的类型应继承之前的值，避免曲线下跌

### 38.4 模态框验证用户体验

- 表单验证失败时，模态框应保持打开状态，不要自动关闭
- 使用 `onConfirm` 回调模式，验证失败返回 `false` 阻止关闭
- 示例：
  ```javascript
  modal.show('标题', content, {
    onConfirm: () => {
      if (!validate()) {
        showToast('验证失败', 'error');
        return false; // 阻止关闭
      }
      // 处理数据...
      return true; // 允许关闭
    }
  });
  ```

### 38.5 IPC 通信安全

- 使用 `contextBridge.exposeInMainWorld` 暴露安全 API
- 禁用 `nodeIntegration`，启用 `contextIsolation`
- 统一响应格式：`{ success: boolean, data: any, message: string }`

### 38.6 SQLite 数据库

- 数据库文件存储在 `app.getPath('userData')` 目录
- 使用 WAL 模式提高性能：`db.pragma('journal_mode = WAL')`
- 表设计时添加 `created_at` 和 `updated_at` 时间戳字段

### 38.7 Windows 控制台编码

- Windows PowerShell 默认使用 GBK 编码，Node.js 输出 UTF-8 中文会乱码
- 解决方案：日志文件正常显示，控制台乱码可忽略或改用英文日志

### 38.8 Electron Forge 打包

- 使用 `npm run make` 生成安装包
- 在 `forge.config.js` 中配置 makers（如 Squirrel、DMG）
- 原生模块必须在打包前正确编译

---

## 39. UniApp 地图选择器开发规则

### 39.1 H5 端 uni.chooseLocation 限制

- `uni.chooseLocation` 在 H5 端功能受限，不支持 POI 搜索
- 解决方案：使用自定义弹窗 + 高德 REST API 实现完整功能
- 平台判断：使用 `#ifdef H5` 条件编译或运行时判断

### 39.2 高德地图 Key 配置

- **Web JS API Key**: 用于 H5 端地图显示（需配置 securityJsCode）
- **Web Service Key**: 用于 POI 搜索和逆地理编码 REST API
- 两种 Key 不能混用，必须在高德控制台分别创建

### 39.3 H5 端跨域问题

- 高德 REST API 调用会遇到 CORS 限制
- 解决方案 1：配置 Vite/Webpack 代理
- 解决方案 2：使用高德 JSONP 回调（推荐）
- 解决方案 3：后端中转（生产环境推荐）

### 39.4 弹窗层级问题 (z-index)

- UniApp 页面动画可能创建新的层叠上下文
- 使用 Vue 3 `<Teleport to="body">` 将弹窗渲染到 body 外部
- 设置足够高的 z-index（如 99999）确保弹窗在最上层
- 搜索结果列表 z-index 必须高于地图组件

### 39.5 多端兼容检测

```javascript
// 平台判断示例
const isH5 = () => {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
}
```

### 39.6 manifest.json 配置

- H5 端：`h5.sdkConfigs.maps.amap` 配置 key 和 securityJsCode
- App 端：`app-plus.distribute.sdkConfigs.maps.amap` 配置 appkey_ios/android
- 微信小程序：`mp-weixin.permission.scope.userLocation` 声明位置权限

### 39.7 地图组件注意事项

- `<map>` 组件是原生组件，层级高于普通 view
- 在 H5 端可用 `<cover-view>` 覆盖地图，但兼容性有限
- 推荐使用自定义弹窗方案，避免层级冲突

---

## 40. 跨平台项目交付规则

### 40.1 项目类型判断

- 前端：UniApp/Flutter/React Native 等跨平台框架
- 后端：如果 Prompt 指定 "后端 none"，不需要创建后端服务
- 数据库：如果 Prompt 指定 "数据库 none"，不需要数据库

### 40.2 纯前端跨平台项目

- 不需要 Docker 配置
- 不需要数据库配置一致性检查
- 使用 npm/yarn 直接运行

### 40.3 README 启动说明

- 提供 HBuilderX 图形化运行方式
- 提供命令行运行方式（npm run dev:h5 等）
- 说明不同平台的运行命令

---

## 41. UniApp 弹窗 (Modal) 最佳实践

### 41.1 弹窗定位问题

在 UniApp H5 端，`position: fixed` 的弹窗是相对于浏览器视口定位的，而不是 UniApp 页面容器。当在 PC 浏览器中模拟移动端时，UniApp 页面容器会居中显示，导致弹窗超出页面边界。

**解决方案：**
```scss
.modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
}

.modal-body {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
```

### 41.2 弹窗与 TabBar 冲突

弹窗打开时可能与底部 TabBar 重叠，影响用户操作。

**解决方案：**
```javascript
// 打开弹窗时隐藏 TabBar
openModal() {
  uni.hideTabBar()
  this.showModal = true
}

// 关闭弹窗时恢复 TabBar
closeModal() {
  uni.showTabBar()
  this.showModal = false
}
```

### 41.3 v-if 条件渲染防止空值错误

在模板中访问可能为 null 的对象属性时，必须使用 `v-if` 保护：

```vue
<!-- 错误：food 可能为 null -->
<view>{{ food.name }}</view>

<!-- 正确：使用 v-if 保护 -->
<view v-if="food">{{ food.name }}</view>
```

---

## 42. 健康饮食类应用开发规则

### 42.1 营养数据计算

- 所有营养素计算需基于每 100g 的标准数据
- 提供用户自定义份量的计算功能
- 保留适当的小数位数（通常 1-2 位）

### 42.2 食物数据库设计

- 内置常见食物数据（至少覆盖主食、肉类、蔬果、饮品等分类）
- 支持用户添加自定义食物
- 自定义食物需标记 `isCustom: true` 便于区分

### 42.3 数据持久化

- 使用 `uni.storage` 进行本地存储
- 封装统一的存储工具函数
- 存储前 JSON 序列化，读取后 JSON 反序列化
- 提供默认值防止首次读取返回 null

### 42.4 删除功能模块

删除不需要的功能模块时，需要清理以下内容：
1. 页面文件 (`pages/xxx/xxx.vue`)
2. `pages.json` 中的路由配置
3. 相关页面中的菜单入口和跳转方法
4. `storage.js` 中的相关存储函数
5. 其他引用该模块的代码

---

## 43. UniApp 项目打包交付规则

### 43.1 需要排除的文件

```
node_modules/
dist/
.playwright-mcp/
.venv/
docs/
result.md
rule.md
.agent/
*.log
.DS_Store
Thumbs.db
```

### 43.2 必须保留的文件

- `package-lock.json` - 用于 `npm ci` 安装依赖
- `src/` - 源代码目录
- `index.html` - H5 入口
- `vite.config.js` - 构建配置
- `README.md` - 项目说明

### 43.3 打包命名规范

- 使用项目文件夹名称作为 zip 文件名
- 例如：`label-2862.zip`

---

## 44. UniApp 触摸坐标计算规则

### 44.1 坐标系统一致性

- `touch.clientX/clientY` 是相对于视口的坐标
- `boundingClientRect` 返回的 `left/top` 也是相对于视口的
- 两者可以直接相减计算相对坐标：`localX = clientX - rect.left`
- **不要混用** `pageX/pageY`（包含滚动偏移）和 `clientX/clientY`

### 44.2 避免坐标缓存陷阱

- **问题**：缓存 `boundingClientRect` 后，如果页面发生滚动或布局变化，缓存值失效
- **症状**：红点/标记总是偏移到顶部或底部
- **解决方案**：每次触摸事件都实时调用 `createSelectorQuery` 获取最新边界

### 44.3 百分比定位优于像素定位

- 不同设备的 DPI、逻辑像素和物理像素比例不同
- 使用 `left: 50%` 而非 `left: 100px` 可避免缩放问题
- 百分比公式：`percentX = (localX / rect.width) * 100`

### 44.4 自定义组件中的 createSelectorQuery

- 在 Vue 3 Composition API 中，必须使用 `getCurrentInstance()` 获取组件实例
- 调用时使用 `.in(instance)` 确保选择器在组件内部查找：
  ```javascript
  import { getCurrentInstance } from 'vue'
  const instance = getCurrentInstance()
  uni.createSelectorQuery().in(instance).select('.element').boundingClientRect(...)
  ```
- 不使用 `.in(instance)` 可能导致查询到错误的元素或返回 null

### 44.5 触摸区域的 Flexbox 布局注意

- 如果父容器使用 `display: flex; align-items: center; justify-content: center;`
- 绝对定位的子元素（如红点）仍然相对于最近的 `position: relative` 祖先定位
- 确保 `transform: translate(-50%, -50%)` 用于居中对齐红点

---

## 45. UniApp 自动点击功能开发规则

### 45.1 定时器生命周期管理

- 使用 `setInterval` 时必须在组件卸载时清除：`onUnmounted(() => clearInterval(timer))`
- 停止记录时也必须清除定时器
- 使用标识变量（如 `isAutoClicking`）跟踪定时器状态

### 45.2 用户反馈设计

- 自动点击应有明确的视觉反馈（如闪烁动画）
- 触觉反馈（振动）使用 `uni.vibrateShort()` 并用条件编译包裹：
  ```javascript
  // #ifdef APP-PLUS
  uni.vibrateShort({ success: () => {} })
  // #endif
  ```
- 定期显示计数提示（如每 5 次显示一次 Toast）

### 45.3 位置记录与自动点击分离

- 手动记录位置时保存坐标到 `savedMarkerXPercent/savedMarkerYPercent`
- 自动点击时从保存的坐标读取，而不是每次随机
- 这确保自动点击的位置与用户手动记录的位置一致

---

## 46. UniApp 选项生成避免无限循环

### 46.1 问题场景

在练习或闯关模式中生成随机选项时，如果可选范围小于所需选项数量，会导致无限循环。

**错误示例**：
```javascript
// 当 maxNumber = 3 但需要 4 个选项时，while 永远无法退出
const options = new Set([correctAnswer])
while (options.size < 4) {
  options.add(getRandomNumber(1, maxNumber)) // 只有 1, 2, 3 可选
}
```

### 46.2 解决方案

1. **限制选项数量**：`optionCount = Math.min(4, availableRange)`
2. **扩大干扰选项范围**：干扰项可从更大范围（如1-10）生成，只保证正确答案在限定范围内
3. **预检查**：生成前检查有效数量是否足够

**正确示例**：
```javascript
const options = new Set([correctAnswer])
while (options.size < 4) {
  // 从1-10范围生成干扰选项，避免无限循环
  options.add(getRandomNumber(1, 10))
}
```

---

## 47. Vue 组件 Props 空值安全

### 47.1 问题场景

组件 props 为 `null` 或 `undefined` 时，模板中直接访问属性会导致运行时错误。

**错误示例**：
```vue
<!-- 当 objectType 为 null 时崩溃 -->
<text>{{ objectType.emoji }}</text>
```

### 47.2 解决方案

1. **设置默认值**：使用工厂函数返回默认对象
2. **可选链访问**：使用 `?.` 操作符
3. **回退值**：使用 `||` 或 `??` 提供备选

**正确示例**：
```javascript
// Props 定义
objectType: {
  type: Object,
  default: () => ({ emoji: '⭐', name: '星星' })
}
```

```vue
<!-- 模板中使用可选链和回退值 -->
<text>{{ objectType?.emoji || '⭐' }}</text>
```

### 47.3 初始化规则

- 使用 `ref()` 初始化时，不要用 `null`，应提供有效的默认对象
- 例如：`const currentType = ref(TYPES[0])` 而非 `ref(null)`

---

## 48. UniApp 页面数据同步与生命周期

### 48.1 onMounted vs onShow

| 生命周期 | 触发时机 | 适用场景 |
|----------|----------|----------|
| `onMounted` | 组件首次挂载 | 一次性初始化、事件绑定 |
| `onShow` | 每次页面显示 | 需要刷新的数据、统计信息 |

### 48.2 问题场景

使用 `onMounted` 加载统计数据时，从其他页面返回后数据不会更新。

### 48.3 解决方案

TabBar 页面或需要实时数据的页面应使用 `onShow`：

```javascript
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  loadStats()      // 每次显示时刷新
  loadProgress()   // 确保数据同步
})
```

### 48.4 适用页面

- 首页统计显示
- 个人中心/我的页面
- 任何显示累计数据的页面

---

## 49. UniApp 练习模块自动返回设计

### 49.1 用户体验原则

练习完成后应自动引导用户返回首页，减少操作步骤。

### 49.2 实现方式

```javascript
function onPracticeComplete() {
  showResultModal.value = true
  
  // 显示结果后自动返回
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' })
  }, 2000)
}
```

### 49.3 设计要点

- 结果弹窗仍保留"返回首页"按钮供用户主动点击
- 延迟时间建议 2 秒，足够用户看清结果
- 使用 `uni.switchTab` 返回 TabBar 页面
- 闯关全部通关时显示祝贺 Toast 再返回

---

## 50. UniApp 跨平台记账应用开发经验总结

### 50.1 TabBar 页面导航限制

**问题**：在微信小程序中，使用 `uni.navigateTo()` 跳转到 TabBar 页面会报错：
```
navigateTo:fail can not navigateTo a tabbar page
```

**解决方案**：
1. TabBar 页面必须使用 `uni.switchTab()` 跳转
2. `switchTab` 不支持 URL 传参，需通过 storage 或全局状态传递数据

```javascript
// ❌ 错误写法
uni.navigateTo({ url: '/pages/add/add?type=expense' })

// ✅ 正确写法
uni.setStorageSync('quickAddType', 'expense')
uni.switchTab({ url: '/pages/add/add' })
```

### 50.2 页面生命周期选择

**问题**：在小程序端，`onMounted` 获取页面参数可能不可靠。

**解决方案**：使用 UniApp 的 `onLoad` 生命周期钩子：

```javascript
import { onLoad } from '@dcloudio/uni-app'

onLoad((options) => {
  if (options && options.id) {
    // 可靠获取页面参数
  }
})
```

### 50.3 事件监听与页面销毁

**问题**：`uni.$on()` 注册的全局事件不会自动销毁，导致内存泄漏。

**解决方案**：在 `onUnload` 中移除监听器：

```javascript
import { onLoad, onUnload } from '@dcloudio/uni-app'

onLoad(() => {
  uni.$on('dataUpdated', handleUpdate)
})

onUnload(() => {
  uni.$off('dataUpdated')
})
```

### 50.4 删除操作后的导航

**问题**：删除后 `navigateBack()` 可能失败（上一页也是 TabBar 页）。

**解决方案**：删除后直接跳转到明确的 TabBar 页：

```javascript
uni.switchTab({ url: '/pages/bills/bills' })
```

### 50.5 Vite 端口配置

```javascript
// vite.config.js
export default defineConfig({
  plugins: [uni()],
  server: { port: 3000 },
})
```

---

## 51. SiliconFlow AI API 集成规范

### 51.1 模型名称格式

SiliconFlow API 的模型名称格式与智谱官方 API 不同：

```yaml
# 正确的 SiliconFlow 模型名称示例
zhipu:
  model: Pro/zai-org/GLM-4.7      # GLM-4.7 模型
  model: THUDM/glm-4-9b-chat      # GLM-4 9B Chat 模型
  base-url: https://api.siliconflow.cn/v1/chat/completions
```

### 51.2 消息格式要求

SiliconFlow API 对消息序列有严格要求：

- 消息必须按 User -> Assistant -> User 交替
- 不允许连续的 User 消息或连续的 Assistant 消息
- 必须以 User 消息结尾

**解决方案**：在构建消息历史时过滤无效序列：

```java
// 过滤连续的用户消息
if ("user".equals(currentRole)) {
    if (!validHistory.isEmpty() && 
        "user".equals(validHistory.get(validHistory.size() - 1).get("role"))) {
        validHistory.remove(validHistory.size() - 1);  // 移除未回答的旧问题
    }
    validHistory.add(msg);
}
```

---

## 52. JJWT 0.12.x 升级注意事项

### 52.1 API 变化

JJWT 0.12.x 与 0.11.x 有重大 API 变化：

```java
// 旧版本 (0.11.x)
Jwts.builder().signWith(SignatureAlgorithm.HS256, secret)

// 新版本 (0.12.x)
SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
Jwts.builder().signWith(key)

// 解析 Token
Jwts.parser().verifyWith(key).build().parseSignedClaims(token)
```

### 52.2 密钥长度要求

HS256 算法要求密钥至少 256 位（32 字节）：

```yaml
jwt:
  secret: smartqa-jwt-secret-key-2024-secure-random-string  # 至少32字符
```

---

## 53. Spring Boot 3 + Lombok 兼容性

### 53.1 实体类必须显式定义 getter/setter

在 Spring Boot 3 + MyBatis-Plus 环境中，Lombok 注解可能不被正确处理：

**推荐做法**：实体类手写 getter/setter 或确保 Lombok 正确配置：

```java
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    
    // 显式定义 getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
```

---

## 54. 前后端字段命名一致性

### 54.1 API 响应字段

确保后端返回的字段名与前端期望一致：

```java
// 后端
item.put("preview", title);  // 前端期望 "preview"

// 前端
{{ session.preview || '新对话' }}  // 使用 "preview" 字段
```

### 54.2 常见不一致问题

| 场景 | 后端返回 | 前端期望 | 解决方案 |
|------|---------|---------|---------|
| 会话标题 | title | preview | 统一使用 preview |
| 封面图片 | coverImage | cover_image | 使用驼峰命名 |

---

## 55. Docker 健康检查最佳实践

### 55.1 Spring Boot 后端

```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 5
    start_period: 60s  # 给 Spring Boot 足够启动时间
```

### 55.2 MySQL 数据库

```yaml
db:
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${MYSQL_ROOT_PASSWORD}"]
    interval: 10s
    timeout: 5s
    retries: 10
```

---

## 56. 资讯封面图片管理

### 56.1 静态图片存放

将封面图片放在前端 `public/images/` 目录：

```
frontend/
└── public/
    └── images/
        ├── news-spring-boot.png
        ├── news-vue.png
        └── news-docker.png
```

### 56.2 数据库存储路径

使用相对路径存储：

```sql
UPDATE news SET cover_image='/images/news-spring-boot.png' WHERE id=1;
```

### 56.3 前端渲染

```vue
<img v-if="item.coverImage" :src="item.coverImage" alt="">
<div v-else class="placeholder">
  <el-icon><Document /></el-icon>
</div>
```

---

## 57. Vue3 纯前端项目规则

### 57.1 路由路径格式

在 Vue Router 中配置嵌套路由时，子路由获取的 `path` 不带前导斜杠。在侧边栏菜单中使用 `router` 模式时，必须确保 `index` 属性的路径格式正确：

```javascript
// 错误 - 会导致 404
:index="`${route.path}/${child.path}`"  // 结果: product/list

// 正确 - 添加前导斜杠
:index="`/${route.path}/${child.path}`"  // 结果: /product/list
```

### 57.2 Pinia 状态持久化

使用 `pinia-plugin-persistedstate` 插件实现状态持久化：

```javascript
// main.js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// store 中启用
export const useUserStore = defineStore('user', {
  persist: true,  // 自动持久化到 localStorage
  state: () => ({...}),
})
```

### 57.3 localStorage Mock 数据模式

纯前端项目使用 localStorage 模拟后端 API，采用初始化函数模式：

```javascript
const initData = () => {
  const stored = localStorage.getItem('mock_key')
  if (stored) return JSON.parse(stored)
  
  const defaultData = [...]
  localStorage.setItem('mock_key', JSON.stringify(defaultData))
  return defaultData
}

// 增删改操作后立即同步
localStorage.setItem('mock_key', JSON.stringify(updatedData))
```

### 57.4 Element Plus el-radio 使用

Element Plus 2.x 版本中，`el-radio` 使用 `value` 属性替代 `label`：

```vue
<!-- 正确 -->
<el-radio :value="1">选项1</el-radio>

<!-- 已废弃 - 会有 console 警告 -->
<el-radio :label="1">选项1</el-radio>
```

### 57.5 管理员账户保护

用户管理模块中必须保护当前登录的管理员账户：
- 禁止修改自己的角色
- 禁止禁用自己的账户
- 禁止删除自己的账户

```javascript
const isCurrentUser = user.username === currentUser.username
// 禁用按钮
<el-button :disabled="isCurrentUser" @click="changeRole(user)">
```

### 57.6 数据一致性同步

修改用户信息后，需同步更新所有显示该信息的位置：

```javascript
// 1. 更新 Store
userStore.updateUserInfo({ nickname: newNickname })

// 2. 更新 localStorage（如有 mock 用户列表）
const users = JSON.parse(localStorage.getItem('mock_users'))
const index = users.findIndex(u => u.id === userId)
users[index].nickname = newNickname
localStorage.setItem('mock_users', JSON.stringify(users))
```

### 57.7 ECharts 响应式处理

图表必须处理容器大小变化：

```javascript
import { onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

let chart = null

onMounted(() => {
  chart = echarts.init(chartRef.value)
  window.addEventListener('resize', handleResize)
})

const handleResize = () => chart?.resize()

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
```

### 57.8 Vite 开发服务器配置

```javascript
// vite.config.js
server: {
  port: 3000,        // 默认端口
  host: true,        // 允许外部访问
  open: false        // 不自动打开浏览器
}
```

如需强制使用指定端口（端口被占用时报错而非切换），添加 `strictPort: true`。




## 36. Vue 3 + Vite 开发最佳实践 (Label-2800 项目总结)

### 36.1 静态资源处理
- **动态路径**：在 Vite 中引用动态图片路径时，不要直接拼接字符串路径，应使用 `new URL(path, import.meta.url).href` 确保构建后路径正确。
- **本地优先**：对于纯前端项目，尽可能将关键资源（如 Banner 图、Logo）放入 `src/assets` 或 `public` 目录，避免依赖外部 CDN，以确保离线可用性。

### 36.2 Vue 3 组件与状态管理
- **语法糖**：新项目始终推荐使用 `<script setup>` 语法糖，代码更简洁，运行时性能更好。
- **响应式层级**：避免多层嵌套的响应式对象，优先使用 `ref` 处理基本类型，`reactive` 处理对象，保持状态扁平化。

### 36.3 弹窗与层级管理
- **Teleport 使用**：所有的模态框（Modal）、全屏遮罩、Tooltip 等浮层组件，务必使用 `<Teleport to='body'>` 将其渲染到 `body` 节点下。
- **原因**：这能有效避免父组件的 `overflow: hidden` 或 `z-index` 上下文导致弹窗被截断或层级错误的问题。

### 36.4 样式架构
- **CSS 变量**：推荐在 `variables.css` 中定义全局 CSS 变量（颜色、间距、圆角），组件内尽量使用变量而非硬编码，方便主题切换和统一维护。
- **Scoped 样式**：组件内样式默认均应添加 `scoped` 属性，防止样式污染。

### 36.5 交互与动画
- **自定义指令**：对于复用的 DOM 交互逻辑（如滚动显现动画、点击外部关闭），应封装为 Vue 自定义指令（Directives），保持组件逻辑纯净。

---

## 37. 图书馆管理系统开发经验总结

### 37.1 Element Plus el-menu 组件与 router 模式
- **问题**: 在 el-menu 组件上使用 
outer 属性时，可能会与 Vue 的响应式状态更新产生冲突，导致意外的路由跳转
- **解决方案**: 移除 
outer 属性，改用 @select 事件手动处理导航
- **示例**:
  ```vue
  <el-menu @select="handleMenuSelect">
  
  function handleMenuSelect(index) {
    router.push(index)
  }
  ```

### 37.2 Mock 数据层设计
- **localStorage 持久化**: 使用 localStorage 存储 Mock 数据可以在页面刷新后保留数据
- **初始化检查**: 在应用启动时检查是否已有数据，避免重复初始化覆盖用户数据
- **ID 生成**: 使用 Date.now() 或自增 ID 确保唯一性

### 37.3 表单验证与用户反馈
- **必填字段验证**: Element Plus 的表单验证在 el-form-item 上需要正确设置 prop 属性
- **下拉框验证**: el-select 的验证需要特别注意，用户经常忘记选择导致验证失败但无明显提示
- **友好提示**: 使用 ElMessage.success/error/warning 提供即时操作反馈

### 37.4 角色权限控制
- **路由守卫**: 在 
outer.beforeEach 中检查用户角色和路由权限
- **菜单过滤**: 根据用户角色动态过滤可访问的菜单项
- **自我保护**: 管理员账户应禁止自我删除和禁用操作

### 37.5 ECharts 集成最佳实践
- **响应式图表**: 使用 ResizeObserver 监听容器尺寸变化，自动调用 chart.resize()
- **组件销毁**: 在 onUnmounted 中调用 chart.dispose() 释放资源
- **配置合并**: 使用 setOption 的 
otMerge 参数控制配置合并行为

---

## 38. 微信小程序开发规则 (Label-2407 音乐播放器项目总结)

### 38.1 TabBar 图标格式限制
- **重要**：微信小程序 TabBar 图标**只支持 PNG/JPG/JPEG 格式**，不支持 SVG
- **错误提示**：`["tabBar"]["list"][0]["iconPath"] 文件格式错误，仅支持 .png、.jpg、.jpeg 格式`
- **解决方案**：将 SVG 图标转换为 PNG 格式，推荐尺寸 81x81 像素

### 38.2 InnerAudioContext 音频 API 使用
- **音量控制**：使用 `audioContext.volume` 属性，范围 0-1
- **倍速播放**：使用 `audioContext.playbackRate` 属性，范围 0.5-2.0
- **单曲循环**：设置 `audioContext.loop = true`
- **注意**：`obeyMuteSwitch: false` 可让音频在静音模式下仍播放

### 38.3 页面导航方式
- **有 TabBar 时**：使用 `wx.switchTab()` 跳转到 TabBar 页面
- **无 TabBar 时**：使用 `wx.navigateTo()` 和 `wx.navigateBack()` 进行页面栈导航
- **注意**：删除 TabBar 后需要同步修改所有页面的导航方法

### 38.4 本地存储持久化
- **保存状态**：使用 `wx.setStorageSync(key, value)` 同步保存
- **读取状态**：使用 `wx.getStorageSync(key)` 同步读取
- **适用场景**：播放进度、音量、倍速、循环模式等用户偏好

### 38.5 事件管理模式
- **发布订阅**：在音频管理器中实现 `on(event, callback)` 和 `off(event, callback)` 方法
- **页面生命周期**：在 `onLoad` 中添加监听，在 `onUnload` 中移除监听
- **防止内存泄漏**：确保页面销毁时移除所有事件监听器

### 38.6 音频缓冲问题
- **首次播放慢**：网络音频需要缓冲，这是正常现象
- **用户提示**：可显示 loading 状态告知用户正在加载
- **解决方案**：使用本地音频或预加载机制加快响应

### 38.7 小程序项目结构
- **app.json**：全局配置，不使用 TabBar 时删除 `tabBar` 字段即可
- **requiredBackgroundModes**：设置 `["audio"]` 支持后台播放
- **图片资源**：建议按类型分目录存放（icons/、covers/）

### 38.8 样式最佳实践
- **CSS 变量**：在 `app.wxss` 中定义全局颜色变量
- **动画性能**：使用 CSS `transform` 和 `opacity` 实现动画，避免改变布局属性
- **单位选择**：使用 `rpx` 作为响应式单位，750rpx = 屏幕宽度

---

## 39. 微信小程序图片处理规则

### 39.1 Windows 模拟器兼容性问题

**问题**：Windows 微信开发者工具模拟器中，`wx.getImageInfo` 对相册选取的临时文件路径经常返回 `getImageInfo:fail invalid` 错误。

**解决方案**：
- **不使用** `wx.getImageInfo` 获取图片信息
- 使用 `<image>` 组件的 `bindload` 事件获取图片尺寸
- Canvas 图片加载使用 `canvas.createImage()` 方法

```javascript
// ❌ 错误做法（Windows模拟器不兼容）
wx.getImageInfo({
  src: tempFilePath,
  success: (res) => { /* ... */ }
})

// ✅ 正确做法（使用Image组件）
<image src="{{imagePath}}" bindload="onImageLoad" />
onImageLoad(e) {
  const { width, height } = e.detail
}
```

### 39.2 ImageData 构造函数问题

**问题**：小程序环境（特别是 Windows 模拟器）中，`new ImageData()` 构造函数可能不可用，导致 `ReferenceError: ImageData is not defined`。

**解决方案**：使用 Canvas Context 的 `createImageData` 方法替代：

```javascript
// ❌ 错误做法
const imageData = new ImageData(
  new Uint8ClampedArray(data),
  width,
  height
)

// ✅ 正确做法
const imageData = ctx.createImageData(width, height)
imageData.data.set(originalData)
```

### 39.3 Canvas 元素查询时序

**问题**：使用 `wx:if` 控制 Canvas 显示时，在 `setData` 后立即查询 Canvas 会失败，因为 DOM 尚未渲染。

**解决方案**：
- 先设置状态使 Canvas 渲染到 DOM
- 使用 `setTimeout` 延迟 300ms 后再查询

```javascript
// 先让Canvas渲染
this.setData({ showCanvas: true })

// 延迟查询
setTimeout(() => {
  wx.createSelectorQuery()
    .select('#myCanvas')
    .fields({ node: true, size: true })
    .exec((res) => { /* ... */ })
}, 300)
```

### 39.4 布局抖动问题

**问题**：使用 `wx:if` 控制元素显隐会导致布局重排，引起页面抖动。

**解决方案**：使用 CSS `visibility` 和 `opacity` 替代 `wx:if`：

```css
.hidden {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}
```

```html
<!-- ❌ 会导致抖动 -->
<view wx:if="{{show}}">...</view>

<!-- ✅ 不会抖动 -->
<view class="{{show ? '' : 'hidden'}}">...</view>
```

### 39.5 滤镜预览优化

**问题**：在首页生成大量 Canvas 滤镜预览会消耗大量资源。

**解决方案**：使用渐变色 + Emoji 图标代替真实图片预览：

```javascript
const filterStyles = {
  classicChrome: {
    gradient: 'linear-gradient(135deg, #8B9A7C 0%, #C4B8A8 50%, #A69888 100%)',
    icon: '🎞️'
  },
  // ...
}
```

### 39.6 图片格式校验

**推荐支持格式**：JPG, JPEG, PNG, WEBP

**校验方法**：
```javascript
const fileExt = filePath.split('.').pop().toLowerCase()
const supportedFormats = ['jpg', 'jpeg', 'png', 'webp']
if (!supportedFormats.includes(fileExt)) {
  wx.showToast({ title: '不支持的图片格式', icon: 'none' })
  return
}
```

### 39.7 混合显示方案

**最佳实践**：使用 Image 组件显示原图，Canvas 仅用于滤镜处理：

- **Image 组件**：兼容性最好，作为底层显示原图
- **Canvas**：仅在应用滤镜时叠加显示
- **对比模式**：隐藏 Canvas，显示底层 Image

```html
<view class="preview-container">
  <!-- 原图（始终存在） -->
  <image class="{{showFiltered ? 'hidden' : ''}}" src="{{imagePath}}" />
  <!-- 滤镜效果（条件显示） -->
</view>
```

---

## 40. 转盘/抽奖类小程序开发规则

### 40.1 转盘旋转动画实现

**核心技术**：使用 CSS3 `transition` + `transform: rotate()` 实现流畅旋转。

```css
.wheel {
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}
```

**注意事项**：
- 使用 `cubic-bezier` 缓动曲线模拟真实减速效果
- 旋转角度必须累加，不能重置为 0（否则会反向旋转）
- 动画时长建议 3-5 秒，增加悬念感

### 40.2 随机结果精确计算

**核心公式**：
```javascript
const sectorAngle = 360 / foods.length;
const targetAngle = sectorAngle * targetIndex + sectorAngle / 2; // 指向扇区中心
const baseRotation = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7圈
const totalRotation = currentRotation + baseRotation + (360 - targetAngle);
```

**关键点**：
- 目标角度必须指向扇区中心，而非边缘
- 基础旋转圈数使用随机值增加不确定性
- 总旋转角度 = 当前角度 + 基础圈数 + 对齐角度

### 40.3 多选项拥挤场景处理

**问题**：当选项数量 > 8 时，转盘上的文字会重叠或难以辨认。

**解决方案**：
1. **智能紧凑模式**：根据选项数量动态缩放元素
2. **隐藏密集文字**：选项多时只显示 Emoji 图标
3. **HUD 中心显示**：在转盘中心悬浮显示当前选中项名称

```css
/* 紧凑模式 */
.wheel.compact .ferris-card {
  transform: scale(0.85);
}
.wheel.compact .card-name {
  display: none;
}
```

```html
<!-- HUD 中心文字 -->
<view class="center-text-display">
  <text>{{currentPreview.name}}</text>
</view>
```

### 40.4 实时追踪旋转角度

**需求**：在转盘旋转过程中实时更新中心显示的选项。

**实现方式**：
```javascript
startTracking(duration, totalRotation) {
  const startTime = Date.now();
  this.trackingTimer = setInterval(() => {
    const t = (Date.now() - startTime) / duration;
    const easeOut = 1 - Math.pow(1 - t, 3); // 模拟 cubic-bezier
    const currentRot = startRotation + (totalRotation - startRotation) * easeOut;
    this.updateCurrentSelection(currentRot);
  }, 50);
}
```

**注意**：JS 计算的角度与 CSS 动画可能有微小偏差，但视觉上可接受。

### 40.5 按钮禁用态可见性

**问题**：禁用状态的按钮常常变成完全灰色，难以辨认。

**解决方案**：使用 `opacity` + `filter: grayscale()` 而非完全更换背景色：

```css
.btn.disabled {
  opacity: 0.6;
  filter: grayscale(30%);
  /* 不要用 background: gray */
}
```

**效果**：按钮保留原色调，只是变淡，用户仍能识别按钮位置和功能。

### 40.6 CSS 编辑器替换工具陷阱

**常见错误**：使用代码替换工具时，`TargetContent` 包含 `this.setData({` 但 `ReplacementContent` 遗漏了这行，导致语法破坏。

**预防措施**：
- 替换 `setData` 调用时，确保完整包含 `this.setData({` 开头
- 替换后立即检查 lint 错误
- 优先替换整个函数而非函数内片段

---

## 51. 微信小程序图标资源规范

### 51.1 TabBar 图标要求

微信小程序 TabBar 图标有严格限制：
- **格式**: 必须是 PNG 格式，不支持 SVG
- **尺寸**: 建议 81x81 像素
- **路径**: 必须使用相对路径或绝对路径，不能使用网络图片

### 51.2 普通图标可使用 SVG

页面内的普通图标可以使用 SVG 格式：
- 体积小，矢量可缩放
- 可通过 `<image>` 标签直接引用
- 修改颜色需直接编辑 SVG 文件

### 51.3 图片占位符问题

当图片生成额度不足时，应避免使用纯色小方块作为占位符：
- 优先使用 SVG 矢量图标替代
- 如必须用占位符，添加明显的"图片待添加"提示
- 及时清理无用的占位符文件

---

## 52. 微信小程序数据展示应用规范

### 52.1 纯展示型应用

对于无后端的纯展示型小程序：
- 数据存储在 JS 模块文件中，使用 `module.exports` 导出
- 收藏等用户数据使用 `wx.setStorageSync` / `wx.getStorageSync` 持久化
- 搜索功能在前端本地实现，无需API调用

### 52.2 价格信息处理

如果应用定位为"展示"而非"销售"：
- 移除所有价格显示元素
- 保留重量、材质等技术规格
- 收藏功能可保留，但应调整提示语（如"加入收藏"而非"加入购物车"）

---

## 53. 跨平台项目图片资源管理

### 53.1 按需生成策略

当图片生成资源有限时：
- 按分类生成代表性产品图片（每类1-2张）
- 精简数据文件，只保留有真实图片的产品
- 使用 SVG 图标替代分类图标

### 53.2 图片命名规范

```
images/
├── icons/          # 功能图标 (SVG优先)
│   ├── check.svg
│   ├── frame.svg
│   └── helmet.svg
├── products/       # 产品图片 (高清PNG)
│   ├── canyon-frame.png
│   └── poc-ventral.png
└── banners/        # 轮播图
    └── banner1.png
```

---

## 54. Electron + Vite + Monaco Editor 项目规则

### 54.1 react-monaco-editor 配置

使用 `react-monaco-editor` 时必须配置 Vite 插件：

```typescript
// electron.vite.config.ts
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
  renderer: {
    plugins: [
      react(),
      (monacoEditorPlugin as unknown as { default: typeof monacoEditorPlugin }).default({
        languageWorkers: ['editorWorkerService', 'typescript', 'json', 'css', 'html']
      })
    ]
  }
})
```

### 54.2 依赖版本兼容性

`react-monaco-editor` 对 `monaco-editor` 版本有严格要求：
- `react-monaco-editor@0.55.0` 需要 `monaco-editor@^0.44.0`
- 安装前检查 peer dependencies，避免版本冲突

### 54.3 PDF.js Worker 配置

react-pdf 需要配置 worker 源，推荐使用 CDN：

```typescript
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
```

### 54.4 CSP 配置

使用外部 CDN 资源时需更新 Content-Security-Policy：

```html
<meta http-equiv="Content-Security-Policy" 
  content="script-src 'self' 'unsafe-eval' https://unpkg.com; 
           worker-src 'self' blob: https://unpkg.com;">
```

### 54.5 拖拽文件事件闪烁问题

实现拖拽功能时，使用计数器避免闪烁：

```typescript
const dragCounter = useRef(0)

const handleDragEnter = (e) => {
  dragCounter.current++
  setIsDragging(true)
}

const handleDragLeave = (e) => {
  dragCounter.current--
  if (dragCounter.current === 0) {
    setIsDragging(false)
  }
}

const handleDrop = (e) => {
  dragCounter.current = 0
  setIsDragging(false)
  // 处理文件...
}
```

### 54.6 Flexbox 布局中的 Monaco Editor

Monaco Editor 在 flex 容器中需要明确高度：

```css
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;  /* 关键：允许 flex 子元素收缩 */
  height: 100%;
}
```

### 54.7 大文件处理

处理大文件（如 30MB+ PDF）时：
- 确保 base64 转换不会损坏数据
- PDF 白屏但页码正确通常意味着文件损坏（检查 "Invalid stream" 错误）
- 测试文件应使用较小体积（建议 < 5MB）

---

## 55. Electron 预加载脚本类型定义

### 55.1 API 接口定义

需要在多处保持类型定义一致：

```typescript
// src/preload/index.d.ts
interface Api {
  openFile: (filters?: FileFilter[]) => Promise<string | null>
  readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>
  readTextFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>
  getSamplesPath: () => Promise<string>
}

declare global {
  interface Window {
    api: Api
  }
}
```

### 55.2 IPC 处理器注册

主进程中注册对应的 IPC 处理器：

```typescript
// src/main/index.ts
ipcMain.handle('app:getSamplesPath', () => {
  if (is.dev) {
    return path.join(process.cwd(), 'samples')
  }
  return path.join(process.resourcesPath, 'samples')
})
```

---

## 56. Windows PowerShell 命令兼容性

Windows PowerShell 与 Unix Shell 命令差异：

| Unix 命令 | PowerShell 等效 |
|-----------|-----------------|
| `rm -rf dir` | `Remove-Item -Recurse -Force dir` |
| `cp file dest` | `Copy-Item file -Destination dest` |
| `cat file` | `Get-Content file` |
| `mkdir -p dir` | `New-Item -ItemType Directory -Force -Path dir` |

---

## 57. Electron + Vite 项目避坑指南 (Label-2375 项目总结)

### 57.1 僵尸进程与单实例锁

**问题**：Electron 应用关闭窗口后进程未完全退出（僵尸进程），导致再次点击图标无法启动新实例（因为单实例锁检测到旧进程存在）。
**原因**：`app.quit()` 是优雅退出，会等待所有异步操作完成。如果有未释放的资源或挂起的事件循环，进程就会卡在后台。
**解决方案**：
1. **强制退出**：在 `window-all-closed` 事件中使用 `app.exit(0)` 替代 `app.quit()`，强制终止进程。
2. **单实例锁机制**：使用 `app.requestSingleInstanceLock()`，并在 `second-instance` 事件中唤醒已存在的窗口。

```typescript
// main/index.ts
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.exit(0) // 关键：使用 exit(0) 强制退出
  }
})
```

### 57.2 窗口显示白屏与可见性

**问题**：为了追求无白屏启动设置 `show: false` 并等待 `ready-to-show`，但在某些环境下该事件不触发，导致"进程在跑但无界面"。
**解决方案**：
1. **兜底策略**：设置 `show: true` 作为默认值，或者在 `createWindow` 后设置超时强制显示。
2. **多重唤醒**：在 `activate` 和 `second-instance` 事件中除了 `createWindow` 外，显式调用 `mainWindow.show()`。

### 57.3 原生模块 (Native Modules) 打包陷阱

**问题**：`sharp` 等原生模块在 Electron 打包（即使是 ASAR Unpack）时极易出现路径问题、DLL 缺失或环境不兼容，导致打包后无法启动。
**解决方案**：
1. **优先纯 JS 替代品**：如果性能允许，优先使用纯 JS 库（如用 `jimp` 替代 `sharp`，用 `adm-zip` / `jszip` 替代原生压缩库）。
2. **Externalize 配置**：在 `electron.vite.config.ts` 中明确排除相关依赖，确保其被正确打包进 bundle 或作为 external 依赖处理。

```typescript
// electron.vite.config.ts
externalizeDepsPlugin({
  exclude: ['jimp', 'jszip'] // 确保打包进主进程
})
```

### 57.4 中文路径与安装包名称

**问题**：使用 `electron-builder` (NSIS) 打包时，如果 `productName` 包含中文，可能会导致某些原生模块加载失败或安装路径乱码。
**解决方案**：
1. **英文 productName**：在 `package.json` 中 `productName` 必须只用英文（如 "FileCompressor"）。
2. **中文快捷方式**：在 `nsis` 配置中使用 `shortcutName` 设置中文名称。

```json
"build": {
  "productName": "FileCompressor", // 英文内部名
  "nsis": {
    "shortcutName": "文件压缩大师" // 中文展示名
  }
}
```

### 57.5 XLSX/PDF 压缩的"负优化"处理

**问题**：XLSX 本质是 ZIP，PDF 可能已压缩。再次压缩可能导致文件变大（负压缩）。
**解决方案**：
1. **压缩前检查**：对比压缩后与原文件大小，如果 `compressed > original`，则回退使用原文件。
2. **用户反馈**：当压缩率 ≤0% 时，给出明确提示（如"文件已高度优化"），避免用户以为软件故障。
3. **针对性优化**：XLSX 仅压缩媒体文件夹中的图片和 minifying XML，不要盲目重压缩整个 ZIP。

---

## 58. 纯前端项目图片资源管理

### 58.1 避免外部占位图服务

**问题**：使用 `via.placeholder.com` 等外部占位图服务，在离线环境或网络不稳定时会导致图片全部加载失败。
**解决方案**：
1. **本地图片优先**：商品图片等关键资源放在 `public/images/` 目录下，使用绝对路径引用（如 `/images/bag1.png`）。
2. **SVG Data URI 兜底**：如果暂时没有真实图片，使用内联 SVG Data URI 作为占位，确保离线可用。
3. **图片加载失败降级**：使用 Vant 的 `van-image` 组件，通过 `#error` 插槽提供降级 UI（如显示首字母）。

```vue
<van-image :src="imageUrl" round>
  <template #error>
    <div class="avatar-fallback">{{ nickname?.charAt(0) }}</div>
  </template>
</van-image>
```

### 58.2 模拟数据中的图片路径

**问题**：数据文件中的图片路径与实际资源不匹配（如数据引用 `.jpg` 但文件是 `.png`）。
**解决方案**：
1. **保持一致**：数据文件中的图片路径扩展名必须与实际文件扩展名一致。
2. **集中管理**：图片路径只在 `data/products.js` 中定义，组件中直接引用 `product.images`，避免硬编码路径。
3. **不要在组件中二次处理**：组件中不应再将 `product.images` 映射为 SVG 占位图或其他格式，应直接使用数据源路径。

---

## 59. Vue 3 + Vant 4 移动端开发注意事项

### 59.1 Vant 组件的按需引入

使用 `unplugin-vue-components` 和 `@vant/auto-import-resolver` 实现自动按需导入，避免手动注册：

```javascript
// vite.config.js
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

export default {
  plugins: [
    Components({ resolvers: [VantResolver()] })
  ]
}
```

### 59.2 规格选择器的价格联动

**问题**：规格选择后价格不更新，或库存判断逻辑有误。
**解决方案**：
1. 使用 `computed` 动态计算当前价格：`basePrice + colorPriceAdd + sizePriceAdd`。
2. 库存取规格组合中的最小值：`Math.min(colorStock, sizeStock)`。
3. 选择缺货规格时禁用"加入购物车"按钮并给出提示。

### 59.3 路由守卫与登录拦截

**问题**：用户未登录时点击"立即购买"应跳转登录页，登录后自动返回原页面。
**解决方案**：
```javascript
// 在组件中检查登录状态
if (!isLoggedIn.value) {
  router.push({ path: '/login', query: { redirect: route.fullPath } })
  return
}
// 登录成功后
const redirect = route.query.redirect
router.replace(redirect || '/personal')
```

---

## 60. LocalStorage 状态管理最佳实践

### 60.1 封装带过期时间的 Storage

```javascript
export function setStorage(key, value, expireHours = 24) {
  const data = {
    value,
    expire: Date.now() + expireHours * 3600 * 1000
  }
  localStorage.setItem(key, JSON.stringify(data))
}

export function getStorage(key) {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const data = JSON.parse(raw)
  if (Date.now() > data.expire) {
    localStorage.removeItem(key)
    return null
  }
  return data.value
}
```

### 60.2 使用 Composables 统一管理状态

- 用户状态 (`useUser`)、购物车 (`useCart`)、收藏 (`useFavorite`) 分别用独立的 Composable 管理。
- 每个 Composable 内部负责读写 LocalStorage，对外暴露响应式数据和方法。
- 避免在组件中直接操作 `localStorage`，确保数据一致性。

---

## 61. 纯前端项目交付注意事项

### 61.1 不需要 Docker

纯前端项目（后端 none、数据库 none）不需要 Docker 容器化，直接通过 `npm install && npm run dev` 即可运行。

### 61.2 模拟登录的安全提示

在登录页面明确标注"输入任意手机号和密码即可登录"，避免 QA 或用户不知道测试账号。使用 Vant 的提示组件而非 `alert()`。

### 61.3 图片资源不要放在 src/assets

对于需要在数据文件中通过路径引用的图片，应放在 `public/` 目录下（如 `public/images/`），因为 `public/` 下的文件会被原样复制到构建输出目录，路径不会被 Vite 处理和 hash 化。

---

## 62. Web Audio (Tone.js) 开发注意事项

### 62.1 AudioContext 必须由用户交互触发

- 浏览器安全策略要求 `AudioContext` 必须在用户手势（click/keydown）后启动
- 在 React 中使用 `Tone.start()` 时需要 `async/await`，并在第一次用户交互时调用
- 不要在 `useEffect` 或组件初始化阶段直接创建 AudioContext

### 62.2 Transport 循环与自动停止

- `Tone.getTransport().loop = true` 配合 `loopStart/loopEnd` 实现循环播放
- 非循环模式下必须使用 `transport.scheduleOnce()` 在结束位置安排自动停止
- 停止时需要同时调用 `transport.stop()`、重置 position、释放所有音符 (`synth.releaseAll()`) 和取消 `requestAnimationFrame`

### 62.3 Transport 位置解析

- `transport.position` 返回字符串格式 `"bars:beats:sixteenths"`，需要手动解析为数值
- 解析时注意：`currentBeat = bars * beatsPerBar + beats`
- 避免将 `transport.position` 直接当作 `number` 使用，必须用 `.toString()` 后再 `split(':')`

### 62.4 useCallback 依赖陷阱

- 在 `play` 函数中如果引用了 `state.loopEnabled`，必须将其加入 `useCallback` 的依赖数组
- 否则会导致闭包捕获旧值，切换循环模式后不生效
- 同理适用于 `state.bpm` 和 `state.notes`

---

## 63. Canvas 网格渲染注意事项

### 63.1 Canvas 尺寸与 DPR

- Canvas 的 `width/height` 属性是像素尺寸，CSS 的 `width/height` 是显示尺寸
- 在高 DPI 屏幕上需要考虑 `window.devicePixelRatio` 进行缩放
- 网格线使用半像素偏移（+0.5px）可避免模糊

### 63.2 黑白键行背景区分

- 使用不同透明度的背景色区分黑键行和白键行，增加视觉层次
- 通过 `midi % 12` 判断是否为黑键：`[1, 3, 6, 8, 10]` 为黑键
- C 音位置（`midi % 12 === 0`）用稍亮的网格线作为八度分割标记

---

## 64. 钢琴键盘与网格同步

### 64.1 缩放同步

- 钢琴键盘的 key 高度必须与网格行高保持一致：`keyHeight = cellHeight * zoomY`
- 如果键盘不随 zoomY 缩放，会导致鼠标位置与实际音高不匹配

### 64.2 滚动同步

- 键盘容器不应有独立的 `overflow-y: auto`，应由父容器统一滚动
- 设置 `overflow: hidden` 并依赖父级 `.piano-roll-content` 的滚动

---

## 65. 彩虹音符颜色映射

### 65.1 HSL 色环映射

- 使用 `pitch % 12` 获取半音位置，映射到 HSL 色环的不同色相值
- 推荐映射: C=0°(红), C#=20°, D=35°, D#=50°, E=60°(黄), F=120°(绿), F#=150°, G=180°(青), G#=210°, A=240°(蓝), A#=270°(紫), B=300°(粉)
- velocity 控制饱和度和亮度，而非色相，确保每个音高颜色一致

### 65.2 CSS 渐变用于音符

- 使用 `linear-gradient(135deg, ...)` 为音符添加渐变效果
- 注意 CSS `background` 和 `backgroundColor` 的区别：渐变必须用 `background`
- `box-shadow` 配合色相值实现音符发光效果

---

## 66. 纯前端音乐应用的音域选择

- 推荐使用 C3-C6（MIDI 48-84, 37 行）而非 C2-C7（61 行）
- 过大的音域会导致网格太高，需要大量滚动，影响编辑体验
- 37 行在 1080p 屏幕上约 592px，配合合理的 header/toolbar 高度刚好适合一屏

---

## 67. TypeScript 版本兼容性

### 67.1 tsconfig 选项兼容

- 避免使用 TypeScript 5.9+ 特有的选项（如 `rewriteRelativeImportExtensions`）
- 建议使用 TypeScript 5.3-5.6 的稳定配置，确保 Vite 4/5 兼容
- `noEmit: true` 在纯 Vite + tsc 类型检查场景下使用可能报错，改用 `tsc -b` 编译模式

---

## 68. 纯前端项目中使用 Node.js 库的 Polyfill 策略

### 68.1 Buffer / Stream / Crypto Polyfill

- 在浏览器中使用依赖 Node.js API（如 `Buffer`、`crypto`、`stream`）的库时，必须配置 polyfill
- Vite 项目推荐使用 `vite-plugin-node-polyfills` 插件
- 必须在 `vite.config.js` 中明确声明需要 polyfill 的模块列表，不要使用全量 polyfill（体积过大）
- 示例：`include: ['buffer', 'crypto', 'stream', 'util', 'process']`

### 68.2 globals 配置

- 部分库在运行时直接访问 `Buffer` 全局变量，必须在 polyfill 配置中设置 `globals: { Buffer: true, process: true }`
- 否则会出现 `Buffer is not defined` 运行时错误

---

## 69. MDB/Access 数据库解析注意事项

### 69.1 mdb-reader 库使用要点

- `mdb-reader` 的输入必须是 Node.js `Buffer`，不能直接传 `ArrayBuffer`，需先 `Buffer.from(arrayBuffer)` 转换
- 系统表以 `MSys` 开头，在展示用户数据时应过滤掉（`filter(name => !name.startsWith('MSys'))`）
- 加密文件会抛出包含 `password`/`encrypted` 关键字的异常，需根据异常信息归类处理

### 69.2 MDB 文件格式校验

- MDB 文件前 4 字节 Magic Bytes 为 `0x00 0x01 0x00 0x00`
- ACCDB 的 Magic Bytes 也相同，区分靠扩展名
- 文件头偏移 `0x14` 处的版本字节可判断 Access 版本（0x00=97, 0x01=2000, ...0x06=2016/2019）
- 偏移 `0x62` 处非零表示数据库已加密

---

## 70. 纯前端项目的最佳实践

### 70.1 无后端项目不使用 Docker

- 纯前端项目（Backend: none, Database: none）不需要 Docker
- 使用 `npm install && npm run dev` 即可启动
- 生产部署使用 `npm run build` 输出到 `dist/` 目录，部署到任意静态服务器

### 70.2 文件处理安全

- 浏览器端文件处理应在内存中完成，使用 `FileReader.readAsArrayBuffer()` 读取
- 文件上传前必须校验：扩展名、文件大小、Magic Bytes
- 大文件处理需显示 Loading 动画，避免 UI 假死
- 使用 `setTimeout` 将耗时操作让出主线程，保证 Loading 动画能渲染

### 70.3 演示数据策略

- 纯前端项目无法生成真实二进制 MDB 文件，应使用内存 Mock 数据提供演示功能
- 演示数据应覆盖所有支持的数据类型（Text, Long, Double, Boolean, DateTime, Memo）
- 演示数据量应足够触发分页功能（建议 50+ 条记录）

---

## 71. CSS 主题切换实现

### 71.1 CSS 变量 + data-theme 属性

- 使用 `:root` 定义默认主题变量，`[data-theme="light"]` 覆盖浅色主题变量
- 通过 `document.documentElement.setAttribute('data-theme', theme)` 切换
- 使用 `localStorage` 持久化用户主题偏好
- 避免使用 `prefers-color-scheme` 媒体查询作为唯一方案，因为用户可能想手动切换

### 71.2 Toast 通知去重

- 短时间内重复触发相同 Toast 会严重影响用户体验
- 实现方案：维护一个时间窗口内的消息 Set（建议 1-2 秒），相同消息在窗口内不重复显示
- Toast 自动消失需配合进度条动画，给用户视觉倒计时反馈

---

## 72. Vite 开发服务器端口冲突处理

- 使用 `vite --port 3000` 时，如果端口被占用 Vite 不会自动切换端口
- 可以在 `vite.config.js` 中设置 `server.strictPort: false` 让 Vite 自动尝试下一个可用端口
- 或者在命令行使用 `npx vite --port 3005` 等指定其他端口
- 调试时确认 Playwright / 测试工具连接的端口与实际服务一致

---

## 73. 纯前端项目的数据持久化策略

- 纯前端项目（后端 `none`、数据库 `none`）必须使用 `LocalStorage` 实现数据持久化
- 封装统一的 `storage` 工具函数（含 JSON 序列化/反序列化和错误处理），禁止裸调 `localStorage.setItem`
- 使用 Pinia `watch` 深度监听状态变化自动同步到 LocalStorage，确保刷新后数据不丢失
- Mock 数据需提供足够丰富的初始数据（至少 15-20 条），避免"空库"交付
- 注意 LocalStorage 存储的数据与内存状态保持一致性（增删改操作后同步更新）

---

## 74. AI 生成产品图片的集成流程

- 为电商类项目生成产品图片时，使用统一的 prompt 模板：`Professional product photography of [产品], [细节描述], white clean background, soft studio lighting, 4K quality`
- 生成的图片统一存放在 `public/images/` 目录下，以产品简称命名（如 `laptop.png`、`shoes.png`）
- 在 mock 数据中使用 `images: ['/images/xxx.png']` 数组格式引用，支持未来多图扩展
- 组件中 `<img>` 标签必须附带 `@error` 事件处理器，实现图片加载失败时的优雅降级（显示分类图标或隐藏 broken icon）
- 生成图片后注意清理旧的 SVG 占位文件，避免冗余资源

---

## 75. 可选字段的表单验证模式（空值可提交 + 有值必验证）

- 对于邮箱、手机号等非必填字段，校验函数需先判空：空值直接返回 `{ valid: true }`
- 有值时进行格式校验，不通过返回 `{ valid: false, message: '具体错误提示' }`
- 在 `@blur` 事件上绑定实时校验，用户离开输入框即刻反馈
- 提交时再次调用校验函数做最终确认，有错误则 toast 提示并阻止提交
- 输入框用动态 class 绑定（`:class="{ 'input-error': errors.field }"`）显示红色边框
- 校验错误信息用 `<p class="field-error">` 行内显示在输入框下方

---

## 76. 页面死链处理最佳实践

- 纯前端项目中绝不使用 `href="#"` 占位链接，这会造成页面跳到顶部且无任何反馈
- 信息展示类链接（如"关于我们"、"隐私政策"等暂未开发的页面）使用 `@click` + toast 提示 `「XX」页面正在建设中`
- 已有对应页面的链接（如"注册登录"、"订单查询"）直接使用 `@click="$router.push('/path')"`
- 社交媒体类链接使用 `@click` + toast 显示相关账号信息
- 所有可点击元素必须添加 `cursor: pointer` 样式

---

## 77. Vue 3 Composables 最佳实践

- 可复用逻辑封装为组合式函数（如 `useToast`），放在 `composables/` 目录
- Composables 内部管理自己的状态（`ref`/`reactive`），通过返回值暴露 API
- 与 DOM 相关的 composables 注意在 `onUnmounted` 中清理副作用（如事件监听、定时器）
- Toast/Notification 类的 composables 使用独立的 DOM 节点挂载，避免组件树中的层级问题

---

## 78. 纯前端项目的 CSS 架构

- 使用 CSS Variables（`--color-primary` 等）建立设计令牌系统，保证全局一致性
- 全局样式拆分为 `variables.css`（变量定义）、`reset.css`（重置样式）、`global.css`（通用组件类）、`animations.css`（动画定义）
- 组件样式使用 `<style scoped>` 防止污染，需要覆盖子组件时使用 `:deep()` 选择器
- 表单相关样式（`.form-input`、`.form-error`、`.input-error`、`.field-error`）在全局样式中定义，确保所有表单风格统一
- autofill 样式问题通过 `-webkit-box-shadow` 覆盖解决，在 reset.css 中全局处理

---

## 79. electron-vite 项目脚手架规则

- 使用 `npm create @quick-start/electron` 创建项目，选择 Vue 框架
- electron-vite 将项目分为 `src/main`、`src/preload`、`src/renderer` 三个模块
- 配置文件为 `electron.vite.config.mjs`，需分别配置 main、preload、renderer 的 Vite 选项
- `npm run dev` 同时启动 Vite 开发服务器和 Electron 窗口，支持 HMR 热更新
- 中国镜像：必须在项目根目录创建 `.npmrc`，同时配置 `registry`、`electron_mirror`、`electron_builder_binaries_mirror` 三项

---

## 80. Electron 多进程 Pinia Store 架构

- 渲染进程中使用 Pinia 管理状态，但 Store 不能跨进程共享
- 推荐拆分为多个职责单一的 Store：
  - `windowStore`：窗口创建、最小化、最大化、关闭、Z-index 层叠
  - `appStore`：应用注册表、应用元信息
  - `desktopStore`：桌面状态（壁纸、主题、图标、控制中心开关等）
- Store 中的 UI 状态（如菜单可见性、控制中心开关）使用 `ref` + action 封装
- 持久化需要手动同步到 `localStorage` 或通过 IPC 调用 `electron-store`

---

## 81. CSS Variables 主题切换规则（Electron 桌面应用）

- 使用 `:root` 定义深色主题变量，`.light-mode` 类覆盖浅色主题变量
- 所有组件样式必须引用 CSS 变量（如 `var(--bg-primary)`），禁止硬编码颜色值
- 主题切换通过 Pinia Store 的 `isDarkMode` 状态控制根组件的 class 绑定
- `backdrop-filter: blur()` 配合半透明背景色实现毛玻璃效果
- 深色主题下 `backdrop-filter` 值通常为 `blur(40px~60px)`

---

## 82. 仿 macOS 桌面 UI 模拟规则

### 82.1 窗口管理
- 窗口必须支持拖拽（标题栏区域）、缩放（四边 + 四角）独立实现
- 红绿灯按钮（关闭/最小化/最大化）使用 hover 时显示图标的交互模式
- 窗口 Z-index 通过全局计数器管理，点击窗口自动提升到最上层
- 最大化使用 CSS 过渡动画，最小化收缩到 Dock 对应位置

### 82.2 Dock 栏
- 使用 `transform: scale()` 实现鼠标靠近时的放大效果
- 放大计算基于鼠标与每个图标中心的距离，使用高斯分布或线性插值
- 分隔线将常驻应用和最近使用的应用分隔
- 运行中的应用在图标下方显示小白点指示器

### 82.3 控制中心与菜单栏联动
- 控制中心的开关（Wi-Fi/蓝牙等）状态变化应实时反映在菜单栏图标上
- 使用 `v-if` 控制菜单栏图标的显示/隐藏（如蓝牙关闭则隐藏蓝牙图标）
- 亮度调节需要全局遮罩层实现屏幕变暗效果，遮罩层设置 `pointer-events: none` 避免阻塞交互
- 遮罩层 `z-index` 必须高于所有其他元素

### 82.4 右键菜单
- 使用 `@contextmenu.prevent` 阻止浏览器默认右键菜单
- 菜单位置根据鼠标坐标动态计算，需考虑屏幕边界防溢出
- 点击菜单项后自动关闭菜单，点击空白区域也关闭
- 子菜单使用 hover 触发显示，带有 `▸` 箭头指示

---

## 83. Electron 应用 .npmrc 中国镜像完整配置

```ini
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
```

- `registry`：npm 包下载源
- `electron_mirror`：Electron 预编译二进制文件下载源（约 80-120MB）
- `electron_builder_binaries_mirror`：electron-builder 打包时所需的辅助二进制文件
- 三项缺一不可，否则安装/打包时仍会从 GitHub 下载，导致超时失败

---

## 84. FastAPI + React 全栈素材平台开发经验总结

### 84.1 Seed 数据与图片元数据一致性

- 种子数据中的素材标题、描述、标签必须与实际图片内容匹配，避免"文不对图"
- 修改 seed 数据前应先查看对应图片文件确认内容，而非凭文件名推测
- 种子数据应覆盖多种分类和标签，确保首页和探索页有丰富内容展示

### 84.2 会员订阅二次确认

- 涉及付费操作（如订阅、购买）必须提供二次确认弹窗，防止误操作
- 确认弹窗应展示关键信息（计划名称、价格、核心权益）
- 确认和取消按钮都要有，处理中状态需禁用按钮并显示 loading
- 弹窗背景遮罩点击应可关闭（非处理中状态时）

### 84.3 素材排序差异化

- "浏览素材"与"最新上传"必须使用不同的排序逻辑，避免内容重复
- 综合推荐排序可使用加权公式：`like_count * 3 + download_count * 2 + view_count * 1`
- 排序参数应通过 URL query string 传递，确保可分享和可刷新
- 前端排序状态与 URL 参数需双向同步（useSearchParams）

### 84.4 页面锚点定位

- Footer 中指向同一页面不同区域的链接应使用锚点（如 `/membership#compare`）
- 锚点目标元素需添加 `scroll-mt-{n}` 类（Tailwind），避免被固定导航栏遮挡
- React SPA 中使用 hash 锚点时，可能需要在页面加载后手动 `scrollIntoView`

### 84.5 Nginx 反向代理配置

- 前端容器内 Nginx 必须配置 `/api/` 和 `/uploads/` 的反向代理到后端服务
- `proxy_pass` 地址使用 Docker Compose 服务名（如 `http://backend:8000`），不能用 `localhost`
- `client_max_body_size` 需设置足够大以支持文件上传（建议 50M）
- `proxy_read_timeout` 适当延长（如 300s），防止大文件上传超时

### 84.6 SQLAlchemy ORM 排序技巧

- 使用 `func.coalesce(column, 0)` 处理 NULL 值，避免排序异常
- 复杂排序可在查询中动态构建表达式：`score = col1 * w1 + col2 * w2`
- 多字段排序时，主排序字段相同的记录应有次排序字段（如 `created_at.desc()`）

### 84.7 前端 Axios 拦截器错误处理

- 使用 `_isBusinessError` 标记避免拦截器和组件层重复弹出错误提示
- 2 秒内相同错误消息去重（使用 Set + setTimeout 清除）
- 401 错误自动清除 token 并延迟跳转登录页，给用户看到提示的时间
- 422 错误（参数校验失败）应解析 `detail` 数组提取具体字段错误信息

### 84.8 Zustand 状态与 LocalStorage 同步

- 用户登录成功后同时更新 Zustand store 和 localStorage
- 修改个人信息后必须调用 `updateUser()` 同步全局状态，确保导航栏等组件实时更新
- 页面刷新时从 localStorage 恢复状态，保证登录状态持久化

