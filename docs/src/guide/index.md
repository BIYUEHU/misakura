# Description

> [!WARNING]
> The project and its documentation are still under development.

<!--markdownlint-disable-file MD033-->

<script setup>
  import NpmBadge from '../components/NpmBadge.vue';
</script>

<NpmBadge package="misakura" />

## Preface

> 「ゲームの中の美少女を見ると元気が出るわ。（我看到可爱的女孩子就会精神振奋，）
> <br>でも、ゲームの中の女の子は可愛いだけじゃないの。（不过，游戏里的女孩子可不是仅仅只有可爱而已，）
> <br>彼女たちは泣いたり、笑ったり、悩んだりするわ。（她们会哭，会笑，也会烦恼，）
> <br>ゲームの中の女の子こそが最も輝いているのよ！」（游戏中的女孩子是最为耀眼的！）
> <br>——『12Bit の感動』

当文字、音乐、图像巧妙结合，便孕育出**视觉小说**（Visual Novel） / **美少女游戏**（Galgame）这一独特载体。每部作品都是一个故事，无论是看似平凡的枯燥日常，还是足以动人心弦、铭记一生的催泪情景，都能让玩家与角色同喜同悲。这里有太多美好邂逅、感动回忆和悲欢离合，玩家得以与这些美少女们一同亲历并见证。

可当故事画上句号，游戏中的角色们各自获得幸福，而回归现实的玩家，或写感言、或循环播放音乐、或强烈表达，以各种方式回味故事中的美好与感动。经历多次意犹未尽，体验过众多故事后，便自然而然地萌生出自行制作游戏的想法。期盼着有人能因自己作品中的美少女们而感动落泪，于是开始为游戏创作剧本、编制曲目、绘制插画，渴望从不同角度以自己的方式为游戏贡献一份力量。

正是对作品的热爱，驱使人创造出自己的作品，让自己融入所热爱的世界，为这份热爱增添自己的贡献。而对于一个文案写不好、编曲一无所知、美术一窍不通的程序员而言，创造一个供他人更好创作的基石恰恰成为最佳选择。于是，**Misakura** 应运而生。

## Introduction

> - LOGO 设计灵感来源于 [神奈川沖浪裏](https://ja.wikipedia.org/wiki/%E5%AF%8C%E5%B6%BD%E4%B8%89%E5%8D%81%E5%85%AD%E6%99%AF)

**Misakura**（别名：**AvgJS**）是一款基于 SolidJS、PIXIJS、Tauri 与 TypeScript 开发的开源视觉小说/美少女游戏制作引擎。它致力于为用户提供一个简单、易用、功能丰富的编辑环境与游戏框架，让用户能够轻松制作出一个独属于自己的作品。

### Features

- **高性能**
  前端底层使用基于真实 DOM 操作的 SolidJS 框架，桌面端使用基于 Rust 开发的 Tauri 框架，保证了高性能与流畅的渲染效果

- **多平台**
  同时支持原生 Web 应用、桌面应用、移动应用等多个平台

- **可扩展**
  既支持自定义脚本文件（.mrs），也支持引用 Ts/Js 文件实现各种复杂逻辑有，以及高定制度的 JsonUI

- **自适应**
  由伟大的 [@jzwsbdem](https://github.com/jzwsbdem) 提出的 [Aspect Scaler](./aspect) 构想，用于不同分辨率下的最优自动适配屏幕方案

SolidJS 从根本实现上便碾压一众基于 Vue / React 框架的视觉小说引擎，而 Tauri 从性能与打包大小上双重碾压肮脏的 Electron 等框架。

## Declaration

1. We only welcome to **Japanese** visual novels and galgame, don't accept any non-Japanese visual novels maker or producer in this project and especially the Zhinese .
2. **japanese visual novels maker and producer** don't represent you must be a Japanese person, but represent you can only create and make japanese visual novels and galgame. Nobody likes to see ugly someone (Zhinaman) make the visual novels base on elements of his country and said "国 GAL 崛起 (Zhinese visual novels are rising)". That behaviors must be rejected because it makes people feel uncomfortable and disgusting, and orthodox Japanese culture must be respected.
