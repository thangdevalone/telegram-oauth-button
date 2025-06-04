# Telegram OAuth Button

A TypeScript library for implementing Telegram Login authentication in web applications.

## Installation

```bash
npm install telegram-oauth-button
```

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

### React Component Example

```tsx
import React from 'react';
import { TelegramLoginButton } from 'telegram-oauth-button';

function MyLoginComponent() {
  const handleAuth = (user) => {
    console.log('User authenticated:', user);
  };

  return (
    <TelegramLoginButton 
      botId="YOUR_BOT_ID"
      onAuth={handleAuth}
    >
      Log in with Telegram
    </TelegramLoginButton>
  );
}
```

### Custom Button Component

You can use any component as the button by using the `as` prop:

```tsx
import React from 'react';
import { TelegramLoginButton } from 'telegram-oauth-button';
import { Button } from '@your-ui-library/components';

function CustomButtonExample() {
  const handleAuth = (user) => {
    console.log('User authenticated:', user);
  };

  // Using a custom button component
  return (
    <TelegramLoginButton 
      botId="YOUR_BOT_ID"
      onAuth={handleAuth}
      as={Button}
      buttonProps={{ 
        variant: 'primary',
        size: 'large',
        startIcon: <TelegramIcon />
      }}
    >
      Sign in with Telegram
    </TelegramLoginButton>
  );
}
```

### Using with Next.js Link

```tsx
import React from 'react';
import Link from 'next/link';
import { TelegramLoginButton } from 'telegram-oauth-button';

function NextLinkExample() {
  const handleAuth = (user) => {
    console.log('User authenticated:', user);
  };

  return (
    <TelegramLoginButton 
      botId="YOUR_BOT_ID"
      onAuth={handleAuth}
      as={Link}
      buttonProps={{ 
        href: '#',
        style: { display: 'inline-block', padding: '10px 20px' }
      }}
    >
      Connect with Telegram
    </TelegramLoginButton>
  );
}
```

## User Data

The `TelegramUser` object contains the following properties:

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

```javascript
const crypto = require('crypto');

function validateTelegramAuth(telegramUser, botToken) {
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