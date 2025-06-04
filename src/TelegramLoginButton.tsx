import React, { useCallback, ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import { TelegramOauthLogin, TelegramUser } from './TelegramOauthLogin';

export interface TelegramLoginButtonProps<T extends ElementType = 'button'> {
  /**
   * Bot ID obtained from BotFather
   */
  botId: string;
  
  /**
   * Callback function that will be called with the user data after successful authentication
   */
  onAuth: (user: TelegramUser) => void;
  
  /**
   * Button text or children elements
   * @default "Log in with Telegram"
   */
  children?: ReactNode;
  
  /**
   * CSS class name for styling the button
   */
  className?: string;
  
  /**
   * Language code for the Telegram login widget
   */
  lang?: string;

  /**
   * Custom component to use instead of the default button
   * @default "button"
   */
  as?: T;
  
  /**
   * Additional props to pass to the button component
   */
  buttonProps?: ComponentPropsWithoutRef<T>;
}

/**
 * A React component that renders a button for Telegram OAuth authentication
 * Can be customized with any component using the 'as' prop
 */
export function TelegramLoginButton<T extends ElementType = 'button'>({
  botId,
  onAuth,
  children = 'Log in with Telegram',
  className = '',
  buttonProps = {} as ComponentPropsWithoutRef<T>,
  lang,
  as,
}: TelegramLoginButtonProps<T>) {
  const Component: ElementType = as || 'button';
  
  const handleLogin = useCallback(() => {
    const telegramLogin = new TelegramOauthLogin({
      botId,
      params: {
        origin: window.location.origin,
        ...(lang ? { lang } : {}),
      },
      callback: onAuth,
    });
    
    telegramLogin.auth();
  }, [botId, onAuth, lang]);

  return React.createElement(
    Component,
    {
      onClick: handleLogin,
      className,
      ...(Component === 'button' ? { type: 'button' } : {}),
      ...buttonProps
    },
    children
  );
}

export default TelegramLoginButton; 