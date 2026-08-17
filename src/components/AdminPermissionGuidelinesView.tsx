import React, { useState, useEffect, useMemo } from 'react';
import {
  ChuongTrinh,
  PhongBan,
  User,
  AppPermissionRule,
  AppPermissionGroup,
  AppRegulation,
  AppNote
} from '../types';
import { api } from '../services/api';
import {
  BookOpen,
  Shield,
  Layers,
  FileText,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  ExternalLink,
  Info,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Lock,
  FileCheck
} from 'lucide-react';

interface AdminPermissionGuidelinesViewProps {
  programs: ChuongTrinh[];
  departments: PhongBan[];
  currentUser: User;
}

export const AdminPermissionGuidelinesView: React.FC<AdminPermissionGuidelinesViewProps> = ({
  programs,
  departments,
  currentUser
}) => {
  const isAdmin = currentUser.chucVu === 'Admin';

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'lookup' | 'rules' | 'groups' | 'regulations' | 'notes'>('lookup');
  const [selectedProgramCode, setSelectedProgramCode] = useState<string>(programs[0]?.maChuongTrinh || 'TPSS');

  // Datasets
  const [rules, setRules] = useState<AppPermissionRule[]>([]);
  const [groups, setGroups] = useState<AppPermissionGroup[]>([]);
  const [regulations, setRegulations] = useState<AppRegulation[]>([]);
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AppPermissionRule | null>(null);

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AppPermissionGroup | null>(null);

  const [regModalOpen, setRegModalOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<AppRegulation | null>(null);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AppNote | null>(null);

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Fetch all reference data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesData, groupsData, regsData, notesData] = await Promise.all([
        api.getPermissionRules(),
        api.getPermissionGroups(),
        api.getRegulations(),
        api.getNotes()
      ]);
      setRules(rulesData);
      setGroups(groupsData);
      setRegulations(regsData);
      setNotes(notesData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải dữ liệu căn cứ & hướng dẫn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const currentProgram = useMemo(() => {
    return programs.find(p => p.maChuongTrinh === selectedProgramCode) || programs[0];
  }, [programs, selectedProgramCode]);

  // Filtered datasets for current lookup
  const programRules = useMemo(() => {
    return rules.filter(r => r.maChuongTrinh === selectedProgramCode);
  }, [rules, selectedProgramCode]);

  const programGroups = useMemo(() => {
    return groups.filter(g => g.maChuongTrinh === selectedProgramCode);
  }, [groups, selectedProgramCode]);

  const programRegulations = useMemo(() => {
    return regulations.filter(r => r.maChuongTrinh === selectedProgramCode);
  }, [regulations, selectedProgramCode]);

  const programNotes = useMemo(() => {
    return notes.filter(n => n.maChuongTrinh === selectedProgramCode);
  }, [notes, selectedProgramCode]);

  // --- CRUD Handlers ---
  const handleSaveRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      maChuongTrinh: formData.get('maChuongTrinh') as string,
      maPhongBan: formData.get('maPhongBan') as string,
      tenPhongBan: departments.find(d => d.maPhongBan === formData.get('maPhongBan'))?.tenPhongBan || (formData.get('maPhongBan') as string),
      doiTuong: formData.get('doiTuong') as string,
      chucVu: formData.get('chucVu') as string,
      maNhomQuyen: formData.get('maNhomQuyen') as string,
      tenNhomQuyen: formData.get('tenNhomQuyen') as string,
      dieuKien: formData.get('dieuKien') as string,
      luuY: formData.get('luuY') as string,
      trangThai: formData.get('trangThai') as any
    };

    try {
      if (editingRule) {
        await api.updatePermissionRule(editingRule.id, payload);
        showNotification('Đã cập nhật quy tắc cấp quyền thành công.');
      } else {
        await api.createPermissionRule(payload);
        showNotification('Đã thêm quy tắc cấp quyền mới.');
      }
      setRuleModalOpen(false);
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi lưu quy tắc', true);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) return;
    try {
      await api.deletePermissionRule(id);
      showNotification('Đã xóa quy tắc cấp quyền.');
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi xóa quy tắc', true);
    }
  };

  const handleSaveGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      maChuongTrinh: formData.get('maChuongTrinh') as string,
      maNhomQuyen: formData.get('maNhomQuyen') as string,
      tenNhomQuyen: formData.get('tenNhomQuyen') as string,
      moTa: formData.get('moTa') as string,
      doiTuongApDung: formData.get('doiTuongApDung') as string,
      phongBanApDung: formData.get('phongBanApDung') as string,
      trangThai: formData.get('trangThai') as any
    };

    try {
      if (editingGroup) {
        await api.updatePermissionGroup(editingGroup.id, payload);
        showNotification('Đã cập nhật nhóm quyền thành công.');
      } else {
        await api.createPermissionGroup(payload);
        showNotification('Đã thêm nhóm quyền mới.');
      }
      setGroupModalOpen(false);
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi lưu nhóm quyền', true);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhóm quyền này?')) return;
    try {
      await api.deletePermissionGroup(id);
      showNotification('Đã xóa nhóm quyền.');
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi xóa nhóm quyền', true);
    }
  };

  const handleSaveRegulation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      maChuongTrinh: formData.get('maChuongTrinh') as string,
      tenChuongTrinh: programs.find(p => p.maChuongTrinh === formData.get('maChuongTrinh'))?.tenChuongTrinh || (formData.get('maChuongTrinh') as string),
      soVanBan: formData.get('soVanBan') as string,
      tenVanBan: formData.get('tenVanBan') as string,
      ngayBanHanh: formData.get('ngayBanHanh') as string,
      ngayHieuLuc: formData.get('ngayHieuLuc') as string,
      donViBanHanh: formData.get('donViBanHanh') as string,
      noiDung: formData.get('noiDung') as string,
      trangThai: formData.get('trangThai') as any,
      ghiChu: formData.get('ghiChu') as string,
      linkVanBan: formData.get('linkVanBan') as string
    };

    try {
      if (editingReg) {
        await api.updateRegulation(editingReg.id, payload);
        showNotification('Đã cập nhật văn bản căn cứ thành công.');
      } else {
        await api.createRegulation(payload);
        showNotification('Đã thêm văn bản căn cứ mới.');
      }
      setRegModalOpen(false);
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi lưu văn bản', true);
    }
  };

  const handleDeleteRegulation = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa văn bản này?')) return;
    try {
      await api.deleteRegulation(id);
      showNotification('Đã xóa văn bản căn cứ.');
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi xóa văn bản', true);
    }
  };

  const handleSaveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      maChuongTrinh: formData.get('maChuongTrinh') as string,
      loaiLuuY: formData.get('loaiLuuY') as any,
      noiDung: formData.get('noiDung') as string,
      dieuKienApDung: formData.get('dieuKienApDung') as string,
      trangThai: formData.get('trangThai') as any
    };

    try {
      if (editingNote) {
        await api.updateNote(editingNote.id, payload);
        showNotification('Đã cập nhật lưu ý thành công.');
      } else {
        await api.createNote(payload);
        showNotification('Đã thêm lưu ý mới.');
      }
      setNoteModalOpen(false);
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi lưu lưu ý', true);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lưu ý này?')) return;
    try {
      await api.deleteNote(id);
      showNotification('Đã xóa lưu ý.');
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi xóa lưu ý', true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#004F9E]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Căn cứ & Hướng dẫn Cấp quyền Chương trình Ứng dụng
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
              Module V1.2
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cơ sở tham khảo nghiệp vụ chuẩn hóa cho Cán bộ Điện toán & Quản trị viên khi xử lý đề nghị cấp quyền trên các chương trình nội bộ VietinBank.
          </p>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 animate-fade-in font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 shadow-sm flex flex-wrap gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('lookup')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeSubTab === 'lookup'
              ? 'bg-[#004F9E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Tra cứu Tổng quan Chương trình</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeSubTab === 'rules'
              ? 'bg-[#004F9E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Quy tắc Cấp quyền ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('groups')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeSubTab === 'groups'
              ? 'bg-[#004F9E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Danh mục Nhóm quyền ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('regulations')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeSubTab === 'regulations'
              ? 'bg-[#004F9E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Văn bản Căn cứ ({regulations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeSubTab === 'notes'
              ? 'bg-[#004F9E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Lưu ý & Hướng dẫn ({notes.length})</span>
        </button>
      </div>

      {/* --- TAB 1: TRA CỨU TỔNG QUAN THEO CHƯƠNG TRÌNH --- */}
      {activeSubTab === 'lookup' && (
        <div className="space-y-4">
          {/* Program Selector Pills */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#004F9E]" />
              <span>Chọn chương trình ứng dụng cần tra cứu:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {programs.map((p) => {
                const isSelected = p.maChuongTrinh === selectedProgramCode;
                const pRulesCount = rules.filter(r => r.maChuongTrinh === p.maChuongTrinh).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProgramCode(p.maChuongTrinh)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#004F9E] border-[#004F9E] text-white shadow-sm ring-2 ring-blue-200'
                        : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100 hover:border-gray-300'
                    }`}
                  >
                    <span>{p.maChuongTrinh}</span>
                    <span className="font-normal opacity-85">({p.tenChuongTrinh})</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {pRulesCount} quy tắc
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Program Details Container */}
          {currentProgram && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Program Info & Regulations */}
              <div className="space-y-4 lg:col-span-1">
                {/* General Info Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 bg-blue-50 text-[#004F9E] rounded font-mono font-bold text-sm">
                        {currentProgram.maChuongTrinh}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm">{currentProgram.tenChuongTrinh}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {currentProgram.trangThai}
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-gray-700">
                    <div>
                      <span className="text-gray-500 font-medium">Phạm vi áp dụng:</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{currentProgram.phamVi || 'Toàn chi nhánh theo phân công'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Mô tả nghiệp vụ:</span>
                      <p className="text-gray-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-gray-100">
                        {currentProgram.moTaNghiepVu || currentProgram.moTa || 'Chương trình ứng dụng cốt lõi của ngân hàng.'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Nhóm quyền mặc định:</span>
                      <p className="font-mono text-blue-700 font-semibold mt-0.5">{currentProgram.nhomQuyenMacDinh || 'Theo cấu hình chức danh'}</p>
                    </div>
                  </div>
                </div>

                {/* Regulations for this Program */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-2 font-bold text-gray-900 text-xs">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Văn bản Quy định Căn cứ</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {programRegulations.length} VB
                    </span>
                  </div>

                  {programRegulations.length === 0 ? (
                    <div className="text-xs text-gray-400 py-3 text-center italic">
                      Chưa có văn bản căn cứ được gắn cho chương trình này.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {programRegulations.map(reg => (
                        <div key={reg.id} className="p-2.5 bg-slate-50 rounded-lg border border-gray-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#004F9E]">{reg.soVanBan}</span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              {reg.trangThai}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-800 text-[11px] leading-snug">{reg.tenVanBan}</div>
                          <div className="text-[10px] text-gray-500 flex items-center justify-between">
                            <span>Ban hành: {reg.ngayBanHanh || 'N/A'}</span>
                            <span>Đơn vị: {reg.donViBanHanh}</span>
                          </div>
                          {reg.noiDung && (
                            <p className="text-[11px] text-gray-600 italic bg-white p-1.5 rounded border border-gray-100 mt-1">
                              "{reg.noiDung}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Important Notes & Warnings */}
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-sm space-y-2.5">
                  <div className="flex items-center space-x-2 font-bold text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Lưu ý Quan trọng & Cảnh báo ATTT</span>
                  </div>
                  {programNotes.length === 0 ? (
                    <p className="text-xs text-amber-800">
                      Thực hiện cấp quyền đúng theo phân công nhiệm vụ và biên bản phê duyệt của Lãnh đạo phòng.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {programNotes.map(n => (
                        <div key={n.id} className="p-2 bg-white rounded border border-amber-200 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase text-[9px]">
                              {n.loaiLuuY}
                            </span>
                            {n.dieuKienApDung && <span className="text-gray-600 font-normal">({n.dieuKienApDung})</span>}
                          </div>
                          <p className="text-gray-700 leading-relaxed text-[11px]">{n.noiDung}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Permission Matrix & Groups for this program */}
              <div className="space-y-4 lg:col-span-2">
                {/* Rules by Department Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-3.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-[#004F9E]" />
                      <h4 className="font-bold text-gray-900 text-xs">
                        Quy tắc Phân quyền theo Phòng ban & Chức danh [{currentProgram.maChuongTrinh}]
                      </h4>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setEditingRule(null);
                          setRuleModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 bg-[#004F9E] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow hover:bg-[#003B77] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm quy tắc</span>
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                          <th className="py-2.5 px-3">Phòng ban</th>
                          <th className="py-2.5 px-3">Đối tượng / Chức vụ</th>
                          <th className="py-2.5 px-3">Nhóm quyền chuẩn</th>
                          <th className="py-2.5 px-3">Điều kiện & Căn cứ</th>
                          <th className="py-2.5 px-3">Lưu ý nghiệp vụ</th>
                          {isAdmin && <th className="py-2.5 px-2 text-right">Thao tác</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {programRules.length === 0 ? (
                          <tr>
                            <td colSpan={isAdmin ? 6 : 5} className="py-6 text-center text-gray-400 italic">
                              Chưa có quy tắc cấp quyền nào cho chương trình {currentProgram.maChuongTrinh}.
                            </td>
                          </tr>
                        ) : (
                          programRules.map((r) => (
                            <tr key={r.id} className="hover:bg-blue-50/30 transition">
                              <td className="py-2.5 px-3 font-semibold text-gray-800">
                                <span className="font-mono text-gray-500 mr-1">[{r.maPhongBan}]</span>
                                {r.tenPhongBan}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-gray-900">{r.doiTuong}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                                <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {r.maNhomQuyen}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-gray-600 text-[11px]">{r.dieuKien || '-'}</td>
                              <td className="py-2.5 px-3 text-gray-500 text-[11px]">{r.luuY || '-'}</td>
                              {isAdmin && (
                                <td className="py-2.5 px-2 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setEditingRule(r);
                                      setRuleModalOpen(true);
                                    }}
                                    className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 mr-1"
                                    title="Sửa"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRule(r.id)}
                                    className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Available Permission Groups Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-3.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <h4 className="font-bold text-gray-900 text-xs">
                        Danh mục Nhóm quyền Chức năng [{currentProgram.maChuongTrinh}]
                      </h4>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setEditingGroup(null);
                          setGroupModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 bg-purple-600 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow hover:bg-purple-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm nhóm quyền</span>
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                          <th className="py-2.5 px-3">Mã nhóm quyền</th>
                          <th className="py-2.5 px-3">Tên nhóm quyền / Mô tả chức năng</th>
                          <th className="py-2.5 px-3">Đối tượng áp dụng</th>
                          <th className="py-2.5 px-3">Phòng ban</th>
                          <th className="py-2.5 px-3">Trạng thái</th>
                          {isAdmin && <th className="py-2.5 px-2 text-right">Thao tác</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {programGroups.length === 0 ? (
                          <tr>
                            <td colSpan={isAdmin ? 6 : 5} className="py-6 text-center text-gray-400 italic">
                              Chưa có nhóm quyền nào được khai báo cho chương trình {currentProgram.maChuongTrinh}.
                            </td>
                          </tr>
                        ) : (
                          programGroups.map((g) => (
                            <tr key={g.id} className="hover:bg-purple-50/30 transition">
                              <td className="py-2.5 px-3 font-mono font-bold text-purple-800">
                                {g.maNhomQuyen}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-gray-800">
                                <div>{g.tenNhomQuyen}</div>
                                {g.moTa && <div className="text-[11px] text-gray-500 mt-0.5">{g.moTa}</div>}
                              </td>
                              <td className="py-2.5 px-3 text-gray-700 text-[11px]">{g.doiTuongApDung || '-'}</td>
                              <td className="py-2.5 px-3 text-gray-600 text-[11px]">{g.phongBanApDung || '-'}</td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.trangThai === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                                  {g.trangThai}
                                </span>
                              </td>
                              {isAdmin && (
                                <td className="py-2.5 px-2 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setEditingGroup(g);
                                      setGroupModalOpen(true);
                                    }}
                                    className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 mr-1"
                                    title="Sửa"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGroup(g.id)}
                                    className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: QUẢN LÝ TẤT CẢ QUY TẮC CẤP QUYỀN (ADMIN / ALL) --- */}
      {activeSubTab === 'rules' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#004F9E]" />
              <h3 className="text-sm font-bold text-gray-900">
                Toàn bộ Quy tắc Cấp quyền Toàn hệ thống (Sheet APP_PERMISSION_RULES)
              </h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingRule(null);
                  setRuleModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-[#004F9E] hover:bg-[#003B77] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Quy tắc Cấp quyền</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                  <th className="py-2.5 px-3">Chương trình</th>
                  <th className="py-2.5 px-3">Phòng ban</th>
                  <th className="py-2.5 px-3">Đối tượng / Chức vụ</th>
                  <th className="py-2.5 px-3">Mã nhóm quyền</th>
                  <th className="py-2.5 px-3">Tên nhóm quyền</th>
                  <th className="py-2.5 px-3">Điều kiện áp dụng</th>
                  <th className="py-2.5 px-3">Lưu ý</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  {isAdmin && <th className="py-2.5 px-2 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rules.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#004F9E]">{r.maChuongTrinh}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-800">{r.tenPhongBan}</td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{r.doiTuong}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{r.maNhomQuyen}</td>
                    <td className="py-2.5 px-3 text-gray-700">{r.tenNhomQuyen}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px]">{r.dieuKien || '-'}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-[11px]">{r.luuY || '-'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.trangThai === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                        {r.trangThai}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingRule(r);
                            setRuleModalOpen(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 mr-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(r.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: QUẢN LÝ TẤT CẢ NHÓM QUYỀN (ADMIN / ALL) --- */}
      {activeSubTab === 'groups' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Toàn bộ Danh mục Nhóm quyền Chức năng (Sheet APP_PERMISSION_GROUPS)
              </h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingGroup(null);
                  setGroupModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Nhóm quyền</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                  <th className="py-2.5 px-3">Chương trình</th>
                  <th className="py-2.5 px-3">Mã nhóm quyền</th>
                  <th className="py-2.5 px-3">Tên nhóm quyền</th>
                  <th className="py-2.5 px-3">Mô tả chức năng</th>
                  <th className="py-2.5 px-3">Đối tượng áp dụng</th>
                  <th className="py-2.5 px-3">Phòng ban áp dụng</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  {isAdmin && <th className="py-2.5 px-2 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {groups.map(g => (
                  <tr key={g.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#004F9E]">{g.maChuongTrinh}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-700">{g.maNhomQuyen}</td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{g.tenNhomQuyen}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px]">{g.moTa || '-'}</td>
                    <td className="py-2.5 px-3 text-gray-700 text-[11px]">{g.doiTuongApDung || '-'}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px]">{g.phongBanApDung || '-'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.trangThai === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                        {g.trangThai}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingGroup(g);
                            setGroupModalOpen(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 mr-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(g.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: QUẢN LÝ VĂN BẢN CĂN CỨ (ADMIN / ALL) --- */}
      {activeSubTab === 'regulations' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Toàn bộ Văn bản Quy định Căn cứ (Sheet APP_REGULATIONS)
              </h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingReg(null);
                  setRegModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Văn bản Căn cứ</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                  <th className="py-2.5 px-3">Chương trình</th>
                  <th className="py-2.5 px-3">Số văn bản</th>
                  <th className="py-2.5 px-3">Tên văn bản quy định</th>
                  <th className="py-2.5 px-3">Ban hành</th>
                  <th className="py-2.5 px-3">Đơn vị ban hành</th>
                  <th className="py-2.5 px-3">Trích yếu nội dung</th>
                  <th className="py-2.5 px-3">Hiệu lực</th>
                  {isAdmin && <th className="py-2.5 px-2 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regulations.map(reg => (
                  <tr key={reg.id} className="hover:bg-emerald-50/30 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#004F9E]">{reg.maChuongTrinh}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{reg.soVanBan}</td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{reg.tenVanBan}</td>
                    <td className="py-2.5 px-3 text-gray-600">{reg.ngayBanHanh || '-'}</td>
                    <td className="py-2.5 px-3 text-gray-700">{reg.donViBanHanh}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px] max-w-xs">{reg.noiDung || '-'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${reg.trangThai === 'Còn hiệu lực' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                        {reg.trangThai}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingReg(reg);
                            setRegModalOpen(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 mr-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRegulation(reg.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 5: QUẢN LÝ LƯU Ý & HƯỚNG DẪN (ADMIN / ALL) --- */}
      {activeSubTab === 'notes' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Toàn bộ Lưu ý & Hướng dẫn Cấp quyền (Sheet APP_NOTES)
              </h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingNote(null);
                  setNoteModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Lưu ý / Hướng dẫn</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                  <th className="py-2.5 px-3">Chương trình</th>
                  <th className="py-2.5 px-3">Loại lưu ý</th>
                  <th className="py-2.5 px-3">Nội dung hướng dẫn & Lưu ý</th>
                  <th className="py-2.5 px-3">Điều kiện áp dụng</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  {isAdmin && <th className="py-2.5 px-2 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notes.map(n => (
                  <tr key={n.id} className="hover:bg-amber-50/30 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#004F9E]">{n.maChuongTrinh}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        n.loaiLuuY === 'Cảnh báo ATTT'
                          ? 'bg-red-100 text-red-800'
                          : n.loaiLuuY === 'Đặc thù'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {n.loaiLuuY}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-800 leading-relaxed">{n.noiDung}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-[11px]">{n.dieuKienApDung || '-'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.trangThai === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                        {n.trangThai}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingNote(n);
                            setNoteModalOpen(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 mr-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT / CREATE RULE --- */}
      {ruleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 text-xs">
            <div className="p-4 bg-[#004F9E] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingRule ? 'Chỉnh sửa Quy tắc Cấp quyền' : 'Thêm Quy tắc Cấp quyền Mới'}
              </h3>
              <button onClick={() => setRuleModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRule} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Chương trình (*)</label>
                  <select
                    name="maChuongTrinh"
                    defaultValue={editingRule?.maChuongTrinh || selectedProgramCode}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.maChuongTrinh}>{p.maChuongTrinh} - {p.tenChuongTrinh}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Phòng ban (*)</label>
                  <select
                    name="maPhongBan"
                    defaultValue={editingRule?.maPhongBan || departments[0]?.maPhongBan}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.maPhongBan}>{d.maPhongBan} - {d.tenPhongBan}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Đối tượng / Vị trí (*)</label>
                  <input
                    type="text"
                    name="doiTuong"
                    defaultValue={editingRule?.doiTuong || ''}
                    placeholder="VD: Cán bộ KHDN / Giao dịch viên"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Chức vụ</label>
                  <input
                    type="text"
                    name="chucVu"
                    defaultValue={editingRule?.chucVu || ''}
                    placeholder="VD: Cán bộ / Lãnh đạo"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mã nhóm quyền (*)</label>
                  <input
                    type="text"
                    name="maNhomQuyen"
                    defaultValue={editingRule?.maNhomQuyen || ''}
                    placeholder="VD: TPSS_GDV"
                    className="w-full p-2 border rounded-lg font-mono font-bold text-blue-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tên nhóm quyền</label>
                  <input
                    type="text"
                    name="tenNhomQuyen"
                    defaultValue={editingRule?.tenNhomQuyen || ''}
                    placeholder="VD: Giao dịch viên TPSS"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Điều kiện áp dụng</label>
                <input
                  type="text"
                  name="dieuKien"
                  defaultValue={editingRule?.dieuKien || ''}
                  placeholder="VD: Áp dụng khi có quyết định phân công giao dịch tại quầy"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Lưu ý nghiệp vụ</label>
                <textarea
                  name="luuY"
                  rows={2}
                  defaultValue={editingRule?.luuY || ''}
                  placeholder="VD: Không cấp đồng thời quyền Kiểm soát viên"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Trạng thái</label>
                <select name="trangThai" defaultValue={editingRule?.trangThai || 'Hoạt động'} className="w-full p-2 border rounded-lg">
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRuleModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004F9E] hover:bg-[#003B77] text-white rounded-lg font-bold shadow"
                >
                  Lưu Quy tắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT / CREATE GROUP --- */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 text-xs">
            <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingGroup ? 'Chỉnh sửa Nhóm quyền' : 'Thêm Nhóm quyền Mới'}
              </h3>
              <button onClick={() => setGroupModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGroup} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Chương trình (*)</label>
                  <select
                    name="maChuongTrinh"
                    defaultValue={editingGroup?.maChuongTrinh || selectedProgramCode}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.maChuongTrinh}>{p.maChuongTrinh} - {p.tenChuongTrinh}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mã nhóm quyền (*)</label>
                  <input
                    type="text"
                    name="maNhomQuyen"
                    defaultValue={editingGroup?.maNhomQuyen || ''}
                    placeholder="VD: CLIMS_CBKHDN"
                    className="w-full p-2 border rounded-lg font-mono font-bold text-purple-700 uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tên nhóm quyền (*)</label>
                <input
                  type="text"
                  name="tenNhomQuyen"
                  defaultValue={editingGroup?.tenNhomQuyen || ''}
                  placeholder="VD: Cán bộ KHDN khởi tạo hồ sơ"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả chức năng</label>
                <textarea
                  name="moTa"
                  rows={2}
                  defaultValue={editingGroup?.moTa || ''}
                  placeholder="Mô tả các menu, tính năng thực hiện trong nhóm quyền..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Đối tượng áp dụng</label>
                  <input
                    type="text"
                    name="doiTuongApDung"
                    defaultValue={editingGroup?.doiTuongApDung || ''}
                    placeholder="VD: Cán bộ QHKH"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Phòng ban áp dụng</label>
                  <input
                    type="text"
                    name="phongBanApDung"
                    defaultValue={editingGroup?.phongBanApDung || ''}
                    placeholder="VD: P.KHDN, P.KHBL"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Trạng thái</label>
                <select name="trangThai" defaultValue={editingGroup?.trangThai || 'Hoạt động'} className="w-full p-2 border rounded-lg">
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow"
                >
                  Lưu Nhóm quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT / CREATE REGULATION --- */}
      {regModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 text-xs">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingReg ? 'Chỉnh sửa Văn bản Căn cứ' : 'Thêm Văn bản Căn cứ Mới'}
              </h3>
              <button onClick={() => setRegModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRegulation} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Chương trình (*)</label>
                  <select
                    name="maChuongTrinh"
                    defaultValue={editingReg?.maChuongTrinh || selectedProgramCode}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.maChuongTrinh}>{p.maChuongTrinh} - {p.tenChuongTrinh}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số văn bản (*)</label>
                  <input
                    type="text"
                    name="soVanBan"
                    defaultValue={editingReg?.soVanBan || ''}
                    placeholder="VD: 128/QĐ-TGĐ-NHCT1"
                    className="w-full p-2 border rounded-lg font-bold text-emerald-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Tên văn bản quy định (*)</label>
                <input
                  type="text"
                  name="tenVanBan"
                  defaultValue={editingReg?.tenVanBan || ''}
                  placeholder="VD: Quy định về phân quyền và quản lý tài khoản người dùng"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Ngày ban hành</label>
                  <input
                    type="text"
                    name="ngayBanHanh"
                    defaultValue={editingReg?.ngayBanHanh || ''}
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Đơn vị ban hành</label>
                  <input
                    type="text"
                    name="donViBanHanh"
                    defaultValue={editingReg?.donViBanHanh || 'VietinBank Trụ sở chính'}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Trích yếu nội dung quy định</label>
                <textarea
                  name="noiDung"
                  rows={2}
                  defaultValue={editingReg?.noiDung || ''}
                  placeholder="Trích dẫn điều khoản quy định đối tượng được cấp quyền..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Link văn bản / E-Office</label>
                  <input
                    type="text"
                    name="linkVanBan"
                    defaultValue={editingReg?.linkVanBan || ''}
                    placeholder="https://eoffice.vietinbank.vn/..."
                    className="w-full p-2 border rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Trạng thái hiệu lực</label>
                  <select name="trangThai" defaultValue={editingReg?.trangThai || 'Còn hiệu lực'} className="w-full p-2 border rounded-lg">
                    <option value="Còn hiệu lực">Còn hiệu lực</option>
                    <option value="Hết hiệu lực">Hết hiệu lực</option>
                    <option value="Thay thế">Thay thế</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRegModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow"
                >
                  Lưu Văn bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT / CREATE NOTE --- */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 text-xs">
            <div className="p-4 bg-amber-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingNote ? 'Chỉnh sửa Lưu ý / Hướng dẫn' : 'Thêm Lưu ý / Hướng dẫn Mới'}
              </h3>
              <button onClick={() => setNoteModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNote} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Chương trình (*)</label>
                  <select
                    name="maChuongTrinh"
                    defaultValue={editingNote?.maChuongTrinh || selectedProgramCode}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.maChuongTrinh}>{p.maChuongTrinh} - {p.tenChuongTrinh}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Loại lưu ý (*)</label>
                  <select name="loaiLuuY" defaultValue={editingNote?.loaiLuuY || 'Lưu ý'} className="w-full p-2 border rounded-lg" required>
                    <option value="Lưu ý">Lưu ý</option>
                    <option value="Cảnh báo ATTT">Cảnh báo ATTT</option>
                    <option value="Đặc thù">Đặc thù</option>
                    <option value="Hướng dẫn">Hướng dẫn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Nội dung hướng dẫn & Lưu ý (*)</label>
                <textarea
                  name="noiDung"
                  rows={3}
                  defaultValue={editingNote?.noiDung || ''}
                  placeholder="Nhập nội dung lưu ý chi tiết..."
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Điều kiện áp dụng</label>
                <input
                  type="text"
                  name="dieuKienApDung"
                  defaultValue={editingNote?.dieuKienApDung || ''}
                  placeholder="VD: Khi chuyển chi nhánh hoặc kiêm nhiệm"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Trạng thái</label>
                <select name="trangThai" defaultValue={editingNote?.trangThai || 'Hoạt động'} className="w-full p-2 border rounded-lg">
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow"
                >
                  Lưu Lưu ý
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
