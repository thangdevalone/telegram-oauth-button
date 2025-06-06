import React, { useCallback, ReactNode, ElementType, ComponentPropsWithoutRef, Children, cloneElement, isValidElement } from 'react';
import { TelegramOauthLogin, TelegramUser } from './TelegramOauthLogin';

export interface TelegramLoginButtonProps {
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
   * If true, will not render a button but instead clone the child element
   * and pass the onClick handler to it.
   * @default false
   */
  asChild?: boolean;
  
  /**
   * Additional props to pass to the button component
   * Only used when asChild is false
   */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * A React component that renders a button for Telegram OAuth authentication
 * Can be customized by passing a child element with asChild=true
 */
export function TelegramLoginButton({
  botId,
  onAuth,
  children = 'Log in with Telegram',
  className = '',
  buttonProps = {},
  lang,
  asChild = false,
}: TelegramLoginButtonProps) {
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

  // If asChild is true, clone the child element and pass the onClick handler
  if (asChild) {
    const child = Children.only(children);
    
    if (isValidElement(child)) {
      return cloneElement(child, {
        // Type assertion to handle any type of element
        onClick: (e: React.MouseEvent) => {
          // Call the original onClick if it exists
          if (typeof child.props.onClick === 'function') {
            child.props.onClick(e);
          }
          handleLogin();
        }
      } as React.HTMLAttributes<HTMLElement>);
    }
    
    console.warn('TelegramLoginButton: asChild is true but no valid child element was provided');
    return null;
  }

  // Default rendering as a button
  return (
    <button 
      type="button"
      onClick={handleLogin}
      className={className}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export default TelegramLoginButton; 