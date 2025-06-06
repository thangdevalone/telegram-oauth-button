# Telegram OAuth Button

A TypeScript library for implementing Telegram Login authentication in web applications.

## Installation

```bash
npm install telegram-oauth-button
```

## Features

- TypeScript support with full type definitions
- React component for easy integration
- Customizable button with `asChild` pattern
- Support for server-side validation

## Usage

### Basic Implementation

```typescript
import { TelegramOauthLogin, TelegramUser } from 'telegram-oauth-button';

// Initialize the Telegram OAuth login
const telegramLogin = new TelegramOauthLogin({
  botId: 'YOUR_BOT_ID', // Get this from @BotFather
  params: {
    origin: window.location.origin, // Your website origin
    lang: 'en' // Optional: preferred language
  },
  callback: (user: TelegramUser) => {
    // Handle successful authentication
    console.log('Authenticated user:', user);
    
    // Example: Send the user data to your backend
    // fetch('/api/auth/telegram', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(user)
    // });
  }
});

// Trigger authentication when user clicks a button
document.getElementById('telegram-login-button')?.addEventListener('click', () => {
  telegramLogin.auth();
});
```

### React Component

The library provides a React component that simplifies integration:

```tsx
import React from 'react';
import { TelegramLoginButton, TelegramUser } from 'telegram-oauth-button';

const MyLoginComponent: React.FC = () => {
  const handleAuth = (user: TelegramUser) => {
    console.log('User authenticated:', user);
    // Process user data
  };

  return (
    <TelegramLoginButton 
      botId="YOUR_BOT_ID"
      onAuth={handleAuth}
      className="telegram-login-btn"
    >
      Log in with Telegram
    </TelegramLoginButton>
  );
};

export default MyLoginComponent;
```

### Customizing with `asChild` Pattern

The `asChild` pattern allows you to use your own custom button or component while still receiving the Telegram authentication functionality:

```tsx
import React from 'react';
import { TelegramLoginButton, TelegramUser } from 'telegram-oauth-button';
import { Button } from '@your-ui-library/components';

const CustomButtonExample: React.FC = () => {
  const handleAuth = (user: TelegramUser) => {
    console.log('User authenticated:', user);
  };

  return (
    <TelegramLoginButton 
      botId="YOUR_BOT_ID"
      onAuth={handleAuth}
      asChild
    >
      <Button 
        variant="primary" 
        size="large"
        startIcon={<TelegramIcon />}
        className="custom-telegram-btn"
      >
        Sign in with Telegram
      </Button>
    </TelegramLoginButton>
  );
};
```

The `asChild` prop tells the component to pass the authentication handler to the child component instead of wrapping it. This gives you full control over the UI while retaining the authentication functionality.

### Using with Next.js Link

```tsx
import React from 'react';
import Link from 'next/link';
import { TelegramLoginButton, TelegramUser } from 'telegram-oauth-button';

const NextLinkExample: React.FC = () => {
  const handleAuth = (user: TelegramUser) => {
    console.log('User authenticated:', user);
  };

  return (
    <TelegramLoginButton 
      botId="YOUR_BOT_ID"
      onAuth={handleAuth}
      asChild
    >
      <Link 
        href="#"
        className="telegram-link"
        style={{ display: 'inline-block', padding: '10px 20px' }}
      >
        Connect with Telegram
      </Link>
    </TelegramLoginButton>
  );
};
```

## API Reference

### TelegramOauthLogin

```typescript
new TelegramOauthLogin({
  botId: string;
  params: {
    lang?: string;
    origin: string;
  };
  callback: (data: TelegramUser) => Promise<void> | void;
})
```

#### Methods

- `auth()`: Opens the Telegram OAuth popup

### TelegramLoginButton Props

```typescript
interface TelegramLoginButtonProps {
  // Bot ID obtained from BotFather
  botId: string;
  
  // Callback function called with user data after successful authentication
  onAuth: (user: TelegramUser) => void;
  
  // Button text or children elements
  children?: ReactNode;
  
  // CSS class name for styling the button
  className?: string;
  
  // Language code for the Telegram login widget
  lang?: string;

  // If true, passes onClick handler to child element instead of wrapping
  asChild?: boolean;
  
  // Additional props for the button (only used when asChild is false)
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}
```

### TelegramUser Type

```typescript
interface TelegramUser {
  id: number;         // Telegram user ID
  first_name: string; // User's first name
  last_name: string;  // User's last name
  username: string;   // User's Telegram username
  photo_url: string;  // URL of the user's profile photo
  auth_date: number;  // Authentication date (Unix time)
  hash: string;       // Authentication hash
}
```

## Security Considerations

For security reasons, you should validate the authentication data on your server before trusting it. The hash should be verified using your bot token.

### Server-side Validation Example (Node.js)

```typescript
import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
  [key: string]: any;
}

function validateTelegramAuth(telegramUser: TelegramUser, botToken: string): boolean {
  const { hash, ...userData } = telegramUser;
  
  // Sort keys alphabetically
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key]}`)
    .join('\n');
  
  // Create a secret key from your bot token
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();
  
  // Calculate the hash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  // Compare the calculated hash with the provided hash
  return calculatedHash === hash;
}
```

## License

MIT 