# BrightMind - AI Agent Guide

> 留学生心理健康支持 App（Expo / React Native）
> 目标：快速构建可演示的 MVP，核心是 **presentation**，非生产部署。

---

## 项目规范 (Project Conventions)

### 开发哲学
- **Vibe Coding / 极简主义**：保持代码灵动，避免过度设计。
- **小文件原则**：单个文件保持在 300 行左右。
- **YAGNI**：只解决当前的问题，不为未预见的需求编写代码。
- **水平解耦**：倾向于独立模块，避免深层的继承层次结构。
- **不要过度封装**：要保证代码可读性，三行重复代码好过一个过早的抽象。

### 代码风格
- **严格 TypeScript**：启用严格模式，确保类型安全。
- **Linting & Formatting**：ESLint + Prettier。
- **编程范式**：优先使用函数式组合 (Functional Composition)。

---

## 代码质量 Skills（必须遵守）

开发过程中必须参考以下 5 个 Skill，确保代码质量：

### 1. `better-auth-best-practices`
- 本项目使用 **Clerk** 而非 Better Auth，但其安全理念仍适用
- Session 管理、Token 存储遵循安全最佳实践
- Auth 相关逻辑集中管理，不分散到各组件

### 2. `web-design-guidelines`
- UI 开发完成后，用此 Skill 审查界面代码
- 确保无障碍性 (Accessibility)、语义化结构
- 每个模块完成后运行一次 review

### 3. `frontend-design`
- UI 风格：**现代简洁**，白底 + **红色主色调**
- 避免 AI 生成的千篇一律美学（不要 Inter、不要紫色渐变）
- 选择有辨识度的字体搭配，注重排版和留白
- 动画克制但精准：页面进入的 staggered reveal、hover 微交互

### 4. `vercel-composition-patterns`
- **避免 boolean prop 膨胀**：用 compound components 代替
- **显式变体**：创建明确的变体组件，而非 boolean 模式切换
- **children > render props**：优先用 children 做组合
- **状态解耦**：Provider 是唯一知道状态实现的地方
- Context interface 定义 state / actions / meta

### 5. `vercel-react-best-practices`
- **关键优先级**：消除瀑布请求 > Bundle 优化 > 重渲染优化
- 独立操作用 `Promise.all()`
- 直接导入，避免 barrel files
- 用 `React.memo` 包裹昂贵组件，提升默认非原始 props
- 函数式 `setState`，稳定回调
- 条件渲染用三元运算符，不用 `&&`

---

## 技术栈

| 层级 | 选择 | 说明 |
|---|---|---|
| 框架 | Expo SDK 52+ / Expo Router v4 | 文件路由，类似 Next.js |
| Auth | Clerk (`@clerk/clerk-expo`) | Google 社交登录 |
| 后端/DB | Supabase | PostgreSQL + Auth + Realtime |
| 样式 | NativeWind v4 | Tailwind CSS for React Native |
| 国际化 | i18next + react-i18next | 中/英/法/西 四语 |
| 地图 | react-native-maps + expo-location | 医生列表地图 |
| 翻译 API | Google Cloud Translation API | 文本实时翻译 |
| 支付 | Stripe (test mode) | Credit 充值展示 |

---

## 目录结构

```
brightmind/
├── app/                          # Expo Router 文件路由
│   ├── (auth)/                   # 未登录路由组
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/                   # 主 Tab 路由组
│   │   ├── _layout.tsx           # Tab Navigator
│   │   ├── index.tsx             # Home
│   │   ├── finance.tsx           # OSHC
│   │   ├── doctor.tsx            # Doctor Finder
│   │   ├── translate.tsx         # Translation
│   │   └── profile.tsx           # Profile / Settings
│   ├── finance/                  # Finance 子页面
│   │   ├── compare.tsx           # 套餐对比
│   │   ├── quiz.tsx              # 推荐问卷
│   │   └── guide.tsx             # 修改指引
│   ├── doctor/                   # Doctor 子页面
│   │   ├── [id].tsx              # 医生详情
│   │   └── book.tsx              # 预约表单 (mock)
│   ├── translate/                # Translation 子页面
│   │   └── voice.tsx             # AI 语音翻译 (mock)
│   ├── membership/               # 会员相关
│   │   ├── plans.tsx             # Free vs Premium
│   │   ├── topup.tsx             # 充值 (Stripe)
│   │   └── referral.tsx          # 邀请好友
│   └── _layout.tsx               # Root Layout
├── components/                   # 共享组件
│   ├── ui/                       # 基础 UI 组件
│   ├── finance/                  # Finance 模块组件
│   ├── doctor/                   # Doctor 模块组件
│   └── translate/                # Translation 模块组件
├── lib/                          # 工具/服务
│   ├── supabase.ts               # Supabase client
│   ├── clerk.ts                  # Clerk config
│   ├── i18n.ts                   # i18next config
│   ├── api/                      # API 调用封装
│   │   ├── google-places.ts
│   │   ├── google-translate.ts
│   │   └── healthdirect.ts
│   └── utils/                    # 工具函数
├── data/                         # 静态数据
│   ├── oshc-plans.json           # OSHC 套餐数据
│   └── quiz-questions.json       # 推荐问卷题目
├── locales/                      # 多语言翻译文件
│   ├── en.json
│   ├── zh.json
│   ├── fr.json
│   └── es.json
├── hooks/                        # 自定义 Hooks
├── types/                        # TypeScript 类型
├── constants/                    # 常量 (颜色、配置)
│   └── theme.ts                  # 红色主题色
└── assets/                       # 静态资源 (图片、字体)
```

---

## 数据模型 (Supabase)

### users (Clerk 同步)
```sql
id            UUID PRIMARY KEY
clerk_id      TEXT UNIQUE
email         TEXT
name          TEXT
credits       INTEGER DEFAULT 100
is_premium    BOOLEAN DEFAULT false
referral_code TEXT UNIQUE
language      TEXT DEFAULT 'en'
created_at    TIMESTAMPTZ
```

### referrals
```sql
id            UUID PRIMARY KEY
referrer_id   UUID REFERENCES users
referee_id    UUID REFERENCES users
credits_given INTEGER DEFAULT 50
created_at    TIMESTAMPTZ
```

---

## 模块概要

### Finance (OSHC)
- 静态 JSON 数据，手动维护 4-5 家保险商套餐
- 3-5 题规则引擎问卷 → 加权打分 → 推荐排序
- OSHC 推荐功能仅 **Premium** 用户可用
- 修改指引页面 + 各保险商客服电话（一键拨号）

### Doctor
- Google Places API 搜索附近 psychologist / psychiatrist
- Healthdirect API 补充 Medicare 诊所信息
- 筛选：性别、专长、bulk billing
- 预约：表单 UI + "预约成功" 确认页面（**mock，不发真实请求**）

### Translation
- 文本翻译：Google Cloud Translation API，各语言 ↔ 英语
- AI 语音翻译：**mock 演示**（录制演示动画/预设对话），仅 Premium
- Free 用户仅可使用文本翻译

### Credits / 会员
- 注册送 100 credits
- 邀请好友：唯一邀请码，双方各 +50 credits
- 两级会员：Free / Premium
- Stripe test mode 充值页面

---

## 关键约束

1. **Presentation First** — 所有功能以演示效果为优先，不需要生产级健壮性
2. **Mock 优于真实** — 语音翻译、预约功能用 mock 数据和 UI 动画
3. **300 行文件上限** — 超出则拆分
4. **不要过度封装** — 可读性优先于 DRY
5. **TypeScript strict** — 所有文件必须类型安全
6. **四语言** — 所有用户可见文案必须经过 i18next，不硬编码
