import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  Shield,
  Key,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  RefreshCw,
  Info
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

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

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

  // Quick 1-Click login for demo accounts
  const handleQuickLogin = async (targetUserAD: string, defaultPass = '123456') => {
    setUserAD(targetUserAD);
    setMatKhau(defaultPass);
    setErrorMessage('');
    setIsLoading(true);

    try {
      const loggedUser = await onAttemptLogin(targetUserAD, defaultPass);
      onLogin(loggedUser, rememberMe);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập nhanh thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Representative Demo Accounts by Role
  const demoAccounts: {
    roleTitle: string;
    roleDesc: string;
    user: User | undefined;
    badgeColor: string;
    icon: string;
  }[] = [
    {
      roleTitle: 'Cán bộ Nghiệp vụ',
      roleDesc: 'Lập đề nghị cấp/đổi quyền, tra cứu tiến độ',
      user: users.find((u) => u.userAD === 'ANHPNP') || users.find((u) => u.chucVu === 'Cán bộ'),
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: '👨‍💼'
    },
    {
      roleTitle: 'Lãnh đạo Phòng',
      roleDesc: 'Xem xét, phê duyệt đề nghị của cán bộ',
      user: users.find((u) => u.userAD === 'DMCUONG' || u.userAD === 'ThangDX') || users.find((u) => u.chucVu === 'Lãnh đạo phòng'),
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: '👔'
    },
    {
      roleTitle: 'Cán bộ Điện toán (IT)',
      roleDesc: 'Tiếp nhận, xử lý phân quyền & cấu hình Core',
      user: users.find((u) => u.userAD.toLowerCase() === 'ducnt4') || users.find((u) => u.chucVu === 'Cán bộ điện toán'),
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      icon: '💻'
    },
    {
      roleTitle: 'Quản trị viên (Admin)',
      roleDesc: 'Quản trị người dùng, danh mục & audit log',
      user: users.find((u) => u.userAD === 'admin_nb' || u.userAD === 'admin') || users.find((u) => u.chucVu === 'Admin'),
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
      icon: '🛡️'
    }
  ];

  // Filtered users in directory modal
  const filteredUsers = users.filter((u) => {
    const q = userSearchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      u.hoTen.toLowerCase().includes(q) ||
      u.userAD.toLowerCase().includes(q) ||
      u.tenPhongBan.toLowerCase().includes(q) ||
      u.chucVu.toLowerCase().includes(q) ||
      u.maUserAD.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#002855] to-[#004F9E] flex flex-col justify-between text-slate-100 relative overflow-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          {/* VietinBank Red-Blue Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-lg bg-[#004F9E] flex items-center justify-center text-white font-black text-xs tracking-tighter">
              <span className="text-[#ED1C24]">V</span>TB
            </div>
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

        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center gap-1 bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bảo mật An toàn Thông tin</span>
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

      {/* Main Center Form */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: System Brief & Role Info */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/30 to-blue-600/30 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cổng Đăng Nhập Cán Bộ & Quản Trị</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                Quản Lý Đề Nghị <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-red-300">
                  Cấp Quyền Chương Trình
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed pt-1">
                Quy trình điện tử hóa khởi tạo, phê duyệt lãnh đạo phòng, phân quyền kỹ thuật điện toán và lưu vết kiểm toán tuân thủ phân quyền toàn Chi nhánh Ninh Bình.
              </p>
            </div>

            {/* Quick 1-Click Role Logins */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Đăng nhập nhanh theo Vai trò (Demo):</span>
                </span>
                <button
                  onClick={() => setIsUserListOpen(true)}
                  className="text-[11px] text-sky-300 hover:text-sky-100 hover:underline font-semibold flex items-center gap-1"
                >
                  <Users className="w-3 h-3" />
                  <span>Xem tất cả ({users.length})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoAccounts.map((acc, idx) => {
                  if (!acc.user) return null;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(acc.user!.userAD, acc.user!.matKhau || '123456')}
                      className="text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{acc.icon}</span>
                        <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded">
                          {acc.user.userAD}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white mt-1 group-hover:text-amber-200 transition">
                        {acc.user.hoTen}
                      </div>
                      <div className="text-[10px] text-blue-200/80 truncate">
                        {acc.roleTitle} • {acc.user.maPhongBan}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features Highlight Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div className="bg-black/20 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">Bảo mật đa tầng</div>
                <div className="text-blue-200/70 text-[10px]">Mã hóa & Audit Log</div>
              </div>
              <div className="bg-black/20 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">4 Cấp Phê duyệt</div>
                <div className="text-blue-200/70 text-[10px]">Tự động luân chuyển</div>
              </div>
              <div className="bg-black/20 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">Phiếu in Đề nghị</div>
                <div className="text-blue-200/70 text-[10px]">Mẫu chuẩn VietinBank</div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-slate-900 border border-slate-100 relative">
              
              {/* Card Header */}
              <div className="text-center pb-5 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#004F9E] to-blue-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-900/20 mb-3">
                  <Key className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Đăng Nhập Tài Khoản
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Nhập User AD và mật khẩu được cấp để truy cập hệ thống
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="font-medium leading-tight">{errorMessage}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left text-xs">
                {/* User AD Input */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Tài khoản User AD / Email: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userAD}
                      onChange={(e) => setUserAD(e.target.value)}
                      placeholder="VD: annv12, ducnt4, admin_nb..."
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
                      Mật khẩu đăng nhập: <span className="text-rose-500">*</span>
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
                      placeholder="Mật khẩu..."
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
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span>Mật khẩu mặc định: <code className="font-mono text-slate-600 font-bold bg-slate-100 px-1 py-0.5 rounded">123456</code></span>
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
                    <span className="font-medium text-[11px]">Ghi nhớ đăng nhập trên thiết bị này</span>
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
                      <span>Đang xác thực tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <span>ĐĂNG NHẬP HỆ THỐNG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Notice */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hệ thống bảo mật nội bộ VietinBank Chi nhánh Ninh Bình</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-blue-200/70 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 Ngân hàng TMCP Công Thương Việt Nam – Chi nhánh Ninh Bình.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Hỗ trợ kỹ thuật: ducnt4@vietinbank.vn</span>
          <span>•</span>
          <span>Phiên bản v1.2 Enterprise</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: HELP / RESET PASSWORD GUIDANCE */}
      {/* ========================================================================= */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm">Hướng dẫn Đăng nhập & Cấp lại Mật khẩu</h3>
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
                  Để đảm bảo an toàn bảo mật, tính năng tự động gửi mật khẩu qua email bị giới hạn. Việc cấp mới hoặc đặt lại (reset) mật khẩu được thực hiện bởi <strong>Quản trị viên (Admin)</strong> hoặc <strong>Tổ Điện toán</strong> của Chi nhánh.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">Thông tin liên hệ Hỗ trợ CNTT & Reset mật khẩu:</div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Nguyễn Trọng Đức</span>
                    <span className="text-[10px] bg-blue-100 text-[#004F9E] font-bold px-2 py-0.5 rounded">Tổ Điện toán</span>
                  </div>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email: <strong className="font-mono text-slate-800">ducnt4@vietinbank.vn</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Điện thoại nội bộ (Máy lẻ): <strong className="font-mono text-slate-800">1042</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-[11px]">
                💡 <strong>Mẹo thử nghiệm hệ thống:</strong> Bạn có thể dùng mật khẩu mặc định <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">123456</code> cho tất cả tài khoản cán bộ trong danh sách demo.
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

      {/* ========================================================================= */}
      {/* MODAL 2: USER DIRECTORY LIST */}
      {/* ========================================================================= */}
      {isUserListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-sm">Danh mục Tài khoản Cán bộ Chi nhánh ({users.length})</h3>
              </div>
              <button onClick={() => setIsUserListOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Tìm theo Tên cán bộ, User AD, Phòng ban..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#004F9E]"
                  autoFocus
                />
              </div>
            </div>

            {/* User List */}
            <div className="p-3 overflow-y-auto divide-y divide-slate-100 flex-1 text-xs">
              {filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  Không tìm thấy cán bộ phù hợp.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  return (
                    <div
                      key={u.id}
                      className="py-2.5 px-3 flex items-center justify-between hover:bg-blue-50/50 rounded-xl transition"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{u.hoTen}</span>
                          <span className="font-mono text-[10px] bg-slate-100 text-[#004F9E] font-bold px-2 py-0.5 rounded border border-slate-200">
                            {u.userAD}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{u.tenPhongBan} ({u.maPhongBan})</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-700">{u.chucVu}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserListOpen(false);
                          handleQuickLogin(u.userAD, u.matKhau || '123456');
                        }}
                        className="inline-flex items-center gap-1 bg-[#004F9E] hover:bg-[#003B77] text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
                      >
                        <span>Đăng nhập</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsUserListOpen(false)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
