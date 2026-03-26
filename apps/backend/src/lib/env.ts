const REQUIRED = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

const OPTIONAL_WITH_DEFAULTS: Record<string, string> = {
  REDIS_URL:           'redis://localhost:6379',
  PORT:                '4000',
  NODE_ENV:            'development',
  JWT_ACCESS_EXPIRES:  '15m',
  JWT_REFRESH_EXPIRES: '30d',
  FRONTEND_URL:        'http://localhost:5173',
};

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    console.error('\n❌  Missing required environment variables:\n');
    for (const key of missing) {
      console.error(`   • ${key}`);
    }
    console.error('\n   Copy .env.example → .env and fill in the values.\n');
    process.exit(1);
  }

  // Apply defaults for optional vars
  for (const [key, defaultVal] of Object.entries(OPTIONAL_WITH_DEFAULTS)) {
    if (!process.env[key]) {
      process.env[key] = defaultVal;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Environment validated');
    console.log(`   NODE_ENV:     ${process.env.NODE_ENV}`);
    console.log(`   PORT:         ${process.env.PORT}`);
    console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  }
}
