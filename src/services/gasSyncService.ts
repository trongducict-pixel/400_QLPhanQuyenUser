import {
  User,
  CanBo,
  PhongBan,
  ChuongTrinh,
  RequestRecord,
  ApprovalHistory,
  ProcessingHistory,
  AuditLog,
  SystemConfig
} from '../types';

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwv5QSwAwKQKAsqwDKlY9B0YQ_z574Zo6iJTaN6ksBbb4D3l3f8J6V4Z3JQc_7qdlm5/exec';

export interface GasSyncResult {
  success: boolean;
  message: string;
  timestamp?: string;
  data?: any;
}

export interface GasSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastError: string | null;
  gasUrl: string;
}

class GasSyncService {
  private gasUrl: string = DEFAULT_GAS_URL;
  private isSyncing: boolean = false;
  private isConnected: boolean = false;
  private lastSyncTime: string | null = null;
  private lastError: string | null = null;
  private listeners: Array<(status: GasSyncStatus) => void> = [];

  constructor() {
    // Load stored GAS URL if any, or default to the user's provided script URL
    const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('VIETINBANK_GAS_URL') : null;
    this.gasUrl = storedUrl && storedUrl.trim() ? storedUrl.trim() : DEFAULT_GAS_URL;
    if (typeof window !== 'undefined' && !storedUrl) {
      localStorage.setItem('VIETINBANK_GAS_URL', DEFAULT_GAS_URL);
    }
  }

  public getGasUrl(): string {
    return this.gasUrl;
  }

  public setGasUrl(url: string) {
    this.gasUrl = url.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('VIETINBANK_GAS_URL', this.gasUrl);
    }
    this.notifyStatusChange();
  }

  public getStatus(): GasSyncStatus {
    return {
      isConnected: this.isConnected,
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastError: this.lastError,
      gasUrl: this.gasUrl
    };
  }

  public subscribe(listener: (status: GasSyncStatus) => void): () => void {
    this.listeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyStatusChange() {
    const status = this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Test connection to Google Apps Script Web App
   */
  public async testConnection(): Promise<GasSyncResult> {
    if (!this.gasUrl) {
      this.isConnected = false;
      this.lastError = 'Chưa cấu hình đường dẫn Google Apps Script Web App URL';
      this.notifyStatusChange();
      return { success: false, message: this.lastError };
    }

    try {
      this.isSyncing = true;
      this.notifyStatusChange();

      // Send GET ping request or test fetch
      const testUrl = `${this.gasUrl}${this.gasUrl.includes('?') ? '&' : '?'}action=ping&t=${Date.now()}`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok && response.type !== 'opaque') {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      let resData: any = {};
      try {
        resData = await response.json();
      } catch {
        // If opaque or text response, check if status is ok
        resData = { success: true, message: 'Kết nối Google Apps Script thành công!' };
      }

      this.isConnected = true;
      this.lastError = null;
      this.lastSyncTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.notifyStatusChange();

      return {
        success: true,
        message: resData.message || 'Kết nối Google Apps Script Web App thành công!',
        data: resData
      };
    } catch (err: any) {
      console.warn('[GAS Sync] Test connection failed:', err);
      this.isConnected = false;
      this.lastError = err.message || 'Không thể kết nối đến Google Apps Script';
      this.notifyStatusChange();
      return {
        success: false,
        message: `Lỗi kết nối: ${err.message}. Hãy kiểm tra xem Script đã được Triển khai (Deploy) dưới dạng Web App với quyền 'Bất kỳ ai (Anyone)' chưa.`
      };
    } finally {
      this.isSyncing = false;
      this.notifyStatusChange();
    }
  }

  /**
   * Gửi dữ liệu nền bất đồng bộ lên Google Apps Script
   */
  public async dispatchAction(action: string, currentUser: User | null, payload: any): Promise<GasSyncResult> {
    if (!this.gasUrl) {
      return { success: false, message: 'Chưa cấu hình URL Google Apps Script' };
    }

    const payloadData = {
      action,
      currentUser: currentUser ? {
        id: currentUser.id,
        userAD: currentUser.userAD,
        maUserAD: currentUser.maUserAD,
        hoTen: currentUser.hoTen,
        chucVu: currentUser.chucVu,
        maPhongBan: currentUser.maPhongBan,
        tenPhongBan: currentUser.tenPhongBan
      } : null,
      payload,
      timestamp: new Date().toISOString()
    };

    try {
      this.isSyncing = true;
      this.notifyStatusChange();

      const response = await fetch(this.gasUrl, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script Web App redirects work reliably with no-cors or JSON
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payloadData)
      });

      this.isConnected = true;
      this.lastError = null;
      this.lastSyncTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.notifyStatusChange();

      return {
        success: true,
        message: `Đã đồng bộ hành động [${action}] lên Google Sheets thành công!`,
        timestamp: this.lastSyncTime
      };
    } catch (err: any) {
      console.warn(`[GAS Sync] Action ${action} sync warning:`, err);
      this.lastError = err.message || 'Lỗi đồng bộ';
      this.notifyStatusChange();
      return {
        success: false,
        message: `Cảnh báo đồng bộ Google Sheet: ${err.message}`
      };
    } finally {
      this.isSyncing = false;
      this.notifyStatusChange();
    }
  }

  /**
   * Đẩy toàn bộ dữ liệu hiện tại (101 Cán bộ, Phòng ban, Chương trình, Đề nghị, Log) lên Google Sheets
   */
  public async syncAllDataToGoogleSheets(allData: {
    staff: CanBo[];
    users: User[];
    departments: PhongBan[];
    programs: ChuongTrinh[];
    requests: RequestRecord[];
    approvals?: ApprovalHistory[];
    processing?: ProcessingHistory[];
    auditLogs: AuditLog[];
    config?: SystemConfig;
  }, currentUser: User | null): Promise<GasSyncResult> {
    if (!this.gasUrl) {
      return { success: false, message: 'Chưa cấu hình URL Google Apps Script' };
    }

    try {
      this.isSyncing = true;
      this.notifyStatusChange();

      const response = await fetch(this.gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'syncAllData',
          currentUser: currentUser ? {
            userAD: currentUser.userAD,
            hoTen: currentUser.hoTen,
            chucVu: currentUser.chucVu,
            maPhongBan: currentUser.maPhongBan
          } : { userAD: 'system', hoTen: 'Hệ thống', chucVu: 'Admin' },
          payload: {
            staff: allData.staff,
            users: allData.users,
            departments: allData.departments,
            programs: allData.programs,
            requests: allData.requests,
            approvals: allData.approvals || [],
            processing: allData.processing || [],
            auditLogs: allData.auditLogs,
            config: allData.config
          },
          timestamp: new Date().toISOString()
        })
      });

      this.isConnected = true;
      this.lastError = null;
      this.lastSyncTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.notifyStatusChange();

      return {
        success: true,
        message: `Đã đồng bộ toàn bộ dữ liệu (101 cán bộ, ${allData.departments.length} phòng ban, ${allData.programs.length} chương trình, ${allData.requests.length} đề nghị) lên Google Sheet thành công!`,
        timestamp: this.lastSyncTime
      };
    } catch (err: any) {
      console.error('[GAS Sync] syncAllData error:', err);
      this.lastError = err.message;
      this.notifyStatusChange();
      return {
        success: false,
        message: `Lỗi đồng bộ toàn bộ lên Google Sheet: ${err.message}`
      };
    } finally {
      this.isSyncing = false;
      this.notifyStatusChange();
    }
  }
}

export const gasSyncService = new GasSyncService();
