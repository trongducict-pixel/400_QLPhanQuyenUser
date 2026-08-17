import React, { useState, useEffect, useMemo } from 'react';
import {
  RequestRecord,
  User,
  AppPermissionRule,
  AppPermissionGroup,
  AppRegulation,
  AppNote
} from '../types';
import { api } from '../services/api';
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  Cpu,
  X,
  Calendar,
  BookOpen,
  HelpCircle,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  FileCheck
} from 'lucide-react';

interface ITProcessModalProps {
  request: RequestRecord | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    id: string,
    payload: {
      ketQuaXuLy?: string;
      noiDungXuLy?: string;
      nhomQuyenGoiY?: string;
      nhomQuyenThucTe?: string;
      maNhomQuyenThucTe?: string;
      canhBaoCauHinh?: string;
      canCuVanBan?: string;
      ghiChuXuLy?: string;
    }
  ) => Promise<void>;
  isProcessing: boolean;
}

export const ITProcessModal: React.FC<ITProcessModalProps> = ({
  request,
  currentUser,
  isOpen,
  onClose,
  onComplete,
  isProcessing
}) => {
  // State for fetched reference guidelines
  const [rules, setRules] = useState<AppPermissionRule[]>([]);
  const [groups, setGroups] = useState<AppPermissionGroup[]>([]);
  const [regulations, setRegulations] = useState<AppRegulation[]>([]);
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [loadingRef, setLoadingRef] = useState<boolean>(false);

  // Form states
  const [selectedGroupCode, setSelectedGroupCode] = useState<string>('');
  const [customGroupCode, setCustomGroupCode] = useState<string>('');
  const [isCustomGroup, setIsCustomGroup] = useState<boolean>(false);
  const [canCuVanBan, setCanCuVanBan] = useState<string>('');
  const [ketQuaXuLy, setKetQuaXuLy] = useState<string>('');
  const [noiDungXuLy, setNoiDungXuLy] = useState<string>('');
  const [ghiChuXuLy, setGhiChuXuLy] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Fetch guidelines whenever modal opens for a request
  useEffect(() => {
    if (!request || !isOpen) return;

    let isMounted = true;
    const fetchGuidelines = async () => {
      try {
        setLoadingRef(true);
        const [rulesData, groupsData, regsData, notesData] = await Promise.all([
          api.getPermissionRules(request.maChuongTrinh),
          api.getPermissionGroups(request.maChuongTrinh),
          api.getRegulations(request.maChuongTrinh),
          api.getNotes(request.maChuongTrinh)
        ]);

        if (!isMounted) return;

        setRules(rulesData);
        setGroups(groupsData);
        setRegulations(regsData);
        setNotes(notesData);

        // Find best match rule
        const matchedRule = rulesData.find(
          r =>
            r.maPhongBan === request.maPhongBan ||
            request.tenPhongBan.toLowerCase().includes(r.tenPhongBan.toLowerCase()) ||
            request.chucVu.toLowerCase().includes(r.doiTuong.toLowerCase())
        ) || rulesData[0];

        const defaultGroupName = matchedRule ? matchedRule.maNhomQuyen : (groupsData[0]?.maNhomQuyen || '');
        setSelectedGroupCode(defaultGroupName);
        setIsCustomGroup(false);

        // Default regulation
        const defaultReg = regsData[0];
        setCanCuVanBan(defaultReg ? `${defaultReg.soVanBan} - ${defaultReg.tenVanBan}` : 'Quy định quản lý phân quyền VietinBank');

        setKetQuaXuLy(`Đã thực hiện ${request.loaiDeNghi} thành công trên chương trình ${request.tenChuongTrinh}`);
        setNoiDungXuLy(
          `Cấp quyền nhóm [${defaultGroupName || 'Chức năng'}] theo đúng đề nghị và quyết định phân công nhiệm vụ`
        );
      } catch (err: any) {
        console.error('Error fetching guidelines:', err);
      } finally {
        if (isMounted) setLoadingRef(false);
      }
    };

    fetchGuidelines();

    return () => {
      isMounted = false;
    };
  }, [request, isOpen]);

  // Suggested Rule match computation
  const matchedRule = useMemo(() => {
    if (!request || rules.length === 0) return null;
    return (
      rules.find(
        r =>
          r.maPhongBan === request.maPhongBan ||
          request.tenPhongBan.toLowerCase().includes(r.tenPhongBan.toLowerCase()) ||
          request.chucVu.toLowerCase().includes(r.doiTuong.toLowerCase())
      ) || rules[0]
    );
  }, [request, rules]);

  if (!isOpen || !request) return null;

  const todayStr = (() => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  })();

  const actualGroupToSubmit = isCustomGroup ? customGroupCode.trim() : selectedGroupCode;
  const isDifferentFromSuggestion = matchedRule && actualGroupToSubmit && actualGroupToSubmit !== matchedRule.maNhomQuyen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!actualGroupToSubmit) {
      setError('Vui lòng chọn hoặc nhập Nhóm quyền thực tế thực hiện.');
      return;
    }

    try {
      await onComplete(request.id, {
        ketQuaXuLy: ketQuaXuLy.trim(),
        noiDungXuLy: noiDungXuLy.trim(),
        nhomQuyenGoiY: matchedRule ? matchedRule.maNhomQuyen : undefined,
        nhomQuyenThucTe: actualGroupToSubmit,
        maNhomQuyenThucTe: actualGroupToSubmit,
        canCuVanBan: canCuVanBan.trim(),
        ghiChuXuLy: ghiChuXuLy.trim(),
        canhBaoCauHinh: isDifferentFromSuggestion ? `Khác gợi ý chuẩn [${matchedRule?.maNhomQuyen}]` : undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật hoàn thành');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 my-auto text-xs">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-[#004F9E] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-blue-200 font-mono font-bold">{request.maDeNghi}</div>
              <h3 className="text-base sm:text-lg font-bold">Xử lý Phân quyền Điện toán (IT)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Request Overview Box */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="font-bold text-gray-700 text-xs">Thông tin đề nghị cấp quyền:</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {request.loaiDeNghi}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-800 text-[11px]">
              <div>
                <span className="text-gray-500">Cán bộ:</span>{' '}
                <span className="font-bold text-gray-900">{request.hoTen}</span>
              </div>
              <div>
                <span className="text-gray-500">User AD:</span>{' '}
                <span className="font-mono font-bold text-[#004F9E]">{request.userAD}</span>
              </div>
              <div>
                <span className="text-gray-500">Phòng ban:</span>{' '}
                <span className="font-semibold text-gray-800">{request.tenPhongBan}</span>
              </div>
              <div>
                <span className="text-gray-500">Chương trình:</span>{' '}
                <span className="font-bold text-gray-900">{request.tenChuongTrinh}</span>
              </div>
              <div>
                <span className="text-gray-500">Chức vụ:</span>{' '}
                <span className="font-semibold text-gray-800">{request.chucVu}</span>
              </div>
              <div>
                <span className="text-gray-500">Lãnh đạo duyệt:</span>{' '}
                <span className="font-semibold text-emerald-700">{request.nguoiDuyet}</span>
              </div>
            </div>
          </div>

          {/* 2. V1.2 Reference & Guidelines Panel */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-xs text-blue-900">
                <BookOpen className="w-4 h-4 text-[#004F9E]" />
                <span>Căn cứ & Hướng dẫn Cấp quyền [{request.maChuongTrinh}] (Tham khảo)</span>
              </div>
              <span className="text-[10px] text-blue-700 bg-blue-100/70 px-2 py-0.2 rounded-full font-semibold">
                V1.2 Guidelines
              </span>
            </div>

            {loadingRef ? (
              <div className="text-xs text-blue-700 py-2 text-center animate-pulse">
                Đang tải hướng dẫn và quy định của chương trình {request.maChuongTrinh}...
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {/* Matched Suggested Permission Rule */}
                {matchedRule ? (
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700 text-[11px]">
                        Nhóm quyền gợi ý chuẩn ({matchedRule.tenPhongBan} - {matchedRule.doiTuong}):
                      </span>
                      <span className="font-mono font-bold text-[#004F9E] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {matchedRule.maNhomQuyen}
                      </span>
                    </div>
                    {matchedRule.dieuKien && (
                      <div className="text-[11px] text-gray-600">
                        <span className="font-semibold">Điều kiện:</span> {matchedRule.dieuKien}
                      </div>
                    )}
                    {matchedRule.luuY && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/60 p-1.5 rounded border border-amber-100">
                        <span className="font-bold">Lưu ý nghiệp vụ:</span> {matchedRule.luuY}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-500 italic">
                    Chưa thiết lập quy tắc tự động cho phòng ban {request.tenPhongBan}. Cán bộ điện toán chọn nhóm quyền phù hợp bên dưới.
                  </div>
                )}

                {/* Relevant Regulations */}
                {regulations.length > 0 && (
                  <div className="p-2 bg-white/80 rounded-lg border border-blue-100 text-[11px] space-y-0.5">
                    <div className="font-semibold text-gray-700 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Văn bản căn cứ:</span>
                    </div>
                    <div className="text-gray-800 font-medium">
                      {regulations[0].soVanBan} - {regulations[0].tenVanBan} ({regulations[0].donViBanHanh})
                    </div>
                    {regulations[0].noiDung && (
                      <div className="text-gray-500 italic text-[10px]">"{regulations[0].noiDung}"</div>
                    )}
                  </div>
                )}

                {/* Relevant Warning/ATTT notes */}
                {notes.length > 0 && (
                  <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Cảnh báo ATTT:</span> {notes[0].noiDung}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Execution & Completion Input Form */}
          <div className="space-y-3 pt-1">
            <div className="font-bold text-gray-900 text-xs border-b pb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ghi nhận Kết quả Thực hiện trên Chương trình Nội bộ:</span>
            </div>

            {/* Permission Group Selection */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Nhóm quyền thực tế cấp trên chương trình (*):
              </label>
              {!isCustomGroup ? (
                <div className="space-y-1.5">
                  <select
                    value={selectedGroupCode}
                    onChange={(e) => setSelectedGroupCode(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold bg-white"
                    required
                  >
                    {groups.length > 0 ? (
                      groups.map((g) => (
                        <option key={g.id} value={g.maNhomQuyen}>
                          {g.maNhomQuyen} - {g.tenNhomQuyen} ({g.doiTuongApDung || g.phongBanApDung || 'Chung'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="TPSS_GDV">TPSS_GDV - Giao dịch viên</option>
                        <option value="TPSS_KSV">TPSS_KSV - Kiểm soát viên</option>
                        <option value="CLIMS_CBKHDN">CLIMS_CBKHDN - Cán bộ KHDN</option>
                        <option value="CRLOS_CB">CRLOS_CB - Cán bộ Khởi tạo</option>
                      </>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomGroup(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    + Nhập mã nhóm quyền khác (nếu không có trong danh sách chuẩn)
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customGroupCode}
                    onChange={(e) => setCustomGroupCode(e.target.value)}
                    placeholder="Nhập mã nhóm quyền thực tế..."
                    className="w-full p-2.5 text-xs border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold uppercase font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomGroup(false)}
                    className="text-[11px] text-gray-500 hover:text-gray-700 underline cursor-pointer"
                  >
                    ← Chọn từ danh sách nhóm quyền chuẩn
                  </button>
                </div>
              )}

              {/* Notice if different from suggestion */}
              {isDifferentFromSuggestion && (
                <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>
                    Nhóm quyền bạn chọn (<b>{actualGroupToSubmit}</b>) khác với nhóm quyền gợi ý chuẩn (<b>{matchedRule?.maNhomQuyen}</b>). Hệ thống sẽ ghi nhận vào nhật ký.
                  </span>
                </div>
              )}
            </div>

            {/* Governing Regulation Reference */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Căn cứ văn bản áp dụng:
              </label>
              <input
                type="text"
                value={canCuVanBan}
                onChange={(e) => setCanCuVanBan(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Số văn bản / Quy định áp dụng..."
              />
            </div>

            {/* Execution summary */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Kết quả thực hiện:
              </label>
              <input
                type="text"
                value={ketQuaXuLy}
                onChange={(e) => setKetQuaXuLy(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Nội dung / Ghi chú phân quyền chi tiết:
              </label>
              <textarea
                rows={2}
                value={noiDungXuLy}
                onChange={(e) => setNoiDungXuLy(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ghi chú chi tiết về thao tác trên chương trình nội bộ..."
              />
            </div>

            {/* Date Sync Confirmation */}
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Ngày cấp quyền chính thức ghi nhận:</span>
              </span>
              <span className="font-mono font-bold text-emerald-800 text-xs bg-white px-2 py-0.5 rounded border border-emerald-300">
                {todayStr}
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Đang hoàn thành...' : 'Cập nhật Hoàn thành & Đồng bộ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
