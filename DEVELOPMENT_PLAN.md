# BrightMind 开发方案

> 留学生心理健康支持 App — Expo / React Native MVP
> 目标：可交互、可演示 (Presentation Ready)

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

## 代码质量保障

开发全程需遵守以下 5 个 Skill 的规范，每个模块完成后需进行对应审查：

### Skill 1: `better-auth-best-practices`
**应用场景**：Auth 模块开发时
- 虽然项目使用 Clerk 而非 Better Auth，但安全理念通用
- Session token 安全存储（Expo SecureStore）
- Auth 状态集中管理在 Clerk Provider 中，不在各组件内单独处理
- 保护路由：未登录用户重定向至 sign-in，Premium 功能做权限守卫

### Skill 2: `web-design-guidelines`
**应用场景**：每个页面 UI 完成后，用此 Skill 做一轮 review
- 检查无障碍性：颜色对比度、触控区域大小 (44x44pt)、screen reader 支持
- 语义化：正确使用 `accessibilityRole`、`accessibilityLabel`
- 表单：合理的键盘类型、自动聚焦、错误提示
- 响应式：适配不同屏幕尺寸

### Skill 3: `frontend-design`
**应用场景**：UI 设计与实现
- **色彩**：白底 + 红色主色调 (#E53935 或类似)，灰色辅助，黑色文字
- **字体**：选择有辨识度的字体对（Display + Body），不用 Inter/Roboto/Arial
- **动画**：页面进入 staggered reveal，卡片 hover/press 微交互，tab 切换过渡
- **排版**：注重留白、信息层级、卡片间距
- **避免**：AI slop 千篇一律美学、紫色渐变、无个性的 UI

### Skill 4: `vercel-composition-patterns`
**应用场景**：组件架构设计
- 筛选器组件（Doctor 模块）用 Compound Components 模式
- 问卷组件（Finance 模块）用显式变体，不用 boolean props
- 会员守卫用 Context Provider + children 组合
- 翻译服务的状态管理用 Context interface（state / actions / meta）

### Skill 5: `vercel-react-best-practices`
**应用场景**：全程
- Google Places + Healthdirect 并行请求用 `Promise.all()`
- 地图组件、Stripe 组件做 dynamic import / lazy load
- 直接导入，不通过 barrel files（不搞 `components/index.ts`）
- 列表渲染用 `FlashList`（大列表）或标准 `FlatList`
- 条件渲染用三元运算符 `condition ? <A /> : <B />`，不用 `&&`
- 函数式 setState，避免闭包陷阱

---

## 技术栈详情

```
核心框架        Expo SDK 52+ / Expo Router v4
身份验证        Clerk (@clerk/clerk-expo) — Google 社交登录
数据库          Supabase (PostgreSQL + Realtime)
样式            NativeWind v4 (Tailwind CSS for RN)
国际化          i18next + react-i18next (EN / ZH / FR / ES)
地图            react-native-maps + expo-location
外部 API        Google Places API / Google Cloud Translation API / Healthdirect API
支付            Stripe React Native SDK (test mode)
```

### 需要申请的 API Key / 服务

| 服务 | 用途 | 获取方式 |
|---|---|---|
| Clerk | Google 登录 | clerk.com 创建 Application |
| Supabase | 数据库 | supabase.com 创建 Project |
| Google Cloud Translation API | 文本翻译 | Google Cloud Console 启用 API |
| Google Maps / Places API | 医生搜索 | Google Cloud Console 启用 API |
| Stripe | 充值展示 | stripe.com 获取 test mode key |
| Healthdirect API | Medicare 诊所数据 | developer.healthdirect.gov.au |

---

## 开发阶段

### Phase 0：项目初始化（0.5 天）

**目标**：搭好骨架，所有基础设施就位

- [ ] `npx create-expo-app brightmind --template tabs`
- [ ] 配置 TypeScript strict mode
- [ ] 安装核心依赖：NativeWind、Expo Router、Clerk、Supabase
- [ ] 配置 ESLint + Prettier
- [ ] 搭建目录结构（app / components / lib / data / locales / hooks / types / constants）
- [ ] 配置 NativeWind：tailwind.config.ts + babel plugin
- [ ] 配置 i18next：四语言空壳文件
- [ ] 定义主题常量（constants/theme.ts）：红色主色 + 灰阶 + 间距
- [ ] 创建 Root Layout：Clerk Provider + Supabase Provider + i18n Provider
- [ ] 环境变量：创建 `.env` 模板（所有 API key 占位）

**交付物**：可运行的空壳 App，Tab 导航正常切换

---

### Phase 1：Auth + 用户系统（1 天）

**目标**：登录/注册流程完整，用户数据可持久化

#### 1.1 Clerk 集成
- [ ] 配置 Clerk Application（Google OAuth）
- [ ] `app/(auth)/sign-in.tsx`：Google 登录按钮 + 品牌 UI
- [ ] `app/(auth)/sign-up.tsx`：注册页面（如果 Clerk 需要额外步骤）
- [ ] Auth 路由守卫：未登录自动跳转

#### 1.2 Supabase 用户同步
- [ ] Supabase 建表：`users`、`referrals`
- [ ] Clerk webhook 或首次登录时同步用户到 Supabase
- [ ] 注册时：生成唯一 referral_code、赠送 100 credits
- [ ] 创建 `hooks/useUser.ts`：返回当前用户（含 credits、is_premium）

#### 1.3 会员权限守卫
- [ ] 创建 `components/PremiumGate.tsx`：非 Premium 用户看到升级提示
- [ ] 在受限功能（OSHC 推荐、语音翻译）包裹此守卫

**Skill 审查**：完成后用 `better-auth-best-practices` 审查安全性

---

### Phase 2：Home + 基础 UI（1 天）

**目标**：主页完成，建立整体视觉风格

#### 2.1 Tab Navigator
- [ ] `app/(tabs)/_layout.tsx`：5 个 Tab（Home / Finance / Doctor / Translate / Profile）
- [ ] Tab 图标 + 红色 active 状态
- [ ] Tab 切换动画

#### 2.2 Home 页面
- [ ] `app/(tabs)/index.tsx`：欢迎语（多语言）+ 用户名
- [ ] 四个功能入口卡片（Finance / Doctor / Translate / Membership）
- [ ] 卡片点击导航到对应 Tab 或子页面
- [ ] 当前 credit 余额展示
- [ ] 简短的心理健康 tips（静态文案，多语言）

#### 2.3 基础 UI 组件
- [ ] `components/ui/Button.tsx`：主按钮、次按钮、outline 变体
- [ ] `components/ui/Card.tsx`：内容卡片
- [ ] `components/ui/Input.tsx`：文本输入
- [ ] `components/ui/Badge.tsx`：标签（Premium / Free / Medicare）
- [ ] 页面进入 staggered reveal 动画

**Skill 审查**：完成后用 `frontend-design` 审查视觉风格，用 `web-design-guidelines` 审查无障碍性

---

### Phase 3：Finance / OSHC 模块（1.5 天）

**目标**：OSHC 套餐浏览、对比、推荐、修改指引全部可演示

#### 3.1 数据准备
- [ ] `data/oshc-plans.json`：手动整理 4-5 家保险商数据
  ```
  Medibank, Allianz, Bupa, nib, ahm
  字段：name, provider, price_monthly, coverage, extras,
        dental, optical, physio, pros, cons, contact_phone
  ```
- [ ] `data/quiz-questions.json`：3-5 题推荐问卷
  ```
  题目示例：
  1. 你是单人还是家庭？
  2. 月预算范围？
  3. 是否需要牙科/光学覆盖？
  4. 你更看重价格还是覆盖范围？
  5. 是否需要心理咨询覆盖？
  ```
- [ ] `types/oshc.ts`：OSHC Plan 类型定义

#### 3.2 套餐浏览与对比
- [ ] `app/(tabs)/finance.tsx`：OSHC 模块入口，三个功能卡片（浏览/推荐/修改指引）
- [ ] `app/finance/compare.tsx`：套餐列表 + 横向对比表
- [ ] `components/finance/PlanCard.tsx`：单个套餐卡片（价格、覆盖范围、亮点）
- [ ] `components/finance/CompareTable.tsx`：横向对比（选 2-3 个套餐对比）

#### 3.3 推荐问卷（Premium Only）
- [ ] `app/finance/quiz.tsx`：步骤式问卷 UI
- [ ] `lib/utils/oshc-scorer.ts`：加权打分算法
- [ ] 问卷结果页：推荐排序 + 推荐理由
- [ ] 非 Premium 用户：显示 PremiumGate 提示

#### 3.4 修改指引
- [ ] `app/finance/guide.tsx`：文字说明 + 各保险商客服电话
- [ ] 一键拨号（`Linking.openURL('tel:...')`）

**Skill 审查**：用 `vercel-composition-patterns` 审查问卷组件架构

---

### Phase 4：Doctor 模块（1.5 天）

**目标**：地图 + 医生列表 + 筛选 + mock 预约

#### 4.1 地图与定位
- [ ] 请求定位权限（`expo-location`）
- [ ] `app/(tabs)/doctor.tsx`：顶部地图 + 底部列表（半屏拉起）
- [ ] 地图标记医生位置

#### 4.2 医生数据获取
- [ ] `lib/api/google-places.ts`：搜索附近 psychologist / psychiatrist
- [ ] `lib/api/healthdirect.ts`：补充 Medicare / bulk billing 信息
- [ ] 两个 API 并行请求（`Promise.all`），合并结果
- [ ] `types/doctor.ts`：医生数据类型

#### 4.3 列表与筛选
- [ ] `components/doctor/DoctorCard.tsx`：医生卡片（头像占位、名字、专长、距离、评分）
- [ ] `components/doctor/FilterBar.tsx`：筛选栏
  - 性别：All / Male / Female
  - 专长：General / Anxiety / Depression / Trauma / Relationship
  - Bulk Billing：Yes / No / All
- [ ] 筛选用 Compound Components 模式（`vercel-composition-patterns`）

#### 4.4 医生详情与预约（Mock）
- [ ] `app/doctor/[id].tsx`：医生详情页（照片、简介、工作时间、联系方式）
- [ ] `app/doctor/book.tsx`：预约表单（选日期、选时段、填备注）
- [ ] 提交后显示 "Booking Confirmed" 成功页面（**mock，不发请求**）
- [ ] 成功页面有动画（checkmark + confetti 或简洁的绿色勾）

**Skill 审查**：用 `vercel-react-best-practices` 审查并行请求和列表性能

---

### Phase 5：Translation 模块（1.5 天）

**目标**：文本翻译真实可用，语音翻译 mock 演示

#### 5.1 文本翻译（真实 API）
- [ ] `app/(tabs)/translate.tsx`：翻译主页，两个入口（文本 / 语音）
- [ ] `components/translate/TextTranslator.tsx`：
  - 上下两个文本区域（源语言 / 目标语言）
  - 语言选择器（中/英/法/西 + 更多常用语言）
  - 一键互换语言按钮
  - 实时翻译（debounce 300ms 后调 API）
- [ ] `lib/api/google-translate.ts`：Google Cloud Translation API 调用
- [ ] 翻译历史记录（可选，存 AsyncStorage）

#### 5.2 AI 语音翻译（Mock / Presentation）
- [ ] `app/translate/voice.tsx`：语音翻译页面
- [ ] UI 设计：
  - 中央大麦克风按钮（按住说话风格）
  - 上方显示识别文字
  - 下方显示翻译结果
  - 语言对选择（X ↔ English）
- [ ] Mock 实现方案：
  - 预设 2-3 段对话脚本（中英、法英、西英各一段）
  - 按下麦克风 → 延迟 1-2 秒 → 显示预设的"识别文字"
  - 再延迟 0.5 秒 → 显示预设的"翻译结果"
  - 配合波形动画（假的音频波形 CSS 动画）
- [ ] Premium 守卫：Free 用户看到升级提示

#### 5.3 翻译页面整合
- [ ] Tab 页面展示两个服务卡片：文本翻译（Free）、语音翻译（Premium 标记）
- [ ] Free 用户点语音翻译 → PremiumGate

**Skill 审查**：用 `frontend-design` 审查语音翻译 mock UI 的演示效果

---

### Phase 6：Credits / 会员 / Referral（1 天）

**目标**：会员体系完整可演示，充值流程走通（test mode）

#### 6.1 会员页面
- [ ] `app/membership/plans.tsx`：Free vs Premium 对比
  ```
  Free:
  - 文本翻译 ✓
  - 医生列表 ✓
  - OSHC 套餐浏览 ✓
  - OSHC 推荐 ✗
  - AI 语音翻译 ✗

  Premium:
  - 全部功能 ✓
  - OSHC 个性化推荐 ✓
  - AI 语音翻译 ✓
  - 优先客服 ✓
  ```
- [ ] 升级按钮 → 跳转充值

#### 6.2 充值页面
- [ ] `app/membership/topup.tsx`：Credit 充值包选择
- [ ] Stripe Checkout 集成（test mode）
- [ ] 充值成功后更新 Supabase credits
- [ ] 展示：几个充值档位（$5 / $15 / $30）

#### 6.3 邀请好友
- [ ] `app/membership/referral.tsx`：显示用户唯一邀请码
- [ ] 一键分享（`expo-sharing` 或 `Share` API）
- [ ] 邀请记录列表（谁通过你的码注册了）
- [ ] 新用户注册时输入邀请码 → Supabase 校验 → 双方 +50 credits

#### 6.4 Profile 页面
- [ ] `app/(tabs)/profile.tsx`：
  - 用户头像 + 名字（Clerk 数据）
  - 当前会员等级（Free / Premium）
  - Credit 余额
  - 语言切换（中/英/法/西）
  - 邀请好友入口
  - 登出按钮

---

### Phase 7：多语言 + 打磨（1 天）

**目标**：四语言翻译文件完成，整体 UI 打磨

#### 7.1 翻译文件
- [ ] `locales/en.json`：英文（基准）
- [ ] `locales/zh.json`：中文
- [ ] `locales/fr.json`：法语
- [ ] `locales/es.json`：西班牙语
- [ ] 所有硬编码文案替换为 `t('key')`

#### 7.2 UI 打磨
- [ ] 页面切换动画（Expo Router screen options）
- [ ] Loading 状态：Skeleton screens
- [ ] Empty 状态：空列表友好提示
- [ ] Error 状态：网络错误友好提示
- [ ] 整体颜色/间距一致性检查

#### 7.3 演示准备
- [ ] 确保 Expo Go 或 Development Build 可在真机运行
- [ ] 准备 mock 数据覆盖各种场景（有医生结果 / 无结果 / 翻译中 / 翻译完成）
- [ ] 语音翻译 mock 脚本排练
- [ ] 首次打开 app 的 onboarding flow（可选，1-3 屏引导页）

**Skill 审查**：用 `web-design-guidelines` 做最终全面 UI 审查

---

## 时间估算

| Phase | 内容 | 预计工作量 |
|---|---|---|
| 0 | 项目初始化 | 0.5 天 |
| 1 | Auth + 用户系统 | 1 天 |
| 2 | Home + 基础 UI | 1 天 |
| 3 | Finance / OSHC | 1.5 天 |
| 4 | Doctor | 1.5 天 |
| 5 | Translation | 1.5 天 |
| 6 | Credits / 会员 | 1 天 |
| 7 | 多语言 + 打磨 | 1 天 |
| **合计** | | **约 9 天** |

---

## 风险与降级策略

| 风险 | 降级方案 |
|---|---|
| Healthdirect API 接入困难 | 医生列表仅用 Google Places，Medicare 信息用 mock 标签 |
| DeepL API Free 配额用完 | 限制请求频率，加 debounce + 本地缓存，必要时切服务端代理 |
| Clerk Expo 集成问题 | 退而用 Supabase Auth（也支持 Google） |
| Stripe RN 集成复杂 | 充值页面用 WebView 加载 Stripe Checkout |
| NativeWind 兼容问题 | 退而用 StyleSheet + 手写样式 |
| 真机定位不准 | 开发时用模拟位置 (Melbourne CBD) |

---

## 环境变量模板

```env
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxx

# DeepL
EXPO_PUBLIC_DEEPL_API_KEY=your_deepl_api_free_key
DEEPL_API_KEY=your_deepl_api_free_key

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Healthdirect (if applicable)
HEALTHDIRECT_API_KEY=xxx
```

> `EXPO_PUBLIC_DEEPL_API_KEY` 只适合手机 Expo Go 的快速演示版本。
> web 端和生产环境应优先走 Supabase Edge Function 或其他后端代理，避免暴露 DeepL key。
