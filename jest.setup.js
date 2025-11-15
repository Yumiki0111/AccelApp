// Jestのセットアップファイル
// テスト環境の初期化処理を記述

// 環境変数の設定
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://accelapp_user:accelapp_password@localhost:5432/accelapp_db?schema=public';
process.env.NODE_ENV = 'test';

// グローバルなモックやユーティリティを設定
global.console = {
  ...console,
  // テスト中はconsole.logを抑制（必要に応じて）
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

