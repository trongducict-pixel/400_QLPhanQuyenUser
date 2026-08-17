import React, { useState, useMemo } from 'react';
import { SummaryUserMatrixRow, ChuongTrinh, PhongBan } from '../types';
import {
  Table,
  Search,
  Download,
  Filter,
  Layers,
  Building,
  Check,
  Ban,
  Info,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

interface SummaryMatrixViewProps {
  programs: ChuongTrinh[];
  rows: SummaryUserMatrixRow[];
  departments: PhongBan[];
}

export const SummaryMatrixView: React.FC<SummaryMatrixViewProps> = ({
  programs,
  rows,
  departments
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedProgFilter, setSelectedProgFilter] = useState('ALL');

  // Filter active vs all programs to show
  const activePrograms = useMemo(() => {
    return programs;
  }, [programs]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (selectedDept !== 'ALL' && r.maPhongBan !== selectedDept) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const match =
          r.hoTen.toLowerCase().includes(term) ||
          r.userAD.toLowerCase().includes(term) ||
          r.maUserAD.toLowerCase().includes(term) ||
          r.tenPhongBan.toLowerCase().includes(term);
        if (!match) return false;
      }
      if (selectedProgFilter !== 'ALL') {
        const progData = r.programs[selectedProgFilter];
        if (!progData || progData.status !== 'V') {
          return false;
        }
      }
      return true;
    });
  }, [rows, selectedDept, searchTerm, selectedProgFilter]);

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'Ma User AD,Ho Ten,User AD,Ma Phong Ban,Ten Phong Ban';
    for (const p of activePrograms) {
      csv += `,"${p.tenChuongTrinh} (Trang thai)","${p.tenChuongTrinh} (Ma DN)","${p.tenChuongTrinh} (Ngay cap)"`;
    }
    csv += '\n';

    for (const r of filteredRows) {
      csv += `"${r.maUserAD}","${r.hoTen}","${r.userAD}","${r.maPhongBan}","${r.tenPhongBan}"`;
      for (const p of activePrograms) {
        const cell = r.programs[p.maChuongTrinh] || { status: '', maDeNghi: '', ngayCapQuyen: '' };
        csv += `,"${cell.status}","${cell.maDeNghi}","${cell.ngayCapQuyen}"`;
      }
      csv += '\n';
    }

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Tong_Hop_Quyen_VietinBank_Ninh_Binh_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Bảng Tổng hợp Quyền Chương trình
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Sheet TỔNG HỢP
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi quyền ứng dụng hiện tại của từng User. Tự động đồng bộ khi Cán bộ điện toán cập
            nhật Hoàn thành.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Báo cáo CSV / Excel</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo User AD, họ tên, mã User..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Dept filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Phòng ban:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded-lg bg-white font-medium"
            >
              <option value="ALL">-- Tất cả phòng ban --</option>
              {departments
                .filter((d) => d.trangThai === 'Hoạt động')
                .map((d) => (
                  <option key={d.id} value={d.maPhongBan}>
                    {d.maPhongBan} - {d.tenPhongBan}
                  </option>
                ))}
            </select>
          </div>

          {/* Program Has Access Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Có quyền:</span>
            <select
              value={selectedProgFilter}
              onChange={(e) => setSelectedProgFilter(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded-lg bg-white font-medium"
            >
              <option value="ALL">-- Tất cả --</option>
              {activePrograms.map((p) => (
                <option key={p.id} value={p.maChuongTrinh}>
                  {p.tenChuongTrinh}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left border-collapse text-xs">
            {/* Header with grouped columns (3 columns per program) */}
            <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
              {/* Row 1: Program headers */}
              <tr className="border-b border-slate-300 text-slate-700">
                <th
                  rowSpan={2}
                  className="py-2.5 px-3 border-r border-slate-300 bg-slate-100 font-bold sticky left-0 z-30 min-w-[90px] text-[10px] uppercase text-slate-500"
                >
                  Mã User AD
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-3 border-r border-slate-300 bg-slate-100 font-bold sticky left-[90px] z-30 min-w-[150px] text-[10px] uppercase text-slate-500"
                >
                  Họ và tên
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-3 border-r border-slate-300 bg-slate-100 font-bold sticky left-[240px] z-30 min-w-[90px] text-[10px] uppercase text-slate-500"
                >
                  User AD
                </th>
                <th
                  rowSpan={2}
                  className="py-2.5 px-3 border-r-2 border-slate-400 bg-slate-100 font-bold min-w-[140px] text-[10px] uppercase text-slate-500"
                >
                  Phòng ban
                </th>

                {/* Group columns for each program */}
                {activePrograms.map((prog) => (
                  <th
                    key={prog.id}
                    colSpan={3}
                    className="py-1.5 px-2.5 text-center border-r-2 border-slate-400 bg-blue-50/80 text-[#0054A3] font-bold uppercase tracking-tight text-[11px]"
                  >
                    <div className="truncate max-w-[220px] mx-auto" title={prog.tenChuongTrinh}>
                      {prog.tenChuongTrinh}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Row 2: 3 sub-columns per program */}
              <tr className="border-b border-slate-300 bg-slate-50 text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                {activePrograms.map((prog) => (
                  <React.Fragment key={`sub-${prog.id}`}>
                    <th className="py-1 px-1.5 border-r border-slate-200 text-center min-w-[45px] bg-slate-50">
                      Quyền
                    </th>
                    <th className="py-1 px-1.5 border-r border-slate-200 text-center min-w-[95px] bg-slate-50">
                      Mã ĐN
                    </th>
                    <th className="py-1 px-1.5 border-r-2 border-slate-400 text-center min-w-[85px] bg-slate-50">
                      Ngày cấp
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* Matrix Body */}
            <tbody className="divide-y divide-slate-200">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.userAD} className="hover:bg-slate-50 transition">
                    {/* Fixed User Columns */}
                    <td className="py-2 px-3 font-mono font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-white z-10">
                      {row.maUserAD}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200 sticky left-[90px] bg-white z-10 whitespace-nowrap">
                      {row.hoTen}
                    </td>
                    <td className="py-2 px-3 font-mono text-[#0054A3] font-semibold border-r border-slate-200 sticky left-[240px] bg-white z-10">
                      {row.userAD}
                    </td>
                    <td className="py-2 px-3 text-slate-700 border-r-2 border-slate-400 whitespace-nowrap">
                      <span className="font-semibold">{row.tenPhongBan}</span>{' '}
                      <span className="text-[10px] text-slate-400">({row.maPhongBan})</span>
                    </td>

                    {/* Program 3-column cells */}
                    {activePrograms.map((prog) => {
                      const cell = row.programs[prog.maChuongTrinh] || {
                        status: '',
                        maDeNghi: '',
                        ngayCapQuyen: ''
                      };

                      const isGranted = cell.status === 'V';
                      const isRevoked = cell.status === 'HỦY';

                      return (
                        <React.Fragment key={`${row.userAD}-${prog.maChuongTrinh}`}>
                          {/* Col 1: Status badge (V / HỦY / empty) */}
                          <td
                            className={`py-2 px-2 text-center border-r border-gray-200 ${
                              isGranted ? 'bg-emerald-50/50' : isRevoked ? 'bg-rose-50/50' : ''
                            }`}
                          >
                            {isGranted && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs shadow-sm">
                                V
                              </span>
                            )}
                            {isRevoked && (
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                                HỦY
                              </span>
                            )}
                          </td>

                          {/* Col 2: Ma De Nghi */}
                          <td className="py-2 px-2 text-center font-mono text-[11px] text-gray-700 border-r border-gray-200">
                            {cell.maDeNghi || <span className="text-gray-300">-</span>}
                          </td>

                          {/* Col 3: Ngay Cap Quyen */}
                          <td className="py-2 px-2 text-center font-mono text-[11px] text-gray-700 border-r-2 border-gray-400">
                            {cell.ngayCapQuyen || <span className="text-gray-300">-</span>}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4 + activePrograms.length * 3}
                    className="py-8 text-center text-gray-400"
                  >
                    <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">Không tìm thấy người dùng nào phù hợp.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-3 bg-slate-50 border-t border-gray-200 text-xs text-gray-600 flex flex-wrap items-center gap-4">
          <span className="font-bold text-gray-700">Chú giải:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              V
            </span>
            <span>Đang có quyền truy cập</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
              HỦY
            </span>
            <span>Đã thu hồi / Hủy người dùng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300 font-bold">-</span>
            <span>Chưa từng được cấp quyền</span>
          </div>
        </div>
      </div>
    </div>
  );
};
