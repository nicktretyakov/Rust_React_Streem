# RTTDS: Real-Time Threat Detection System

A full-stack, cross-language platform for real-time video threat detection, featuring:

- **Rust Backend**: Actix-web server handling WebSocket video streams and HTTP analysis requests.
- **Python ML Service**: FastAPI microservice performing object detection and threat classification (mocked YOLOv8).
- **Next.js Frontend**: React UI with live video streaming, dashboards, alerts, and settings panels.
- **WebAssembly Module**: Rust-generated utilities (`fibonacci`, `is_prime`, `Point`) demonstrating wasm integration.
- **Extensible Architecture**: Docker-friendly, environment-driven configuration, modular codebase.

---

## Table of Contents
1. [Architecture](#architecture)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Services](#running-the-services)
   - [ML Service](#ml-service)
   - [Backend Server](#backend-server)
   - [Frontend App](#frontend-app)
7. [Usage](#usage)
8. [Code Structure](#code-structure)
9. [Environment Variables](#environment-variables)
10. [Component Overview](#component-overview)
11. [Development](#development)
12. [Contributing](#contributing)
13. [License](#license)

---

## Architecture

```text
[Camera] → WebAssembly pre-processing → WebSocket → Rust Backend → Python ML Service → Rust Backend → WebSocket → Frontend UI
                                  ↓
                           HTTP /analyze endpoint
```

- **VideoStream Component** captures camera frames, processes via wasm, and streams payloads over WebSocket.
- **Rust Backend** aggregates, forwards frames to ML service, and broadcasts detection results to clients.
- **Python ML Service** simulates YOLOv8 inference and returns structured detection JSON.
- **Frontend** displays live stream, bounding boxes, threat alerts, dashboards, and settings.

## Features

- 🖥️ **Live Video Streaming** with bounding box overlays.
- 🤖 **Threat Detection** via object classification (mocked ML).
- 📊 **Dashboard & Alerts** for historical and real-time threat insights.
- 🛠️ **Settings Panel** for runtime configuration.
- 🕸️ **WebAssembly Integration** for high-performance pre-processing.
- 🔁 **WebSocket & HTTP APIs** for flexible integration.

## Prerequisites

- **Rust** (->1.60) and Cargo
- **Node.js** (>=16) and pnpm/npm
- **Python 3.8+**
- **PostgreSQL** instance (for backend) or set `DATABASE_URL`
- **Optional**: Docker for containerization

## Installation

```bash
# Clone the repo
git clone https://github.com/nicktretyakov/Rust_React_Streem.git
cd Rust_React_Streem

# Install Python deps (in ml_service)
cd ml_service
pip install fastapi uvicorn torch numpy opencv-python pillow pydantic
cd ..

# Install frontend deps
cd app
pnpm install    # or npm install
cd ..

# Build Rust components
cargo build --release
```

## Configuration

Copy `.env.example` into the root or each service folder and adjust:

| Variable              | Description                            | Default                     |
|-----------------------|----------------------------------------|-----------------------------|
| `DATABASE_URL`        | PostgreSQL connection string           | _required_                  |
| `ML_SERVICE_URL`      | URL of FastAPI detection service       | `http://localhost:8000/detect` |
| `NEXT_PUBLIC_WS_URL`  | WebSocket endpoint for frontend        | `ws://localhost:8080/ws`    |
| `NEXT_PUBLIC_API_URL` | HTTP analysis endpoint for frontend    | `http://localhost:8080/analyze` |

## Running the Services

### ML Service
```bash
cd ml_service
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Backend Server
```bash
# Ensure DATABASE_URL and ML_SERVICE_URL are set
cargo run --bin backend --release
```

### Frontend App
```bash
cd app
pnpm dev          # starts Next.js on http://localhost:3000
```

## Usage

1. Navigate to `http://localhost:3000`.
2. Grant camera access; click **Start Camera**.
3. Observe live detections; threat alerts will appear on detection.
4. Switch to **Dashboard** or **Alerts** tabs for analytics.

## Code Structure

```
├── backend/           # Rust Actix-web server
│   └── src/main.rs    # WebSocket & HTTP handlers
├── ml_service/        # Python FastAPI threat detection
│   └── main.py        # Mock YOLOv8 inference
├── app/               # Next.js React frontend
│   ├── page.tsx       # Main layout & tabs
│   ├── globals.css    # Tailwind styles
│   └── layout.tsx     # Root layout
├── components/        # Shared UI components
│   ├── video-stream.tsx
│   ├── threat-dashboard.tsx
│   └── alerts-panel.tsx
├── hooks/             # Custom React hooks
├── lib/               # Utility modules (e.g., wasm processing, clsx)
├── wasm/              # Rust → WASM bindings (src/lib.rs)
└── package.json       # Frontend metadata
```

## Environment Variables

Services read from `.env` or system environment. Ensure values are consistent across services.

## Component Overview

- **VideoStream**: captures, processes, and streams frames.
- **ThreatDashboard**: renders charts and metrics.
- **AlertsPanel**: lists recent detections.
- **SettingsPanel**: runtime configuration toggles.
- **WebAssembly (lib.rs)**: exposes `fibonacci`, `is_prime`, `Point` to JS.

## Development

- **Testing**: use `cargo test`, `pytest` (if ML service added tests), and React testing frameworks.
- **Linting**: run `cargo fmt`, `eslint`, and `prettier` on respective code.
- **Docker**: add `Dockerfile` per service for container builds.

## Contributing

Contributions are welcome! Please open issues or PRs, follow Rust 2021, React v18+, and include tests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

