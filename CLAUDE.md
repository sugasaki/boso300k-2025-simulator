# CLAUDE.md - Guidelines for Coedo-Ooedo 2025 Simulator

## Project Overview
房総半島300K2025のレース進行をシミュレートする可視化ツールです。ランナー位置を地図上にリアルタイムで表示し、レース進行を時系列で確認できます。

### 主な機能
- 複数コース対応（200km/230km/260km/90km/115km）
- ランナー位置のアニメーション表示
- タイムラインによるレース進行確認
- カテゴリ別フィルタリング
- ランナー検索・フォーカス機能

### 技術スタック
- React + TypeScript
- deck.gl + MapLibre GL
- Zustand（状態管理）
- Tailwind CSS
- Vite（ビルドツール）
- Vitest（テスト）

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm test` - Run all tests
- `pnpm test src/utils/__tests__/timeUtils.test.ts` - Run a specific test file
- `pnpm test -t "test name pattern"` - Run tests matching a specific pattern

## Code Style Guidelines
- **TypeScript**: Use strict mode with proper type annotations
- **Imports**: Group imports by: external libraries, then internal modules
- **Components**: React functional components with explicit return types
- **Error Handling**: Try/catch blocks with error logging and re-throwing
- **State Management**: Use Zustand for global state
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Comments**: JSDoc style for functions and complex logic
- **File Structure**: Group related functionality in dedicated folders
- **React Hooks**: Follow rules of hooks, use custom hooks for shared logic
- **Testing**: Use Vitest with describe/it pattern, mock data as needed