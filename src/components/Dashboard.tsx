import React from 'react';
import {
  User,
  RequestRecord,
  PhongBan,
  ChuongTrinh,
  AuditLog
} from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FilePlus,
  Users,
  Building,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Printer,
  Sparkles,
  Search
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  requests: RequestRecord[];
  departments: PhongBan[];
  programs: ChuongTrinh[];
  users: User[];
  auditLogs: AuditLog[];
  onNavigate: (tab: any) => void;
  onOpenCreate: () => void;
  onOpenApprove: (req: RequestRecord) => void;
  onOpenReject: (req: RequestRecord) => void;
  onOpenProcess: (req: RequestRecord) => void;
  onOpenPrint: (req: RequestRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  requests,
  departments,
  programs,
  users,
  auditLogs,
  onNavigate,
  onOpenCreate,
  onOpenApprove,
  onOpenReject,
  onOpenProcess,
  onOpenPrint
}) => {
  const role = currentUser.chucVu;

  // Filter scoped data
  const userRequests = requests.filter(
    (r) => r.userAD === currentUser.userAD || r.maUserAD === currentUser.maUserAD
  );
  const deptRequests = requests.filter((r) => r.maPhongBan === currentUser.maPhongBan);

  // Status counters for Cán bộ
  const myTotal = userRequests.length;
  const myPendingApproval = userRequests.filter(
    (r) => r.trangThai === 'Chờ lãnh đạo phòng phê duyệt' || r.trangThai === 'Đề nghị mới'
  ).length;
  const myPendingProcess = userRequests.filter((r) => r.trangThai === 'Chờ xử lý').length;
  const myCompleted = userRequests.filter((r) => r.trangThai === 'Hoàn thành').length;
  const myRejected = userRequests.filter((r) => r.trangThai === 'Từ chối').length;

  // Status counters for Lãnh đạo
  const leaderPending = deptRequests.filter(
    (r) => r.trangThai === 'Chờ lãnh đạo phòng phê duyệt' || r.trangThai === 'Đề nghị mới'
  );
  const leaderApproved = deptRequests.filter(
    (r) => r.trangThai === 'Chờ xử lý' || r.trangThai === 'Hoàn thành'
  ).length;
  const leaderRejected = deptRequests.filter((r) => r.trangThai === 'Từ chối').length;
  const leaderTotal = deptRequests.length;

  // Status counters for Điện toán (IT)
  const itPendingProcess = requests.filter((r) => r.trangThai === 'Chờ xử lý');
  const itCompletedToday = requests.filter((r) => {
    if (r.trangThai !== 'Hoàn thành' || !r.thoiGianHoanThanh) return false;
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${today.getFullYear()}`;
    return r.thoiGianHoanThanh.startsWith(todayStr);
  }).length;
  const itTotalCompleted = requests.filter((r) => r.trangThai === 'Hoàn thành').length;
  const itTotal = requests.length;

  // Status counters for Admin
  const adminTotalUsers = users.length;
  const adminTotalDepts = departments.filter((d) => d.trangThai === 'Hoạt động').length;
  const adminTotalProgs = programs.filter((p) => p.trangThai === 'Hoạt động').length;
  const adminTotalRequests = requests.length;
  const adminPendingApproval = requests.filter(
    (r) => r.trangThai === 'Chờ lãnh đạo phòng phê duyệt'
  ).length;
  const adminPendingProcess = requests.filter((r) => r.trangThai === 'Chờ xử lý').length;
  const adminCompleted = requests.filter((r) => r.trangThai === 'Hoàn thành').length;
  const adminRejected = requests.filter((r) => r.trangThai === 'Từ chối').length;

  return (
    <div className="space-y-5">
      {/* Welcome Banner - High Density Corporate VietinBank */}
      <div className="bg-[#0054A3] rounded-xl p-5 text-white shadow-sm relative overflow-hidden border border-[#004280]">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-blue-100 mb-2 border border-white/15">
                <ShieldCheck className="w-3 h-3 text-blue-200" />
                <span>VietinBank Ninh Bình • Quản lý Cấp quyền Chương trình</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Xin chào, {currentUser.hoTen}
              </h1>
              <p className="text-xs text-blue-100 mt-0.5 max-w-2xl leading-relaxed">
                {role === 'Cán bộ' &&
                  'Theo dõi và lập đề nghị cấp mới, reset mật khẩu, hủy quyền các chương trình CoreBanking, LOS, FastFund...'}
                {role === 'Lãnh đạo phòng' &&
                  `Phê duyệt các đề nghị cấp quyền của cán bộ thuộc ${currentUser.tenPhongBan} (${currentUser.maPhongBan}).`}
                {role === 'Cán bộ điện toán' &&
                  'Tiếp nhận đề nghị đã phê duyệt, thực hiện phân quyền trên hệ thống nội bộ và hoàn thành để đồng bộ Bảng Tổng hợp.'}
                {role === 'Admin' &&
                  'Giám sát toàn bộ tiến độ phân quyền, quản lý danh mục phòng ban, chương trình và kiểm toán hệ thống.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:self-center flex-shrink-0">
              {(role === 'Cán bộ' || role === 'Admin') && (
                <button
                  onClick={onOpenCreate}
                  className="inline-flex items-center gap-1.5 bg-[#DE1C24] hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition cursor-pointer"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Lập Đề Nghị Mới</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('matrix')}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 transition cursor-pointer"
              >
                <span>Bảng Tổng Hợp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards based on Role - High Density 4-column card grid */}

      {/* 1. KPI for Cán bộ */}
      {role === 'Cán bộ' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
            <div className="bg-blue-100 p-3 rounded-md mr-3.5 text-[#0054A3] text-xl font-bold min-w-[48px] text-center">
              {myTotal.toString().padStart(2, '0')}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Đề nghị của tôi</p>
              <p className="text-base font-bold text-slate-800">Đã lập</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
            <div className="bg-amber-100 p-3 rounded-md mr-3.5 text-amber-700 text-xl font-bold min-w-[48px] text-center">
              {myPendingApproval.toString().padStart(2, '0')}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Đang chờ</p>
              <p className="text-base font-bold text-slate-800">Phòng Duyệt</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
            <div className="bg-indigo-100 p-3 rounded-md mr-3.5 text-indigo-700 text-xl font-bold min-w-[48px] text-center">
              {myPendingProcess.toString().padStart(2, '0')}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chờ xử lý</p>
              <p className="text-base font-bold text-slate-800">Điện toán</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
            <div className="bg-emerald-100 p-3 rounded-md mr-3.5 text-emerald-700 text-xl font-bold min-w-[48px] text-center">
              {myCompleted.toString().padStart(2, '0')}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hoàn thành</p>
              <p className="text-base font-bold text-slate-800">Đã cấp quyền</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. KPI for Lãnh đạo phòng */}
      {role === 'Lãnh đạo phòng' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-3.5 rounded-lg border border-amber-300 shadow-xs flex items-center">
              <div className="bg-amber-100 p-3 rounded-md mr-3.5 text-amber-800 text-xl font-bold min-w-[48px] text-center animate-pulse">
                {leaderPending.length.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">Chờ phê duyệt</p>
                <p className="text-base font-bold text-slate-800">Cần duyệt ngay</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-emerald-100 p-3 rounded-md mr-3.5 text-emerald-700 text-xl font-bold min-w-[48px] text-center">
                {leaderApproved.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Đã phê duyệt</p>
                <p className="text-base font-bold text-slate-800">Chuyển IT</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-rose-100 p-3 rounded-md mr-3.5 text-rose-700 text-xl font-bold min-w-[48px] text-center">
                {leaderRejected.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Từ chối</p>
                <p className="text-base font-bold text-slate-800">Không đạt</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-blue-100 p-3 rounded-md mr-3.5 text-[#0054A3] text-xl font-bold min-w-[48px] text-center">
                {leaderTotal.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tổng đề nghị</p>
                <p className="text-base font-bold text-slate-800">{currentUser.maPhongBan}</p>
              </div>
            </div>
          </div>

          {/* Pending Approval List for Leader */}
          {leaderPending.length > 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Đề nghị đang chờ phê duyệt ({leaderPending.length})
                  </h3>
                </div>
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase">
                  {currentUser.maPhongBan}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {leaderPending.map((req) => (
                  <div
                    key={req.id}
                    className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#0054A3]">
                          {req.maDeNghi}
                        </span>
                        <span className="font-bold text-slate-900">{req.hoTen}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({req.userAD})</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                          {req.loaiDeNghi}
                        </span>
                      </div>
                      <div className="text-slate-700 mt-1 font-medium text-xs">
                        Chương trình: <span className="font-bold text-slate-900">{req.tenChuongTrinh}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Căn cứ: {req.soQDTuyenDung_PhanCong} • Lập lúc {req.ngayTao}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => onOpenApprove(req)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-xs transition cursor-pointer"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => onOpenReject(req)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1.5 rounded transition cursor-pointer"
                      >
                        Từ chối
                      </button>
                      <button
                        onClick={() => onOpenPrint(req)}
                        title="In phiếu A4"
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-800">
                Không có đề nghị nào đang chờ phê duyệt tại phòng.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. KPI for Cán bộ điện toán (IT) */}
      {role === 'Cán bộ điện toán' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-3.5 rounded-lg border border-blue-300 shadow-xs flex items-center">
              <div className="bg-blue-100 p-3 rounded-md mr-3.5 text-[#0054A3] text-xl font-bold min-w-[48px] text-center animate-pulse">
                {itPendingProcess.length.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chờ xử lý</p>
                <p className="text-base font-bold text-slate-800">Điện toán</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-yellow-100 p-3 rounded-md mr-3.5 text-yellow-700 text-xl font-bold min-w-[48px] text-center">
                {requests.filter((r) => r.trangThai === 'Chờ lãnh đạo phòng phê duyệt').length.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Đang chờ</p>
                <p className="text-base font-bold text-slate-800">Phòng Duyệt</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-green-100 p-3 rounded-md mr-3.5 text-green-700 text-xl font-bold min-w-[48px] text-center">
                {itTotalCompleted.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hoàn thành</p>
                <p className="text-base font-bold text-slate-800">Tháng này</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-red-100 p-3 rounded-md mr-3.5 text-red-700 text-xl font-bold min-w-[48px] text-center">
                {requests.filter((r) => r.trangThai === 'Từ chối').length.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Từ chối</p>
                <p className="text-base font-bold text-slate-800">Lãnh đạo</p>
              </div>
            </div>
          </div>

          {/* Pending IT Action List */}
          {itPendingProcess.length > 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#0054A3] animate-ping" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Đề nghị chờ thực hiện trên hệ thống nội bộ ({itPendingProcess.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  ducnt4@vietinbank.vn
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {itPendingProcess.map((req) => (
                  <div
                    key={req.id}
                    className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#0054A3]">
                          {req.maDeNghi}
                        </span>
                        <span className="font-bold text-slate-900">{req.hoTen}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({req.userAD})</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                          {req.tenPhongBan}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-[#0054A3] px-1.5 py-0.5 rounded font-bold">
                          {req.loaiDeNghi}
                        </span>
                      </div>
                      <div className="text-slate-800 mt-1 font-medium text-xs">
                        Chương trình: <span className="font-bold">{req.tenChuongTrinh}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Duyệt bởi: <span className="font-semibold text-emerald-700">{req.nguoiDuyet}</span> • QĐ: {req.soQDTuyenDung_PhanCong}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => onOpenProcess(req)}
                        className="bg-[#0054A3] hover:bg-[#004280] text-white text-xs font-bold px-3 py-1.5 rounded shadow-xs transition flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Xử lý & Hoàn thành</span>
                      </button>
                      <button
                        onClick={() => onOpenPrint(req)}
                        title="In phiếu A4"
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#0054A3] mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-800">
                Hiện không có đề nghị nào chờ xử lý tại Điện toán.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. KPI for Admin */}
      {role === 'Admin' && (
        <div className="space-y-4">
          {/* Master data summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-purple-100 p-3 rounded-md mr-3.5 text-purple-700 text-xl font-bold min-w-[48px] text-center">
                {adminTotalUsers.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Người dùng</p>
                <p className="text-base font-bold text-slate-800">Tài khoản</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-blue-100 p-3 rounded-md mr-3.5 text-[#0054A3] text-xl font-bold min-w-[48px] text-center">
                {adminTotalDepts.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Phòng ban</p>
                <p className="text-base font-bold text-slate-800">Hoạt động</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-indigo-100 p-3 rounded-md mr-3.5 text-indigo-700 text-xl font-bold min-w-[48px] text-center">
                {adminTotalProgs.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chương trình</p>
                <p className="text-base font-bold text-slate-800">Ứng dụng</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex items-center">
              <div className="bg-emerald-100 p-3 rounded-md mr-3.5 text-emerald-700 text-xl font-bold min-w-[48px] text-center">
                {adminTotalRequests.toString().padStart(2, '0')}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tổng đề nghị</p>
                <p className="text-base font-bold text-slate-800">Hệ thống</p>
              </div>
            </div>
          </div>

          {/* Workflow statuses for Admin */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Chờ duyệt phòng</div>
              <div className="text-xl font-bold text-amber-900 mt-0.5">
                {adminPendingApproval}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-[10px] font-bold text-[#0054A3] uppercase tracking-wider">Chờ xử lý IT</div>
              <div className="text-xl font-bold text-blue-900 mt-0.5">
                {adminPendingProcess}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Đã hoàn thành</div>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">
                {adminCompleted}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-rose-200">
              <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Từ chối</div>
              <div className="text-xl font-bold text-rose-900 mt-0.5">
                {adminRejected}
              </div>
            </div>
          </div>

          {/* Recent Audit Trails */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Nhật ký Audit Log gần nhất</h3>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs text-[#0054A3] hover:underline font-semibold cursor-pointer"
              >
                Xem toàn bộ &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-400 text-[11px]">{log.thoiGian}</span>
                    <span className="font-bold text-slate-800">{log.user}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                      {log.hanhDong}
                    </span>
                    <span className="text-slate-600 truncate max-w-md">{log.noiDung}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      log.ketQua === 'Thành công'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {log.ketQua}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
