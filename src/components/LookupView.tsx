import React, { useState, useMemo } from 'react';
import { RequestRecord, User, PhongBan, ChuongTrinh } from '../types';
import {
  Search,
  RotateCcw,
  Calendar,
  Layers,
  Building,
  User as UserIcon,
  Printer,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  XCircle,
  Send
} from 'lucide-react';

interface LookupViewProps {
  requests: RequestRecord[];
  currentUser: User;
  departments: PhongBan[];
  programs: ChuongTrinh[];
  onOpenPrint: (req: RequestRecord) => void;
}

export const LookupView: React.FC<LookupViewProps> = ({
  requests,
  currentUser,
  departments,
  programs,
  onOpenPrint
}) => {
  const [maDeNghi, setMaDeNghi] = useState('');
  const [maUserAD, setMaUserAD] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [userAD, setUserAD] = useState('');
  const [maPhongBan, setMaPhongBan] = useState('ALL');
  const [maChuongTrinh, setMaChuongTrinh] = useState('ALL');
  const [loaiDeNghi, setLoaiDeNghi] = useState('ALL');
  const [trangThai, setTrangThai] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedReq, setSelectedReq] = useState<RequestRecord | null>(null);

  const role = currentUser.chucVu;

  const handleReset = () => {
    setMaDeNghi('');
    setMaUserAD('');
    setHoTen('');
    setUserAD('');
    setMaPhongBan('ALL');
    setMaChuongTrinh('ALL');
    setLoaiDeNghi('ALL');
    setTrangThai('ALL');
    setFromDate('');
    setToDate('');
  };

  // Base scope
  const scopedRequests = useMemo(() => {
    if (role === 'Cán bộ') {
      return requests.filter(
        (r) => r.userAD === currentUser.userAD || r.maUserAD === currentUser.maUserAD
      );
    }
    if (role === 'Lãnh đạo phòng') {
      return requests.filter((r) => r.maPhongBan === currentUser.maPhongBan);
    }
    return requests; // IT and Admin see all
  }, [requests, currentUser, role]);

  // Filtered results
  const searchResults = useMemo(() => {
    return scopedRequests.filter((r) => {
      if (maDeNghi.trim() && !r.maDeNghi.toLowerCase().includes(maDeNghi.trim().toLowerCase())) {
        return false;
      }
      if (maUserAD.trim() && !r.maUserAD.toLowerCase().includes(maUserAD.trim().toLowerCase())) {
        return false;
      }
      if (hoTen.trim() && !r.hoTen.toLowerCase().includes(hoTen.trim().toLowerCase())) {
        return false;
      }
      if (userAD.trim() && !r.userAD.toLowerCase().includes(userAD.trim().toLowerCase())) {
        return false;
      }
      if (maPhongBan !== 'ALL' && r.maPhongBan !== maPhongBan) {
        return false;
      }
      if (maChuongTrinh !== 'ALL' && r.maChuongTrinh !== maChuongTrinh) {
        return false;
      }
      if (loaiDeNghi !== 'ALL' && r.loaiDeNghi !== loaiDeNghi) {
        return false;
      }
      if (trangThai !== 'ALL' && r.trangThai !== trangThai) {
        return false;
      }

      // Date range filtering on ngayTao (dd/MM/yyyy)
      if (fromDate || toDate) {
        const parts = r.ngayTao.split(' ')[0].split('/');
        if (parts.length === 3) {
          const reqDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          if (fromDate) {
            const fDate = new Date(fromDate);
            if (reqDate < fDate) return false;
          }
          if (toDate) {
            const tDate = new Date(toDate);
            if (reqDate > tDate) return false;
          }
        }
      }

      return true;
    });
  }, [
    scopedRequests,
    maDeNghi,
    maUserAD,
    hoTen,
    userAD,
    maPhongBan,
    maChuongTrinh,
    loaiDeNghi,
    trangThai,
    fromDate,
    toDate
  ]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#004F9E]" />
          <span>Tra cứu Đề nghị & Quyền Truy cập</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {role === 'Cán bộ' && 'Tra cứu toàn bộ lịch sử đề nghị cấp quyền của tài khoản cá nhân.'}
          {role === 'Lãnh đạo phòng' &&
            `Tra cứu dữ liệu đề nghị và quyền ứng dụng của cán bộ thuộc ${currentUser.tenPhongBan}.`}
          {role === 'Cán bộ điện toán' &&
            'Tra cứu toàn bộ đề nghị cấp quyền, ngày hoàn thành và hồ sơ phân quyền trên toàn chi nhánh.'}
          {role === 'Admin' && 'Tra cứu nâng cao không giới hạn toàn bộ hệ thống.'}
        </p>
      </div>

      {/* Advanced Search Filter Form */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <div className="font-bold text-gray-800 uppercase tracking-wider text-[11px] border-b border-gray-100 pb-2">
          Tiêu chí tra cứu đa chiều
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Mã đề nghị:</label>
            <input
              type="text"
              value={maDeNghi}
              onChange={(e) => setMaDeNghi(e.target.value)}
              placeholder="VD: CN-2026-0001"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Mã User AD:</label>
            <input
              type="text"
              value={maUserAD}
              onChange={(e) => setMaUserAD(e.target.value)}
              placeholder="VD: AD_042_012"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Tài khoản User AD:</label>
            <input
              type="text"
              value={userAD}
              onChange={(e) => setUserAD(e.target.value)}
              placeholder="VD: annv12"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Họ và tên cán bộ:</label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Chương trình ứng dụng:</label>
            <select
              value={maChuongTrinh}
              onChange={(e) => setMaChuongTrinh(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="ALL">-- Tất cả chương trình --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.maChuongTrinh}>
                  {p.tenChuongTrinh}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Loại đề nghị:</label>
            <select
              value={loaiDeNghi}
              onChange={(e) => setLoaiDeNghi(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="ALL">-- Tất cả loại --</option>
              <option value="Cấp mới">Cấp mới</option>
              <option value="Reset mật khẩu">Reset mật khẩu</option>
              <option value="Hủy người dùng">Hủy người dùng</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Trạng thái xử lý:</label>
            <select
              value={trangThai}
              onChange={(e) => setTrangThai(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="ALL">-- Tất cả trạng thái --</option>
              <option value="Chờ lãnh đạo phòng phê duyệt">Chờ Lãnh đạo duyệt</option>
              <option value="Chờ xử lý">Chờ IT xử lý</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>

          {(role === 'Cán bộ điện toán' || role === 'Admin') && (
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Phòng ban:</label>
              <select
                value={maPhongBan}
                onChange={(e) => setMaPhongBan(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="ALL">-- Tất cả phòng ban --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.maPhongBan}>
                    {d.maPhongBan} - {d.tenPhongBan}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Từ ngày tạo:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Đến ngày tạo:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Kết quả tra cứu ({searchResults.length} bản ghi)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2 px-3">Mã đề nghị</th>
                <th className="py-2 px-3">Ngày lập</th>
                <th className="py-2 px-3">Cán bộ</th>
                <th className="py-2 px-3">Phòng ban</th>
                <th className="py-2 px-3">Chương trình</th>
                <th className="py-2 px-3">Loại ĐN</th>
                <th className="py-2 px-3">Trạng thái</th>
                <th className="py-2 px-3">Ngày cấp</th>
                <th className="py-2 px-3 text-right">In phiếu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2 px-3 font-mono font-bold text-[#0054A3]">{r.maDeNghi}</td>
                    <td className="py-2 px-3 text-slate-500">{r.ngayTao}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {r.hoTen} <span className="font-mono text-slate-400 font-normal">({r.userAD})</span>
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      {r.tenPhongBan} <span className="text-slate-400 text-[10px]">({r.maPhongBan})</span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800">{r.tenChuongTrinh}</td>
                    <td className="py-2 px-3">{r.loaiDeNghi}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          r.trangThai === 'Hoàn thành'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : r.trangThai === 'Từ chối'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {r.trangThai}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-emerald-800 font-semibold">
                      {r.ngayCapQuyen || '-'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => onOpenPrint(r)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                        title="In phiếu A4"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Không tìm thấy đề nghị nào với tiêu chí tra cứu trên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
