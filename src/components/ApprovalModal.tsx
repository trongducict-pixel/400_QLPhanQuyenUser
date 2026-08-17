import React, { useState } from 'react';
import { RequestRecord, User } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Send, Mail, X } from 'lucide-react';

interface ApprovalModalProps {
  request: RequestRecord | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, lyDo?: string) => Promise<void>;
  onReject: (id: string, lyDo: string) => Promise<void>;
  isProcessing: boolean;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  request,
  currentUser,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing
}) => {
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [lyDo, setLyDo] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleApproveSubmit = async () => {
    setError('');
    try {
      await onApprove(request.id, lyDo);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phê duyệt đề nghị');
    }
  };

  const handleRejectSubmit = async () => {
    setError('');
    if (!lyDo.trim()) {
      setError('Bắt buộc nhập lý do từ chối đề nghị để cán bộ nắm rõ.');
      return;
    }
    try {
      await onReject(request.id, lyDo.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi từ chối đề nghị');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#004F9E] to-[#003B77] text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-200 font-mono font-bold">{request.maDeNghi}</div>
            <h3 className="text-base sm:text-lg font-bold">Xử lý Phê duyệt Đề nghị Cấp quyền</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Request Overview */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-gray-800">
              <div>
                <span className="text-gray-500">Cán bộ lập:</span>{' '}
                <span className="font-bold text-gray-900">{request.hoTen}</span>
              </div>
              <div>
                <span className="text-gray-500">User AD:</span>{' '}
                <span className="font-mono font-bold">{request.userAD}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Phòng ban:</span>{' '}
                <span className="font-semibold text-gray-900">{request.tenPhongBan} ({request.maPhongBan})</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Chương trình & Loại:</span>{' '}
                <span className="font-bold text-[#004F9E]">{request.tenChuongTrinh}</span> •{' '}
                <span className="font-semibold">{request.loaiDeNghi}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Căn cứ:</span>{' '}
                <span className="font-medium text-gray-900">{request.soQDTuyenDung_PhanCong}</span>
              </div>
              <div className="col-span-2 bg-white p-2 rounded border">
                <span className="text-gray-500 block text-[10px]">Nội dung đề nghị:</span>
                <span className="text-gray-800">{request.noiDung}</span>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActionType('APPROVE')}
              className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
                actionType === 'APPROVE'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ✓ Phê duyệt đề nghị
            </button>
            <button
              type="button"
              onClick={() => setActionType('REJECT')}
              className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
                actionType === 'REJECT'
                  ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ✕ Từ chối đề nghị
            </button>
          </div>

          {/* Form depending on Approve or Reject */}
          {actionType === 'APPROVE' ? (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Xác nhận phê duyệt đề nghị {request.maDeNghi}</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Sau khi bạn phê duyệt, hệ thống sẽ tự động gửi email thông báo tới Cán bộ Điện toán (
                  <span className="font-bold">ducnt4@vietinbank.vn</span>) để tiếp nhận và phân quyền.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Ý kiến / Ghi chú của Lãnh đạo (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={lyDo}
                  onChange={(e) => setLyDo(e.target.value)}
                  placeholder="Đồng ý cấp quyền theo quyết định phân công nhiệm vụ"
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-xs">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Từ chối đề nghị {request.maDeNghi}</span>
                </p>
                <p className="text-[11px] text-rose-700">
                  Vui lòng nêu rõ lý do từ chối để cán bộ chỉnh sửa hoặc hủy yêu cầu.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Lý do từ chối đề nghị <span className="text-red-500">*</span>:
                </label>
                <textarea
                  rows={2}
                  value={lyDo}
                  onChange={(e) => setLyDo(e.target.value)}
                  placeholder="Ví dụ: Chưa có quyết định bổ nhiệm chính thức / Sai nhóm quyền nghiệp vụ..."
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-gray-900"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
          >
            Hủy bỏ
          </button>
          {actionType === 'APPROVE' ? (
            <button
              type="button"
              onClick={handleApproveSubmit}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold shadow transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Đang duyệt...' : 'Xác nhận Phê duyệt'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRejectSubmit}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl font-bold shadow transition disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>{isProcessing ? 'Đang từ chối...' : 'Xác nhận Từ chối'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
