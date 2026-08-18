import React, { useState } from 'react';
import { User } from '../types';
import {
  Shield,
  Key,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Info,
  Phone,
  Mail,
  X,
  ArrowRight
} from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User, remember: boolean) => void;
  onAttemptLogin: (userAD: string, matKhau: string) => Promise<User>;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLogin,
  onAttemptLogin
}) => {
  const [userAD, setUserAD] = useState('');
  const [matKhau, setMatKhau] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal Help / Contact IT
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAD.trim()) {
      setErrorMessage('Vui lòng nhập Tài khoản User AD');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const loggedUser = await onAttemptLogin(userAD.trim(), matKhau.trim());
      onLogin(loggedUser, rememberMe);
    } catch (err: any) {
      setErrorMessage(err.message || 'Tài khoản User AD hoặc Mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#002855] to-[#004F9E] flex flex-col justify-between text-slate-100 relative overflow-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          {/* VietinBank Official Brand Logo */}
          <div className="h-10 px-2.5 py-1 bg-white rounded-xl shadow-md flex items-center justify-center">
            <img
              src="https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png"
              alt="VietinBank"
              className="h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-white uppercase">
              Ngân Hàng TMCP Công Thương Việt Nam
            </div>
            <div className="text-[11px] text-blue-200 font-semibold">
              Chi nhánh Ninh Bình • Hệ thống Cấp quyền Ứng dụng & User AD
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1 bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sử dụng nội bộ tại VietinBank - CN Ninh Bình</span>
          </span>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hỗ trợ IT</span>
          </button>
        </div>
      </header>

      {/* Single Unified Login Screen */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-2xl p-7 sm:p-9 text-slate-900 border border-slate-100 relative">
          
          {/* Card Header with Official VietinBank Logo */}
          <div className="text-center pb-5 border-b border-slate-100">
            <div className="w-full flex justify-center mb-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs inline-flex items-center justify-center">
                <img
                  src="https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png"
                  alt="VietinBank"
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Đăng Nhập Hệ Thống
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sử dụng nội bộ tại VietinBank - CN Ninh Bình
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-tight">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left text-xs">
            {/* User AD Input */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Tài khoản User AD: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userAD}
                  onChange={(e) => setUserAD(e.target.value)}
                  placeholder="Nhập tên tài khoản User AD (VD: ducnt4, ANHPNP...)"
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004F9E] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">
                  Mật khẩu: <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(true)}
                  className="text-[#004F9E] hover:underline font-semibold text-[11px]"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004F9E] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004F9E] border-slate-300 focus:ring-[#004F9E]"
                />
                <span className="font-medium text-[11px]">Ghi nhớ đăng nhập trên thiết bị</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-[#004F9E] to-[#003B77] hover:from-[#003B77] hover:to-[#002855] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition transform active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>ĐĂNG NHẬP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Sử dụng nội bộ tại VietinBank - CN Ninh Bình</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 text-center text-xs text-blue-200/70 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Sử dụng nội bộ tại VietinBank - CN Ninh Bình
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span>Hỗ Trợ : ducnt4@vietinbank.vn; SĐT : 0943.882.109</span>
        </div>
      </footer>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm">Hỗ trợ Đăng nhập & Cấp lại Mật khẩu</h3>
              </div>
              <button onClick={() => setIsHelpOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                <div className="font-bold text-[#004F9E] flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>Quy định An toàn Thông tin VietinBank:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Việc cấp mới hoặc đặt lại (reset) mật khẩu tài khoản User AD được quản lý và thực hiện bởi <strong>Điện toán</strong> & Quản trị hệ thống của Chi nhánh Ninh Bình.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">Thông tin liên hệ Hỗ trợ CNTT:</div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Nguyễn Trọng Đức</span>
                    <span className="text-[10px] bg-blue-100 text-[#004F9E] font-bold px-2 py-0.5 rounded">Điện toán</span>
                  </div>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email: <strong className="font-mono text-slate-800">ducnt4@vietinbank.vn</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>SĐT: <strong className="font-mono text-slate-800">0943.882.109</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="px-4 py-2 bg-[#004F9E] text-white font-bold rounded-xl shadow hover:bg-[#003B77] transition"
                >
                  Đã hiểu & Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
