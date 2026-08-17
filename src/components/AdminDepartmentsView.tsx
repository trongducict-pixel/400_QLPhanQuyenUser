import React, { useState } from 'react';
import { PhongBan } from '../types';
import { Building, Plus, Edit2, X, AlertCircle } from 'lucide-react';

interface AdminDepartmentsViewProps {
  departments: PhongBan[];
  onAddDepartment: (dept: Partial<PhongBan>) => Promise<void>;
  onUpdateDepartment: (id: string, dept: Partial<PhongBan>) => Promise<void>;
}

export const AdminDepartmentsView: React.FC<AdminDepartmentsViewProps> = ({
  departments,
  onAddDepartment,
  onUpdateDepartment
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<PhongBan | null>(null);

  const [maPhongBan, setMaPhongBan] = useState('');
  const [tenPhongBan, setTenPhongBan] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [trangThai, setTrangThai] = useState<'Hoạt động' | 'Tạm dừng'>('Hoạt động');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setMaPhongBan('');
    setTenPhongBan('');
    setGhiChu('');
    setTrangThai('Hoạt động');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: PhongBan) => {
    setEditingDept(dept);
    setMaPhongBan(dept.maPhongBan);
    setTenPhongBan(dept.tenPhongBan);
    setGhiChu(dept.ghiChu || '');
    setTrangThai(dept.trangThai);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingDept) {
        await onUpdateDepartment(editingDept.id, {
          maPhongBan,
          tenPhongBan,
          ghiChu,
          trangThai
        });
      } else {
        await onAddDepartment({
          maPhongBan,
          tenPhongBan,
          ghiChu,
          trangThai
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu phòng ban');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-[#004F9E]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Danh mục Phòng ban & Điểm giao dịch
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Sheet PHONGBAN
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Không hard-code mã phòng. Dữ liệu phòng ban được cập nhật động từ hệ thống.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#004F9E] hover:bg-[#003B77] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Phòng ban</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
              <th className="py-3 px-3">Mã phòng ban</th>
              <th className="py-3 px-3">Tên phòng ban / Chi nhánh</th>
              <th className="py-3 px-3">Ghi chú</th>
              <th className="py-3 px-3">Trạng thái</th>
              <th className="py-3 px-3 text-right">Sửa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.map((d) => (
              <tr key={d.id} className="hover:bg-blue-50/40 transition">
                <td className="py-3 px-3 font-mono font-bold text-[#004F9E]">{d.maPhongBan}</td>
                <td className="py-3 px-3 font-bold text-gray-900">{d.tenPhongBan}</td>
                <td className="py-3 px-3 text-gray-500">{d.ghiChu || '-'}</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.trangThai === 'Hoạt động'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {d.trangThai}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleOpenEdit(d)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="Chỉnh sửa phòng ban"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingDept ? 'Sửa Phòng ban' : 'Thêm Phòng ban mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mã phòng ban:</label>
                <input
                  type="text"
                  value={maPhongBan}
                  onChange={(e) => setMaPhongBan(e.target.value)}
                  placeholder="VD: NB_KTDV"
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tên phòng ban:</label>
                <input
                  type="text"
                  value={tenPhongBan}
                  onChange={(e) => setTenPhongBan(e.target.value)}
                  placeholder="VD: Phòng Kế toán & Dịch vụ Khách hàng"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Ghi chú:</label>
                <input
                  type="text"
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  placeholder="Mô tả nhiệm vụ hoặc địa chỉ..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Trạng thái:</label>
                <select
                  value={trangThai}
                  onChange={(e) => setTrangThai(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-[#004F9E] text-white font-bold rounded-lg shadow"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Phòng ban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
