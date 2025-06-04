export interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

export interface TelegramOauthLoginParams {
  botId: string;
  params: {
    lang?: string;
    origin: string;
  };
  callback: (data: TelegramUser) => Promise<void> | void;
}

export class TelegramOauthLogin {
  protected botId: string = '';
  protected params: { lang?: string, origin: string };
  protected paramsEncoded: string = '';
  private lang: string | undefined = '';
  private activePopup: Window | null = null;
  private authFinished: boolean = false;
  private callback: (data: TelegramUser) => Promise<void> | void;

  constructor({ botId, params, callback }: TelegramOauthLoginParams) {
    this.botId = botId || '';
    this.params = params;
    this.paramsEncoded = this.encodeParams(this.params);
    this.callback = callback;
  }

  /**
   * Opens a popup window for Telegram OAuth authentication
   */
  public auth() {
    const width = 600;
    const height = 700;
    const left = Math.max(0, (screen.width - width) / 2) + (screenLeft | 0);
    const top = Math.max(0, (screen.height - height) / 2) + (screenTop | 0);

    const checkClose = () => {
      if (!this.activePopup || this.activePopup.closed) {
        return this.onClose();
      }
      setTimeout(checkClose, 100);
    };

    this.activePopup = window.open(
      `https://oauth.telegram.org/auth?bot_id=${this.botId}${this.paramsEncoded ? '&' + this.paramsEncoded : ''}`,
      'telegram_oauth',
      `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`
    );

    this.authFinished = true;
    if (this.activePopup) {
      this.activePopup.focus();
      checkClose();
    }
  }

  /**
   * Gets authentication data from Telegram
   * @param init Whether this is the initial auth request
   */
  public async getAuth(init: boolean) {
    try {
      const response = await fetch(`https://oauth.telegram.org/auth/get?bot_id=${this.botId}` +
        (this.lang ? `&lang=${encodeURIComponent(this.lang)}` : ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: this.paramsEncoded,
        credentials: 'include'
      });
      if (!response.ok) {
        this.onAuth('*', false, init);
        return;
      }

      const result = await response.json();
      if (result.user) {
        await this.callback(result.user);
      }
      if (result.user) {
        this.onAuth(result.origin, result.user, init);
      } else {
        this.onAuth(result.origin, false, init);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      this.onAuth('*', false, init);
    }
  }

  /**
   * Handles authentication result
   * @param origin The origin of the auth request
   * @param authData The authentication data
   * @param init Whether this is the initial auth request
   */
  private onAuth(origin: string, authData: any, init: boolean) {
    if (this.authFinished) return;

    let data: any;
    if (authData) {
      data = { event: 'auth_user', auth_data: authData };
    } else {
      data = { event: 'unauthorized' };
    }

    if (init) {
      data.init = true;
    }

    this.authFinished = true;
  }

  /**
   * Handles popup close event
   */
  private onClose() {
    this.getAuth(false);
  }

  /**
   * Encodes parameters for URL
   * @param params The parameters to encode
   * @returns Encoded parameters string
   */
  private encodeParams(params: any): string {
    const paramsArr: string[] = [];
    for (const key in params) {
      if (params[key]) {
        paramsArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    }
    return paramsArr.join('&');
  }
} 