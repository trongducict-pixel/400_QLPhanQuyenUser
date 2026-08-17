import React, { useState, useEffect } from 'react';
import { generateGASBackendCode } from '../services/gasScriptGenerator';
import { gasSyncService, GasSyncStatus, DEFAULT_GAS_URL } from '../services/gasSyncService';
import { api } from '../services/api';
import {
  Code2,
  Copy,
  Check,
  Table,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Settings,
  Mail,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Send,
  Database,
  Users
} from 'lucide-react';

export const GASGuideView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [gasUrl, setGasUrl] = useState(gasSyncService.getGasUrl());
  const [savedUrl, setSavedUrl] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<GasSyncStatus>(gasSyncService.getStatus());

  const gasCode = generateGASBackendCode();

  useEffect(() => {
    const unsubscribe = gasSyncService.subscribe((status) => {
      setSyncStatus(status);
      setGasUrl(status.gasUrl);
    });
    return () => unsubscribe();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(gasCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveGasUrl = (e: React.FormEvent) => {
    e.preventDefault();
    gasSyncService.setGasUrl(gasUrl.trim());
    setSavedUrl(true);
    setTimeout(() => setSavedUrl(false), 2500);
  };

  const handleResetDefaultUrl = () => {
    setGasUrl(DEFAULT_GAS_URL);
    gasSyncService.setGasUrl(DEFAULT_GAS_URL);
    setSavedUrl(true);
    setTimeout(() => setSavedUrl(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await gasSyncService.testConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Lỗi kiểm tra kết nối' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncAllData = async () => {
    setIsSyncingAll(true);
    setSyncResult(null);
    try {
      const res = await api.syncAllToGoogleSheets();
      setSyncResult(res);
    } catch (err: any) {
      setSyncResult({ success: false, message: err.message || 'Lỗi đồng bộ dữ liệu' });
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-[#004F9E]" />
            <h2 className="text-lg font-bold text-gray-900">
              Đồng Bộ Dữ Liệu Google Sheets & Google Apps Script
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Hệ thống tự động lưu và cập nhật liên tục mọi thay đổi (đề nghị, duyệt, phân quyền, 101 cán bộ, audit log) vào Google Sheet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncAllData}
            disabled={isSyncingAll}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Đang đồng bộ...' : 'Đồng bộ toàn bộ lên Sheet ngay'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 bg-[#004F9E] hover:bg-[#003B77] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép Code.gs!' : 'Sao chép toàn bộ mã Code.gs'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Database className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">Đường dẫn Google Apps Script Web App</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Tự động đồng bộ liên tục
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-mono mt-0.5 break-all">
                {gasUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-auto">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition border border-white/20 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
              testResult.success
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold">{testResult.success ? 'Thành công: ' : 'Cảnh báo: '}</span>
              {testResult.message}
            </div>
          </div>
        )}

        {/* Sync All Result Message */}
        {syncResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
              syncResult.success
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}
          >
            {syncResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold">{syncResult.success ? 'Đồng bộ thành công: ' : 'Lỗi đồng bộ: '}</span>
              {syncResult.message}
            </div>
          </div>
        )}
      </div>

      {/* URL Config Form */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#004F9E]" />
            <span>Cài đặt đường dẫn Google Apps Script Web App</span>
          </h3>
          <button
            onClick={handleResetDefaultUrl}
            className="text-xs text-[#004F9E] hover:underline font-medium"
          >
            Khôi phục URL mặc định
          </button>
        </div>

        <form onSubmit={handleSaveGasUrl} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={gasUrl}
            onChange={(e) => setGasUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs text-gray-800"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#004F9E] hover:bg-[#003B77] text-white font-bold rounded-xl shadow transition text-xs flex-shrink-0 cursor-pointer"
          >
            {savedUrl ? 'Đã lưu cấu hình!' : 'Lưu URL'}
          </button>
        </form>
      </div>

      {/* 10 Sheets Architecture Cards */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Table className="w-4 h-4 text-[#004F9E]" />
          <span>Cấu trúc 10 Sheet Tự Động Khởi Tạo Trong Google Spreadsheet</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* Sheet 1: REQUESTS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004F9E] font-mono text-sm">1. REQUESTS</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                Đề nghị cấp quyền
              </span>
            </div>
            <p className="text-gray-600 text-[11px]">
              Lưu toàn bộ hồ sơ đề nghị, trạng thái, người duyệt, kết quả IT, ngày cấp quyền.
            </p>
            <div className="bg-white p-2 rounded border font-mono text-[10px] text-gray-700">
              Mã Đề Nghị | Ngày Tạo | Họ Tên | User AD | Mã PB | Tên PB | Chương Trình | Trạng Thái | Ngày Cấp Quyền
            </div>
          </div>

          {/* Sheet 2: CAN_BO */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004F9E] font-mono text-sm">2. CAN_BO</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                101 Cán bộ
              </span>
            </div>
            <p className="text-gray-600 text-[11px]">
              Lưu danh sách 101 cán bộ VietinBank Ninh Bình, mã cán bộ, phòng ban và tài khoản.
            </p>
            <div className="bg-white p-2 rounded border font-mono text-[10px] text-gray-700">
              Mã Cán Bộ | Họ Tên | User AD | Vai Trò | Mã PB | Tên PB | Chức Vụ | Trạng Thái
            </div>
          </div>

          {/* Sheet 3: USERS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004F9E] font-mono text-sm">3. USERS</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Tài khoản & Quyền
              </span>
            </div>
            <p className="text-gray-600 text-[11px]">
              Danh sách tài khoản đăng nhập (Cán bộ, Lãnh đạo, Điện toán, Admin).
            </p>
            <div className="bg-white p-2 rounded border font-mono text-[10px] text-gray-700">
              Mã User AD | Họ Tên | User AD | Mã PB | Chức Vụ | Mật Khẩu | Email
            </div>
          </div>

          {/* Sheet 4: PHONG_BAN */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004F9E] font-mono text-sm">4. PHONG_BAN</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                11 Phòng ban & PGD
              </span>
            </div>
            <p className="text-gray-600 text-[11px]">
              Danh mục các phòng ban, PGD Gia Viễn, Kim Sơn, Ninh Thành, Yên Khánh.
            </p>
            <div className="bg-white p-2 rounded border font-mono text-[10px] text-gray-700">
              Mã Phòng Ban | Tên Phòng Ban | Mô Tả | Trạng Thái
            </div>
          </div>

          {/* Sheet 5: PROGRAMS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004F9E] font-mono text-sm">5. PROGRAMS</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                Chương trình ứng dụng
              </span>
            </div>
            <p className="text-gray-600 text-[11px]">
              CoreBanking, LOS, ECM, AML, iTrade, FastFund, FX Online, Swift, MIS,...
            </p>
            <div className="bg-white p-2 rounded border font-mono text-[10px] text-gray-700">
              Mã Chương Trình | Tên Chương Trình | Phạm Vi | Nhóm Quyền Mặc Định
            </div>
          </div>

          {/* Sheet 6: AUDIT_LOG */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004F9E] font-mono text-sm">6. AUDIT_LOG</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                Nhật ký kiểm toán
              </span>
            </div>
            <p className="text-gray-600 text-[11px]">
              Lưu vết 100% mọi hành vi lập đề nghị, phê duyệt, từ chối, cập nhật cán bộ.
            </p>
            <div className="bg-white p-2 rounded border font-mono text-[10px] text-gray-700">
              Thời Gian | User AD | Vai Trò | Hành Động | Mã Đề Nghị | Nội Dung | Kết Quả
            </div>
          </div>
        </div>
      </div>

      {/* Step by step deployment */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#004F9E]" />
          <span>Hướng dẫn 4 bước dán mã Code.gs vào Google Sheets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-[#004F9E] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              1
            </span>
            <div>
              <div className="font-bold text-gray-900">
                Mở Google Sheets của bạn
              </div>
              <p className="text-gray-600 mt-1">
                Mở file Google Spreadsheet trên Google Drive của Chi nhánh Ninh Bình.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-[#004F9E] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              2
            </span>
            <div>
              <div className="font-bold text-gray-900">Mở Trình chỉnh sửa Apps Script</div>
              <p className="text-gray-600 mt-1">
                Trên thanh menu Google Sheet, chọn: <b>Tiện ích mở rộng (Extensions) &rarr; Apps Script</b>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-[#004F9E] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              3
            </span>
            <div>
              <div className="font-bold text-gray-900">
                Dán toàn bộ mã nguồn `Code.gs`
              </div>
              <p className="text-gray-600 mt-1">
                Bấm nút <b>"Sao chép toàn bộ mã Code.gs"</b> ở trên, xóa nội dung cũ trong file `Code.gs` và dán đè vào. Sau đó bấm biểu tượng <b>Lưu (Save)</b>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-[#004F9E] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              4
            </span>
            <div>
              <div className="font-bold text-gray-900">Triển khai (Deploy) Web App</div>
              <p className="text-gray-600 mt-1">
                Bấm <b>Triển khai (Deploy) &rarr; Tùy chọn triển khai mới (New deployment)</b>:
                <br />• Loại: <b>Ứng dụng web (Web app)</b>
                <br />• Thực thi với tư cách: <b>Tôi (Me)</b>
                <br />• Người có quyền truy cập: <b>Bất kỳ ai (Anyone)</b>
                <br />Sau đó bấm <b>Triển khai</b> và cấp quyền truy cập.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code preview block */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-xs font-bold text-slate-300">Code.gs (Toàn bộ mã nguồn Google Apps Script)</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
          </button>
        </div>

        <pre className="text-[11px] font-mono text-slate-300 max-h-96 overflow-y-auto p-3 bg-slate-950/70 rounded-xl leading-relaxed select-all">
          {gasCode}
        </pre>
      </div>
    </div>
  );
};
