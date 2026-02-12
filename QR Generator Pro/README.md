# QR Generator Pro | Elite Card Suite 💎

## 🔗 [LIVE PROJECT LINK](https://front-end-projects-qr-generator-pro.vercel.app/)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-10b981.svg?style=for-the-badge)](https://github.com/anweshathapa)

## 🖥️ Project Preview
![Application Screenshot](./qr-generator-screenshot.png)

A professional-grade, high-performance QR code utility designed for UI/UX precision. This tool utilizes a sophisticated **Single-Surface Card Architecture**, providing a focused and tactile experience for generating high-resolution digital assets.

---

## 🚀 Architectural Overview

Unlike complex multi-page applications, **QR Generator Pro** focuses on a streamlined, **centered workspace**:
* **Integrated Control Hub**: Input fields, 3D typography, and custom settings are housed in a premium charcoal card.
* **Dynamic Preview Stage**: The generation area is embedded directly into the UI flow, utilizing a "Midnight Shimmer" transition to reveal the final asset.

## 🌟 Key Features

* **3D Metallic Engine**: Advanced CSS `linear-gradient` and `drop-shadow` filters create a physical, tactile heading and a mechanical "Matte-Press" button system for satisfying user feedback.
* **Variable Resolution**: Generate assets from **100px** to **400px** to suit different digital and print requirements.
* **Midnight Shimmer State**: A sophisticated "Beautiful Black" skeleton loader provides professional feedback during the encoding process, preventing UI flicker.
* **Persistence Layer**: Integrated `localStorage` engine that allows users to instantly retrieve and re-generate their last 5 assets from the "Recent Activity" log.
* **Mobile-First Precision**: A fully responsive layout that uses CSS Grid and Flexbox to ensure a premium experience on any screen size.

## 🛠️ Technical Implementation

### UI/UX Design
* **Typography**: *Outfit* (Geometric Sans-Serif) tightened with negative letter-spacing for a premium brand feel.
* **Interactions**: Uses `cubic-bezier(0.4, 0, 0.2, 1)` transitions to create organic, smooth movements.
* **Micro-copy**: Terms like "Asset Generation" and "Resolution" are used to maintain a professional software persona.

### Technology Stack
* **Logic**: JavaScript (ES6+) for History management and UI state control.
* **Styles**: Custom CSS3 Variables and Responsive Grid logic.
* **QR Core**: [QRCode.js](https://davidshimjs.github.io/qrcodejs/) for high-speed client-side encoding.

### 💡 Technical Note: Client-Side Encoding
By utilizing `QRCode.js`, this application performs all data encoding directly in the user's browser.
* **Privacy**: Data never leaves the client’s machine.
* **Speed**: Zero server latency for asset generation.
* **Efficiency**: Reduces server load by offloading computation to the client.



## 📂 Repository Structure

```text
QR-Generator-Pro/
├── index.html       # Semantic Card Structure & Version Badge
├── style.css        # 3D Metallic Styles, Gradients & Shimmer Shaders
└── script.js        # History Logic, Toast Manager & QR Rendering
