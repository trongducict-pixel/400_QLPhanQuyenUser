import React, { useState } from 'react';
import { User, ChuongTrinh, RequestType } from '../types';
import {
  FilePlus,
  AlertTriangle,
  Mail,
  Building,
  User as UserIcon,
  Layers,
  FileCheck,
  Send,
  X
} from 'lucide-react';

interface CreateRequestModalProps {
  currentUser: User;
  activePrograms: ChuongTrinh[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    maChuongTrinh: string;
    loaiDeNghi: RequestType;
    soQDTuyenDung_PhanCong: string;
    noiDung: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  currentUser,
  activePrograms,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [maChuongTrinh, setMaChuongTrinh] = useState(
    activePrograms.length > 0 ? activePrograms[0].maChuongTrinh : ''
  );
  const [loaiDeNghi, setLoaiDeNghi] = useState<RequestType>('Cấp mới');
  const [soQDTuyenDung, setSoQDTuyenDung] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!maChuongTrinh) {
      setError('Vui lòng chọn chương trình ứng dụng.');
      return;
    }
    if (!soQDTuyenDung.trim()) {
      setError('Vui lòng nhập Số Quyết định tuyển dụng hoặc Phân công nhiệm vụ.');
      return;
    }
    if (!noiDung.trim()) {
      setError('Vui lòng nhập nội dung hoặc lý do đề nghị.');
      return;
    }

    try {
      await onSubmit({
        maChuongTrinh,
        loaiDeNghi,
        soQDTuyenDung_PhanCong: soQDTuyenDung.trim(),
        noiDung: noiDung.trim()
      });
      // reset form
      setSoQDTuyenDung('');
      setNoiDung('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo đề nghị');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#004F9E] to-[#003B77] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="h-9 px-2 bg-white rounded-xl shadow flex items-center justify-center">
              <img
                src="https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png"
                alt="VietinBank"
                className="h-6 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">Lập Đề nghị Cấp quyền Chương trình</h3>
              <p className="text-[11px] text-blue-200">Chi nhánh Ninh Bình</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Read-Only User Metadata */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center space-x-1.5 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <UserIcon className="w-3.5 h-3.5 text-[#004F9E]" />
              <span>1. Thông tin Cán bộ đề nghị (Tự động từ tài khoản)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Họ và tên cán bộ:</span>
                <span className="font-bold text-gray-900">{currentUser.hoTen}</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Tài khoản User AD / Mã:</span>
                <span className="font-mono font-bold text-gray-900">
                  {currentUser.userAD} ({currentUser.maUserAD})
                </span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Phòng ban công tác:</span>
                <span className="font-semibold text-gray-900">{currentUser.tenPhongBan}</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Mã phòng ban / Chức vụ:</span>
                <span className="font-semibold text-gray-900">
                  {currentUser.maPhongBan} • {currentUser.chucVu}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic">
              * Thông tin cán bộ và phòng ban được hệ thống tự động ghi nhận tại thời điểm lập và không được tự ý sửa đổi.
            </p>
          </div>

          {/* Section 2: Request Parameters */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-1.5 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[#004F9E]" />
              <span>2. Nội dung đề nghị cấp quyền</span>
            </div>

            {/* Program Selection */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Tên chương trình ứng dụng <span className="text-red-500">*</span>
              </label>
              <select
                value={maChuongTrinh}
                onChange={(e) => setMaChuongTrinh(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-900"
                required
              >
                {activePrograms.map((prog) => (
                  <option key={prog.id} value={prog.maChuongTrinh}>
                    {prog.tenChuongTrinh} ({prog.maChuongTrinh})
                  </option>
                ))}
              </select>
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Loại đề nghị <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Cấp mới', 'Reset mật khẩu', 'Hủy người dùng'] as RequestType[]).map((type) => (
                  <label
                    key={type}
                    className={`flex items-center justify-center p-2.5 rounded-xl border cursor-pointer font-bold transition text-xs ${
                      loaiDeNghi === type
                        ? 'bg-blue-50 border-[#004F9E] text-[#004F9E] ring-1 ring-[#004F9E]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="loaiDeNghi"
                      value={type}
                      checked={loaiDeNghi === type}
                      onChange={() => setLoaiDeNghi(type)}
                      className="sr-only"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quyết định tuyển dụng / phân công */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Số QĐ tuyển dụng / Phân công NV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={soQDTuyenDung}
                onChange={(e) => setSoQDTuyenDung(e.target.value)}
                placeholder="Ví dụ: 142/QĐ-NHCT.NB ngày 01/08/2026 hoặc 88/TB-KTDV"
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* Details Textarea */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Nội dung / Lý do đề nghị cụ thể <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                placeholder="Mô tả quyền cần cấp (nhóm quyền, phân hệ, chức năng tra cứu hay hạch toán...) hoặc lý do reset/hủy..."
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>
          </div>

          {/* Section 3: Notice Regarding Scanned Files (No file upload) */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-800">
              <Mail className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Lưu ý quan trọng:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Vui lòng gửi bản scan Quyết định tuyển dụng/Phân công nhiệm vụ về email:{' '}
              <span className="font-bold underline text-amber-950">ducnt4@vietinbank.vn</span> để cán
              bộ điện toán kiểm tra và xử lý.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#004F9E] hover:bg-[#003B77] text-white px-5 py-2 rounded-xl font-bold shadow-md transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang gửi đề nghị...' : 'Gửi Đề nghị'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
