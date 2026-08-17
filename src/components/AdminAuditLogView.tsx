import React, { useState } from 'react';
import { AuditLog } from '../types';
import { History, Search, CheckCircle2, XCircle, Shield, Download } from 'lucide-react';

interface AdminAuditLogViewProps {
  logs: AuditLog[];
}

export const AdminAuditLogView: React.FC<AdminAuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    if (actionFilter !== 'ALL' && l.hanhDong !== actionFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        l.user.toLowerCase().includes(term) ||
        l.hanhDong.toLowerCase().includes(term) ||
        l.noiDung.toLowerCase().includes(term) ||
        l.thoiGian.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleExport = () => {
    let csv = 'ThoiGian,User,HanhDong,NoiDung,KetQua\n';
    for (const l of filteredLogs) {
      csv += `"${l.thoiGian}","${l.user}","${l.hanhDong}","${l.noiDung.replace(/"/g, '""')}","${l.ketQua}"\n`;
    }
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Log_VietinBank_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-[#004F9E]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Nhật ký Hoạt động Hệ thống (Audit Log)
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Sheet AUDIT_LOG
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ghi nhận toàn bộ thao tác: Đăng nhập, Tạo đề nghị, Phê duyệt, Từ chối, Tiếp nhận, Hoàn
            thành và Thay đổi danh mục.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Nhật ký CSV</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo User, nội dung, thời gian..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-gray-500 font-medium">Hành động:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="py-1.5 px-2 border border-gray-300 rounded-lg bg-white font-medium"
          >
            <option value="ALL">-- Tất cả hành động --</option>
            <option value="TẠO_ĐỀ_NGHỊ">TẠO_ĐỀ_NGHỊ</option>
            <option value="PHÊ_DUYỆT">PHÊ_DUYỆT</option>
            <option value="TỪ_CHỐI">TỪ_CHỐI</option>
            <option value="HOÀN_THÀNH">HOÀN_THÀNH</option>
            <option value="CẬP_NHẬT_USER">CẬP_NHẬT_USER</option>
            <option value="CẬP_NHẬT_CHƯƠNG_TRÌNH">CẬP_NHẬT_CHƯƠNG_TRÌNH</option>
            <option value="CẬP_NHẬT_PHÒNG_BAN">CẬP_NHẬT_PHÒNG_BAN</option>
            <option value="CẬP_NHẬT_CÁN_BỘ">CẬP_NHẬT_CÁN_BỘ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                <th className="py-3 px-3">Thời gian</th>
                <th className="py-3 px-3">Người thực hiện</th>
                <th className="py-3 px-3">Hành động</th>
                <th className="py-3 px-3">Nội dung chi tiết</th>
                <th className="py-3 px-3 text-right">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-2.5 px-3 font-mono text-gray-500 whitespace-nowrap">
                    {l.thoiGian}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-gray-900 whitespace-nowrap">
                    {l.user}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold border">
                      {l.hanhDong}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-700">{l.noiDung}</td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        l.ketQua === 'Thành công'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {l.ketQua === 'Thành công' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-600" />
                      )}
                      <span>{l.ketQua}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
