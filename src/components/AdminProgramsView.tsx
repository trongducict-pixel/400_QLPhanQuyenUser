import React, { useState } from 'react';
import { ChuongTrinh } from '../types';
import { Layers, Plus, Edit2, X, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface AdminProgramsViewProps {
  programs: ChuongTrinh[];
  onAddProgram: (prog: Partial<ChuongTrinh>) => Promise<void>;
  onUpdateProgram: (id: string, prog: Partial<ChuongTrinh>) => Promise<void>;
  onNavigateToGuidelines?: (programCode: string) => void;
}

export const AdminProgramsView: React.FC<AdminProgramsViewProps> = ({
  programs,
  onAddProgram,
  onUpdateProgram,
  onNavigateToGuidelines
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<ChuongTrinh | null>(null);

  const [maChuongTrinh, setMaChuongTrinh] = useState('');
  const [tenChuongTrinh, setTenChuongTrinh] = useState('');
  const [nhomQuyenMacDinh, setNhomQuyenMacDinh] = useState('');
  const [phamVi, setPhamVi] = useState('');
  const [moTaNghiepVu, setMoTaNghiepVu] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [trangThai, setTrangThai] = useState<'Hoạt động' | 'Tạm dừng'>('Hoạt động');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingProg(null);
    setMaChuongTrinh('');
    setTenChuongTrinh('');
    setNhomQuyenMacDinh('Giaodichvien, Kiemsoatvien, TraCuu');
    setPhamVi('Toàn chi nhánh theo phân công');
    setMoTaNghiepVu('');
    setGhiChu('');
    setTrangThai('Hoạt động');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prog: ChuongTrinh) => {
    setEditingProg(prog);
    setMaChuongTrinh(prog.maChuongTrinh);
    setTenChuongTrinh(prog.tenChuongTrinh);
    setNhomQuyenMacDinh(prog.nhomQuyenMacDinh || '');
    setPhamVi(prog.phamVi || '');
    setMoTaNghiepVu(prog.moTaNghiepVu || prog.moTa || '');
    setGhiChu(prog.ghiChu || '');
    setTrangThai(prog.trangThai);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingProg) {
        await onUpdateProgram(editingProg.id, {
          maChuongTrinh,
          tenChuongTrinh,
          nhomQuyenMacDinh,
          phamVi,
          moTaNghiepVu,
          ghiChu,
          trangThai
        });
      } else {
        await onAddProgram({
          maChuongTrinh,
          tenChuongTrinh,
          nhomQuyenMacDinh,
          phamVi,
          moTaNghiepVu,
          ghiChu,
          trangThai
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu chương trình');
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
            <Layers className="w-5 h-5 text-[#004F9E]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Danh mục Chương trình Ứng dụng VietinBank
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Sheet PROGRAMS (V1.2)
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Không hard-code chương trình. Khi thêm chương trình mới, hệ thống tự động mở rộng thêm nhóm
            3 cột tương ứng trên Bảng Tổng hợp quyền và cho phép cấu hình quy tắc phân quyền.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#004F9E] hover:bg-[#003B77] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chương trình</span>
        </button>
      </div>

      {/* Dynamic Matrix Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Hiện có <b>{programs.length}</b> chương trình ứng dụng được khai báo trong hệ thống.
          </span>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
              <th className="py-3 px-3">Mã chương trình</th>
              <th className="py-3 px-3">Tên chương trình ứng dụng</th>
              <th className="py-3 px-3">Phạm vi áp dụng</th>
              <th className="py-3 px-3">Mô tả nghiệp vụ</th>
              <th className="py-3 px-3">Nhóm quyền mặc định</th>
              <th className="py-3 px-3">Trạng thái</th>
              <th className="py-3 px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/40 transition">
                <td className="py-3 px-3 font-mono font-bold text-[#004F9E]">{p.maChuongTrinh}</td>
                <td className="py-3 px-3 font-bold text-gray-900">{p.tenChuongTrinh}</td>
                <td className="py-3 px-3 text-gray-700">{p.phamVi || 'Toàn chi nhánh'}</td>
                <td className="py-3 px-3 text-gray-600 max-w-xs truncate">{p.moTaNghiepVu || p.moTa || '-'}</td>
                <td className="py-3 px-3 text-blue-700 font-mono text-[11px]">{p.nhomQuyenMacDinh || '-'}</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.trangThai === 'Hoạt động'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {p.trangThai}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                  {onNavigateToGuidelines && (
                    <button
                      onClick={() => onNavigateToGuidelines(p.maChuongTrinh)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#004F9E] font-medium inline-flex items-center gap-1 text-[11px]"
                      title="Xem căn cứ & quy tắc cấp quyền"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Căn cứ</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="Chỉnh sửa chương trình"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProg ? 'Sửa Cấu hình Chương trình' : 'Thêm Chương trình Ứng dụng mới'}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mã chương trình (*):</label>
                  <input
                    type="text"
                    value={maChuongTrinh}
                    onChange={(e) => setMaChuongTrinh(e.target.value)}
                    placeholder="VD: COREBANKING, LOS, ITRADE..."
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase font-bold text-blue-800"
                    required
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
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tên chương trình ứng dụng (*):</label>
                <input
                  type="text"
                  value={tenChuongTrinh}
                  onChange={(e) => setTenChuongTrinh(e.target.value)}
                  placeholder="VD: Hệ thống Quản lý Hạn mức Tín dụng CLIMS"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Phạm vi đối tượng áp dụng:</label>
                <input
                  type="text"
                  value={phamVi}
                  onChange={(e) => setPhamVi(e.target.value)}
                  placeholder="VD: Khối KHDN, KHBL, Quản lý rủi ro..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả nghiệp vụ:</label>
                <textarea
                  rows={2}
                  value={moTaNghiepVu}
                  onChange={(e) => setMoTaNghiepVu(e.target.value)}
                  placeholder="Chức năng cốt lõi của chương trình ứng dụng..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Nhóm quyền mặc định gợi ý:</label>
                <input
                  type="text"
                  value={nhomQuyenMacDinh}
                  onChange={(e) => setNhomQuyenMacDinh(e.target.value)}
                  placeholder="VD: GiaoDichVien, KiemSoatVien, TraCuu"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Ghi chú chung:</label>
                <input
                  type="text"
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  placeholder="Ghi chú khi cấp quyền..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
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
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Chương trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
