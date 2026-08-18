import React, { useState, useMemo } from 'react';
import {
  RequestRecord,
  User,
  PhongBan,
  ChuongTrinh,
  RequestStatus,
  RequestType
} from '../types';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FilePlus,
  Send,
  AlertCircle,
  Download,
  Building,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface RequestListProps {
  requests: RequestRecord[];
  currentUser: User;
  departments: PhongBan[];
  programs: ChuongTrinh[];
  onOpenCreate: () => void;
  onOpenApprove: (req: RequestRecord) => void;
  onOpenReject: (req: RequestRecord) => void;
  onOpenProcess: (req: RequestRecord) => void;
  onOpenPrint: (req: RequestRecord) => void;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  currentUser,
  departments,
  programs,
  onOpenCreate,
  onOpenApprove,
  onOpenReject,
  onOpenProcess,
  onOpenPrint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'MINE' | 'DEPT'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedProg, setSelectedProg] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<RequestRecord | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const role = currentUser.chucVu;

  // Filter requests
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      // Scope filter
      if (scopeFilter === 'MINE') {
        if (r.userAD !== currentUser.userAD && r.maUserAD !== currentUser.maUserAD) {
          return false;
        }
      } else if (scopeFilter === 'DEPT') {
        if (r.maPhongBan !== currentUser.maPhongBan) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const match =
          r.maDeNghi.toLowerCase().includes(term) ||
          r.hoTen.toLowerCase().includes(term) ||
          r.userAD.toLowerCase().includes(term) ||
          r.maUserAD.toLowerCase().includes(term) ||
          r.tenChuongTrinh.toLowerCase().includes(term) ||
          r.soQDTuyenDung_PhanCong.toLowerCase().includes(term) ||
          r.noiDung.toLowerCase().includes(term);
        if (!match) return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && r.trangThai !== selectedStatus) {
        return false;
      }

      // Type
      if (selectedType !== 'ALL' && r.loaiDeNghi !== selectedType) {
        return false;
      }

      // Program
      if (selectedProg !== 'ALL' && r.maChuongTrinh !== selectedProg) {
        return false;
      }

      // Dept
      if (selectedDept !== 'ALL' && r.maPhongBan !== selectedDept) {
        return false;
      }

      return true;
    });
  }, [requests, scopeFilter, currentUser, searchTerm, selectedStatus, selectedType, selectedProg, selectedDept]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Đề nghị mới':
      case 'Chờ lãnh đạo phòng phê duyệt':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Chờ Lãnh đạo duyệt</span>
          </span>
        );
      case 'Chờ xử lý':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <Send className="w-3 h-3 text-blue-600" />
            <span>Chờ IT xử lý</span>
          </span>
        );
      case 'Từ chối':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Từ chối</span>
          </span>
        );
      case 'Hoàn thành':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Hoàn thành</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: RequestType) => {
    switch (type) {
      case 'Cấp mới':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
            Cấp mới
          </span>
        );
      case 'Thay đổi':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
            Thay đổi
          </span>
        );
      case 'Hủy người dùng':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
            Hủy người dùng
          </span>
        );
    }
  };

  const getTitle = () => {
    switch (role) {
      case 'Cán bộ':
        return 'Quản lý đề nghị của tôi';
      case 'Lãnh đạo phòng':
        return 'Quản lý & Phê duyệt đề nghị phòng ban';
      case 'Cán bộ điện toán':
        return 'Quản lý đề nghị cấp quyền (Điện toán)';
      case 'Admin':
      default:
        return 'Quản lý đề nghị cấp quyền toàn hệ thống';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>{getTitle()}</span>
            <span className="text-xs bg-slate-100 text-[#0054A3] font-bold px-2 py-0.5 rounded-full border border-blue-200">
              {filtered.length} bản ghi
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {role === 'Cán bộ' && 'Theo dõi tiến trình, tra cứu đề nghị của tất cả cán bộ trên toàn chi nhánh và in phiếu A4.'}
            {role === 'Lãnh đạo phòng' &&
              `Phê duyệt các đề nghị của cán bộ thuộc ${currentUser.tenPhongBan} (${currentUser.maPhongBan}) và tra cứu toàn bộ đề nghị chi nhánh.`}
            {role === 'Cán bộ điện toán' &&
              'Danh sách toàn bộ đề nghị cấp quyền chi nhánh Ninh Bình, tiếp nhận xử lý và hoàn thành trên hệ thống nội bộ.'}
            {role === 'Admin' && 'Quản trị và giám sát toàn bộ quy trình cấp quyền trên toàn hệ thống.'}
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 bg-[#DE1C24] hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          <span>Lập đề nghị mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-3">
        {/* Scope Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2.5 border-b border-gray-100 text-xs">
          <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mr-1">
            Phạm vi hiển thị:
          </span>
          <button
            onClick={() => {
              setScopeFilter('ALL');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              scopeFilter === 'ALL'
                ? 'bg-[#0054A3] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả đề nghị Chi nhánh ({requests.length})
          </button>
          <button
            onClick={() => {
              setScopeFilter('DEPT');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              scopeFilter === 'DEPT'
                ? 'bg-[#0054A3] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Phòng ban của tôi ({requests.filter((r) => r.maPhongBan === currentUser.maPhongBan).length})
          </button>
          <button
            onClick={() => {
              setScopeFilter('MINE');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              scopeFilter === 'MINE'
                ? 'bg-[#0054A3] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Đề nghị của tôi ({requests.filter((r) => r.userAD === currentUser.userAD || r.maUserAD === currentUser.maUserAD).length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo mã ĐN, họ tên, user AD, QĐ..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">-- Tất cả trạng thái --</option>
              <option value="Chờ lãnh đạo phòng phê duyệt">Chờ Lãnh đạo duyệt</option>
              <option value="Chờ xử lý">Chờ IT xử lý</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">-- Loại đề nghị --</option>
              <option value="Cấp mới">Cấp mới</option>
              <option value="Thay đổi">Thay đổi</option>
              <option value="Hủy người dùng">Hủy người dùng</option>
            </select>
          </div>

          {/* Program Filter */}
          <div>
            <select
              value={selectedProg}
              onChange={(e) => {
                setSelectedProg(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white truncate"
            >
              <option value="ALL">-- Tất cả chương trình --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.maChuongTrinh}>
                  {p.tenChuongTrinh}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Extra Department Filter for all users */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-semibold flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            Lọc theo phòng ban:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setSelectedDept('ALL');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                selectedDept === 'ALL'
                  ? 'bg-[#004F9E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả phòng
            </button>
            {departments
              .filter((d) => d.trangThai === 'Hoạt động')
              .map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDept(d.maPhongBan);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                    selectedDept === d.maPhongBan
                      ? 'bg-[#004F9E] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {d.maPhongBan}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Mã đề nghị</th>
                <th className="py-2.5 px-3">Ngày lập</th>
                <th className="py-2.5 px-3">Cán bộ đề nghị</th>
                <th className="py-2.5 px-3">Phòng ban</th>
                <th className="py-2.5 px-3">Chương trình</th>
                <th className="py-2.5 px-3">Loại ĐN</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.length > 0 ? (
                paginated.map((req) => {
                  const canLeaderAction =
                    (role === 'Lãnh đạo phòng' &&
                      req.maPhongBan === currentUser.maPhongBan &&
                      (req.trangThai === 'Chờ lãnh đạo phòng phê duyệt' ||
                        req.trangThai === 'Đề nghị mới')) ||
                    (role === 'Admin' &&
                      (req.trangThai === 'Chờ lãnh đạo phòng phê duyệt' ||
                        req.trangThai === 'Đề nghị mới'));

                  const canITAction =
                    (role === 'Cán bộ điện toán' || role === 'Admin') &&
                    req.trangThai === 'Chờ xử lý';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors duration-100"
                    >
                      {/* Mã đề nghị */}
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0054A3] whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequestForDetail(req)}
                          className="hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {req.maDeNghi}
                        </button>
                      </td>

                      {/* Ngày lập */}
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{req.ngayTao}</td>

                      {/* Cán bộ */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{req.hoTen}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {req.userAD} • {req.maUserAD}
                        </div>
                      </td>

                      {/* Phòng ban (snapshot) */}
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{req.tenPhongBan}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{req.maPhongBan}</div>
                      </td>

                      {/* Chương trình */}
                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs">
                        <div className="truncate font-semibold text-xs text-slate-900" title={req.tenChuongTrinh}>
                          {req.tenChuongTrinh}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate" title={req.soQDTuyenDung_PhanCong}>
                          QĐ: {req.soQDTuyenDung_PhanCong}
                        </div>
                      </td>

                      {/* Loại đề nghị */}
                      <td className="py-2.5 px-3 whitespace-nowrap">{getTypeBadge(req.loaiDeNghi)}</td>

                      {/* Trạng thái */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {getStatusBadge(req.trangThai)}
                        {req.ngayCapQuyen && req.trangThai === 'Hoàn thành' && (
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            Cấp ngày: {req.ngayCapQuyen}
                          </div>
                        )}
                        {req.lyDoTuChoi && req.trangThai === 'Từ chối' && (
                          <div className="text-[10px] text-rose-600 truncate max-w-[140px] mt-0.5" title={req.lyDoTuChoi}>
                            Lý do: {req.lyDoTuChoi}
                          </div>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          {/* Xem chi tiết */}
                          <button
                            onClick={() => setSelectedRequestForDetail(req)}
                            title="Xem chi tiết"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Leader Phê duyệt / Từ chối */}
                          {canLeaderAction && (
                            <>
                              <button
                                onClick={() => onOpenApprove(req)}
                                title="Phê duyệt đề nghị"
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => onOpenReject(req)}
                                title="Từ chối đề nghị"
                                className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition cursor-pointer"
                              >
                                Từ chối
                              </button>
                            </>
                          )}

                          {/* IT Tiếp nhận / Hoàn thành */}
                          {canITAction && (
                            <button
                              onClick={() => onOpenProcess(req)}
                              title="Xử lý & Hoàn thành phân quyền"
                              className="px-2 py-1 rounded bg-[#0054A3] hover:bg-[#004280] text-white font-bold text-[11px] shadow-xs transition flex items-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Hoàn thành</span>
                            </button>
                          )}

                          {/* In phiếu */}
                          <button
                            onClick={() => onOpenPrint(req)}
                            title="In Phiếu đề nghị A4"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <Info className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    <p className="font-semibold text-xs">Không tìm thấy đề nghị nào phù hợp điều kiện lọc.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-slate-50 text-xs">
            <div className="text-gray-500">
              Trang <span className="font-bold text-gray-800">{currentPage}</span> / {totalPages} (Tổng{' '}
              {filtered.length} đề nghị)
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequestForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#004F9E] to-[#003B77] text-white flex items-center justify-between rounded-t-2xl">
              <div>
                <div className="text-xs text-blue-200 font-mono font-bold">
                  {selectedRequestForDetail.maDeNghi}
                </div>
                <h3 className="text-base sm:text-lg font-bold">Chi tiết Đề nghị cấp quyền</h3>
              </div>
              <button
                onClick={() => setSelectedRequestForDetail(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Snapshot Info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                  1. Thông tin Cán bộ đề nghị (Snapshot thời điểm lập)
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-800">
                  <div>
                    <span className="text-gray-500">Họ và tên:</span>{' '}
                    <span className="font-bold">{selectedRequestForDetail.hoTen}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">User AD:</span>{' '}
                    <span className="font-mono font-bold">{selectedRequestForDetail.userAD}</span> (Mã:{' '}
                    {selectedRequestForDetail.maUserAD})
                  </div>
                  <div>
                    <span className="text-gray-500">Phòng ban:</span>{' '}
                    <span className="font-medium">{selectedRequestForDetail.tenPhongBan}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mã phòng:</span>{' '}
                    <span className="font-mono font-bold">{selectedRequestForDetail.maPhongBan}</span>
                  </div>
                </div>
              </div>

              {/* Request Content */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                  2. Nội dung đề nghị cấp quyền
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Chương trình ứng dụng:</span>
                    <div className="font-bold text-gray-900">
                      {selectedRequestForDetail.tenChuongTrinh}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Loại đề nghị:</span>
                    <div className="mt-0.5">{getTypeBadge(selectedRequestForDetail.loaiDeNghi)}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Số QĐ tuyển dụng / Phân công NV:</span>
                    <div className="font-bold text-gray-900 bg-slate-50 p-2 rounded border mt-0.5">
                      {selectedRequestForDetail.soQDTuyenDung_PhanCong}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Nội dung / Lý do cụ thể:</span>
                    <div className="text-gray-800 bg-slate-50 p-2 rounded border mt-0.5 whitespace-pre-wrap">
                      {selectedRequestForDetail.noiDung}
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow & Processing Results */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 space-y-2">
                <div className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                  3. Tiến độ xử lý & Phê duyệt
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trạng thái hiện tại:</span>
                    <div>{getStatusBadge(selectedRequestForDetail.trangThai)}</div>
                  </div>
                  {selectedRequestForDetail.nguoiDuyet && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lãnh đạo phòng phê duyệt:</span>
                      <span className="font-bold text-emerald-800">
                        {selectedRequestForDetail.nguoiDuyet} lúc {selectedRequestForDetail.thoiGianDuyet}
                      </span>
                    </div>
                  )}
                  {selectedRequestForDetail.lyDoTuChoi && (
                    <div className="text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                      <span className="font-bold">Lý do từ chối:</span>{' '}
                      {selectedRequestForDetail.lyDoTuChoi}
                    </div>
                  )}
                  {selectedRequestForDetail.nguoiXuLy && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cán bộ điện toán xử lý:</span>
                      <span className="font-bold text-blue-900">
                        {selectedRequestForDetail.nguoiXuLy}
                      </span>
                    </div>
                  )}
                  {selectedRequestForDetail.ngayCapQuyen && (
                    <div className="flex items-center justify-between bg-emerald-50 p-2 rounded border border-emerald-200">
                      <span className="font-bold text-emerald-900">Ngày cấp quyền chính thức:</span>
                      <span className="font-bold text-emerald-900 font-mono text-sm">
                        {selectedRequestForDetail.ngayCapQuyen}
                      </span>
                    </div>
                  )}
                  {selectedRequestForDetail.ketQuaXuLy && (
                    <div className="text-gray-800 bg-white p-2 rounded border">
                      <span className="font-bold">Kết quả thực hiện IT:</span>{' '}
                      {selectedRequestForDetail.ketQuaXuLy}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-2xl">
              <button
                onClick={() => {
                  onOpenPrint(selectedRequestForDetail);
                  setSelectedRequestForDetail(null);
                }}
                className="inline-flex items-center gap-1.5 bg-blue-50 text-[#004F9E] border border-blue-300 hover:bg-blue-100 px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu A4</span>
              </button>
              <button
                onClick={() => setSelectedRequestForDetail(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition"
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
