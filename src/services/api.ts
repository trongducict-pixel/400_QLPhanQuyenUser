import {
  User,
  CanBo,
  PhongBan,
  ChuongTrinh,
  RequestRecord,
  SummaryUserMatrixRow,
  AuditLog,
  NotificationItem,
  SystemConfig,
  ApiResponse,
  RequestType,
  UserRole,
  AppPermissionRule,
  AppPermissionGroup,
  AppRegulation,
  AppNote,
  ApprovalHistory,
  ProcessingHistory
} from '../types';
import {
  initialConfig,
  initialDepartments,
  initialPrograms,
  initialUsers,
  initialCanBo,
  initialRequests,
  initialApprovals,
  initialProcessing,
  initialAuditLogs,
  initialEmails,
  initialPermissionRules,
  initialPermissionGroups,
  initialRegulations,
  initialNotes
} from '../data/initialData';
import { gasSyncService } from './gasSyncService';

export const CURRENT_USER_STORAGE_KEY = 'vtb_nb_current_user';

export function getStoredUser(): User | null {
  const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (!stored) {
    // Default fallback to first user (e.g. quynhntp - Cán bộ P001)
    const defaultUser = initialUsers[0] || null;
    if (defaultUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(defaultUser));
    }
    return defaultUser;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
}

// Local Storage Keys for Client-side Fallback & Offline Persistence
const DB_VERSION = 'v2';
const DB_KEYS = {
  CONFIG: `vtb_db_${DB_VERSION}_config`,
  DEPTS: `vtb_db_${DB_VERSION}_depts`,
  PROGRAMS: `vtb_db_${DB_VERSION}_progs`,
  USERS: `vtb_db_${DB_VERSION}_users`,
  STAFF: `vtb_db_${DB_VERSION}_staff`,
  REQUESTS: `vtb_db_${DB_VERSION}_requests`,
  APPROVALS: `vtb_db_${DB_VERSION}_approvals`,
  PROCESSING: `vtb_db_${DB_VERSION}_processing`,
  LOGS: `vtb_db_${DB_VERSION}_logs`,
  EMAILS: `vtb_db_${DB_VERSION}_emails`,
  RULES: `vtb_db_${DB_VERSION}_rules`,
  GROUPS: `vtb_db_${DB_VERSION}_groups`,
  REGS: `vtb_db_${DB_VERSION}_regs`,
  NOTES: `vtb_db_${DB_VERSION}_notes`
};

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore storage full or quota errors
  }
}

// Client Fallback Store Engine
class ClientStore {
  getConfig(): SystemConfig {
    return getLocal<SystemConfig>(DB_KEYS.CONFIG, initialConfig);
  }

  saveConfig(conf: Partial<SystemConfig>): SystemConfig {
    const current = this.getConfig();
    const updated = { ...current, ...conf };
    setLocal(DB_KEYS.CONFIG, updated);
    return updated;
  }

  getDepartments(): PhongBan[] {
    return getLocal<PhongBan[]>(DB_KEYS.DEPTS, initialDepartments);
  }

  saveDepartment(dept: Partial<PhongBan>): PhongBan {
    const list = this.getDepartments();
    const existingIndex = list.findIndex(d => d.id === dept.id || d.maPhongBan === dept.maPhongBan);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...dept };
      setLocal(DB_KEYS.DEPTS, list);
      return list[existingIndex];
    }
    const newDept: PhongBan = {
      id: `dept-${Date.now()}`,
      maPhongBan: (dept.maPhongBan || '').toUpperCase().trim(),
      tenPhongBan: dept.tenPhongBan?.trim() || '',
      moTa: dept.moTa || '',
      trangThai: dept.trangThai || 'Hoạt động'
    };
    list.push(newDept);
    setLocal(DB_KEYS.DEPTS, list);
    return newDept;
  }

  getPrograms(): ChuongTrinh[] {
    return getLocal<ChuongTrinh[]>(DB_KEYS.PROGRAMS, initialPrograms);
  }

  saveProgram(prog: Partial<ChuongTrinh>): ChuongTrinh {
    const list = this.getPrograms();
    const existingIndex = list.findIndex(p => p.id === prog.id || p.maChuongTrinh === prog.maChuongTrinh);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...prog };
      setLocal(DB_KEYS.PROGRAMS, list);
      return list[existingIndex];
    }
    const newProg: ChuongTrinh = {
      id: `prog-${Date.now()}`,
      maChuongTrinh: (prog.maChuongTrinh || '').toUpperCase().trim(),
      tenChuongTrinh: prog.tenChuongTrinh?.trim() || '',
      moTa: prog.moTa || '',
      phamVi: prog.phamVi || '',
      moTaNghiepVu: prog.moTaNghiepVu || '',
      ghiChuChung: prog.ghiChuChung || '',
      nhomQuyenMacDinh: prog.nhomQuyenMacDinh || '',
      trangThai: prog.trangThai || 'Hoạt động'
    };
    list.push(newProg);
    setLocal(DB_KEYS.PROGRAMS, list);
    return newProg;
  }

  getUsers(): User[] {
    return getLocal<User[]>(DB_KEYS.USERS, initialUsers);
  }

  saveUser(user: Partial<User>): User {
    const list = this.getUsers();
    const existingIndex = list.findIndex(u => u.id === user.id || u.userAD === user.userAD);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...user };
      setLocal(DB_KEYS.USERS, list);
      return list[existingIndex];
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      maUserAD: user.maUserAD || `U-${Date.now()}`,
      hoTen: user.hoTen || '',
      userAD: (user.userAD || '').toLowerCase().trim(),
      maPhongBan: user.maPhongBan || 'P001',
      tenPhongBan: user.tenPhongBan || '',
      chucVu: user.chucVu || 'Cán bộ',
      trangThai: user.trangThai || 'Hoạt động',
      matKhau: '123456',
      email: user.email || `${user.userAD}@vietinbank.vn`,
      soDienThoai: user.soDienThoai || ''
    };
    list.push(newUser);
    setLocal(DB_KEYS.USERS, list);
    return newUser;
  }

  getStaff(): CanBo[] {
    return getLocal<CanBo[]>(DB_KEYS.STAFF, initialCanBo);
  }

  saveStaff(staff: Partial<CanBo>): CanBo {
    const list = this.getStaff();
    const existingIndex = list.findIndex(s => s.id === staff.id || s.maCanBo === staff.maCanBo);
    const cleanUserAD = (staff.userAD || '').toLowerCase().trim();
    const hasAccount = !!cleanUserAD;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    if (existingIndex >= 0) {
      list[existingIndex] = {
        ...list[existingIndex],
        ...staff,
        userAD: cleanUserAD || list[existingIndex].userAD,
        hasAccount: hasAccount || list[existingIndex].hasAccount
      };
      setLocal(DB_KEYS.STAFF, list);

      // Sync with user
      if (list[existingIndex].userAD) {
        this.saveUser({
          userAD: list[existingIndex].userAD,
          hoTen: list[existingIndex].hoTen,
          maPhongBan: list[existingIndex].maPhongBan,
          tenPhongBan: list[existingIndex].tenPhongBan,
          chucVu: list[existingIndex].vaiTro || 'Cán bộ',
          matKhau: list[existingIndex].matKhau || '123456',
          email: list[existingIndex].email,
          soDienThoai: list[existingIndex].soDienThoai
        });
      }
      return list[existingIndex];
    }

    const newStaff: CanBo = {
      id: `cb-${Date.now()}`,
      maCanBo: staff.maCanBo || `CB-${Date.now()}`,
      hoTen: staff.hoTen || '',
      maUserAD: staff.maUserAD || (cleanUserAD ? `AD_042_${String(list.length + 1).padStart(3, '0')}` : ''),
      userAD: cleanUserAD,
      matKhau: staff.matKhau || (cleanUserAD ? '123456' : ''),
      email: staff.email || (cleanUserAD ? `${cleanUserAD}@vietinbank.vn` : ''),
      soDienThoai: staff.soDienThoai || '',
      vaiTro: staff.vaiTro || 'Cán bộ',
      maPhongBan: staff.maPhongBan || 'P001',
      tenPhongBan: staff.tenPhongBan || '',
      chucVu: staff.chucVu || 'Cán bộ',
      trangThai: staff.trangThai || 'Đang làm việc',
      hasAccount,
      ngayCapTaiKhoan: hasAccount ? formattedDate : undefined
    };

    list.push(newStaff);
    setLocal(DB_KEYS.STAFF, list);

    if (cleanUserAD) {
      this.saveUser({
        maUserAD: newStaff.maUserAD,
        userAD: cleanUserAD,
        hoTen: newStaff.hoTen,
        maPhongBan: newStaff.maPhongBan,
        tenPhongBan: newStaff.tenPhongBan,
        chucVu: newStaff.vaiTro || 'Cán bộ',
        matKhau: newStaff.matKhau || '123456',
        email: newStaff.email,
        soDienThoai: newStaff.soDienThoai
      });
    }

    return newStaff;
  }

  resetStaffPassword(staffId: string, newPassword?: string): { success: boolean; message: string; newPassword: string; data: CanBo } {
    const list = this.getStaff();
    const staff = list.find(s => s.id === staffId || s.maCanBo === staffId);
    if (!staff) throw new Error('Không tìm thấy cán bộ');

    const finalPass = newPassword && newPassword.trim() ? newPassword.trim() : '123456';
    staff.matKhau = finalPass;
    setLocal(DB_KEYS.STAFF, list);

    if (staff.userAD) {
      const users = this.getUsers();
      const u = users.find(user => user.userAD.toLowerCase() === staff.userAD.toLowerCase());
      if (u) {
        u.matKhau = finalPass;
        setLocal(DB_KEYS.USERS, users);
      }
    }

    return {
      success: true,
      message: `Đã Reset mật khẩu cho cán bộ ${staff.hoTen} (${staff.userAD}) thành công.`,
      newPassword: finalPass,
      data: staff
    };
  }

  createStaffAccount(staffId: string, payload: { userAD: string; matKhau?: string; vaiTro?: UserRole; email?: string; soDienThoai?: string; maUserAD?: string }): { success: boolean; message: string; data: CanBo } {
    const list = this.getStaff();
    const staff = list.find(s => s.id === staffId || s.maCanBo === staffId);
    if (!staff) throw new Error('Không tìm thấy cán bộ');

    const cleanUserAD = payload.userAD.trim().toLowerCase();
    const finalPass = payload.matKhau && payload.matKhau.trim() ? payload.matKhau.trim() : '123456';
    const finalRole = payload.vaiTro || 'Cán bộ';
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    staff.userAD = cleanUserAD;
    staff.maUserAD = payload.maUserAD || staff.maUserAD || `AD_042_${String(list.length + 1).padStart(3, '0')}`;
    staff.matKhau = finalPass;
    staff.vaiTro = finalRole;
    staff.email = payload.email || `${cleanUserAD}@vietinbank.vn`;
    if (payload.soDienThoai) staff.soDienThoai = payload.soDienThoai.trim();
    staff.hasAccount = true;
    staff.ngayCapTaiKhoan = formattedDate;

    setLocal(DB_KEYS.STAFF, list);

    this.saveUser({
      maUserAD: staff.maUserAD,
      userAD: cleanUserAD,
      hoTen: staff.hoTen,
      maPhongBan: staff.maPhongBan,
      tenPhongBan: staff.tenPhongBan,
      chucVu: finalRole,
      matKhau: finalPass,
      email: staff.email,
      soDienThoai: staff.soDienThoai
    });

    return {
      success: true,
      message: `Đã cấp tài khoản User AD [${cleanUserAD}] cho cán bộ ${staff.hoTen} thành công.`,
      data: staff
    };
  }

  resetUserPassword(userId: string, newPassword?: string): { success: boolean; message: string; newPassword: string; data: User } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId || u.userAD === userId);
    if (!user) throw new Error('Không tìm thấy người dùng');

    const finalPass = newPassword && newPassword.trim() ? newPassword.trim() : '123456';
    user.matKhau = finalPass;
    setLocal(DB_KEYS.USERS, users);

    const staffList = this.getStaff();
    const staff = staffList.find(s => s.userAD && s.userAD.toLowerCase() === user.userAD.toLowerCase());
    if (staff) {
      staff.matKhau = finalPass;
      setLocal(DB_KEYS.STAFF, staffList);
    }

    return {
      success: true,
      message: `Đã Reset mật khẩu cho User ${user.userAD} thành công.`,
      newPassword: finalPass,
      data: user
    };
  }

  getRequests(currentUser: User | null): RequestRecord[] {
    const all = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);
    if (!currentUser) return all;
    if (currentUser.chucVu === 'Cán bộ') {
      return all.filter(r => r.userAD === currentUser.userAD || r.maUserAD === currentUser.maUserAD);
    }
    if (currentUser.chucVu === 'Lãnh đạo phòng') {
      return all.filter(r => r.maPhongBan === currentUser.maPhongBan);
    }
    return all;
  }

  createRequest(currentUser: User, payload: {
    maChuongTrinh: string;
    loaiDeNghi: RequestType;
    soQDTuyenDung_PhanCong: string;
    noiDung: string;
  }): RequestRecord {
    const all = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);
    const progs = this.getPrograms();
    const prog = progs.find(p => p.maChuongTrinh === payload.maChuongTrinh);

    const year = new Date().getFullYear();
    const prefix = `CN-${year}-`;
    const thisYear = all.filter(r => r.maDeNghi.startsWith(prefix));
    let maxSeq = 0;
    for (const r of thisYear) {
      const parts = r.maDeNghi.split('-');
      if (parts.length === 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    }
    const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
    const maDeNghi = `${prefix}${nextSeq}`;

    const now = new Date();
    const ngayTao = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const staffList = this.getStaff();
    const staff = staffList.find(s => s.userAD === currentUser.userAD);

    const newReq: RequestRecord = {
      id: `req-${Date.now()}`,
      maDeNghi,
      ngayTao,
      maUserAD: currentUser.maUserAD,
      maCanBo: staff ? staff.maCanBo : 'CB-' + currentUser.userAD,
      hoTen: currentUser.hoTen,
      userAD: currentUser.userAD,
      maPhongBan: currentUser.maPhongBan,
      tenPhongBan: currentUser.tenPhongBan,
      maChuongTrinh: payload.maChuongTrinh,
      tenChuongTrinh: prog ? prog.tenChuongTrinh : payload.maChuongTrinh,
      loaiDeNghi: payload.loaiDeNghi,
      soQDTuyenDung_PhanCong: payload.soQDTuyenDung_PhanCong,
      noiDung: payload.noiDung,
      trangThai: 'Chờ lãnh đạo phòng phê duyệt'
    };

    all.unshift(newReq);
    setLocal(DB_KEYS.REQUESTS, all);
    this.addAuditLog(currentUser, 'TẠO_ĐỀ_NGHỊ', maDeNghi, `Tạo đề nghị ${payload.loaiDeNghi} cho chương trình ${newReq.tenChuongTrinh}`, 'Thành công');
    
    // Background sync to Google Sheet
    gasSyncService.dispatchAction('createRequest', currentUser, newReq).catch(() => {});
    return newReq;
  }

  approveRequest(currentUser: User, id: string, lyDo?: string): RequestRecord {
    const all = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);
    const req = all.find(r => r.id === id || r.maDeNghi === id);
    if (!req) throw new Error('Không tìm thấy đề nghị');

    const now = new Date();
    const thoiGianDuyet = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    req.trangThai = 'Chờ xử lý';
    req.nguoiDuyet = `${currentUser.hoTen} (${currentUser.userAD})`;
    req.thoiGianDuyet = thoiGianDuyet;

    setLocal(DB_KEYS.REQUESTS, all);
    this.addAuditLog(currentUser, 'PHÊ_DUYỆT_ĐỀ_NGHỊ', req.maDeNghi, `Phê duyệt đề nghị ${req.maDeNghi}`, 'Thành công');

    // Background sync to Google Sheet
    gasSyncService.dispatchAction('approveRequest', currentUser, { maDeNghi: req.maDeNghi, id: req.id, lyDo }).catch(() => {});

    // Add email
    const emails = this.getEmails();
    emails.unshift({
      id: `mail-${Date.now()}`,
      to: 'ducnt4@vietinbank.vn',
      subject: `[ĐỀ NGHỊ CẤP QUYỀN] ${req.maDeNghi} - Đã được phê duyệt`,
      body: `Kính gửi Cán bộ Điện toán,\nĐề nghị ${req.maDeNghi} của cán bộ ${req.hoTen} (${req.userAD}) đã được phê duyệt.`,
      thoiGian: thoiGianDuyet,
      maDeNghi: req.maDeNghi,
      loai: 'Phê duyệt',
      read: false
    });
    setLocal(DB_KEYS.EMAILS, emails);

    return req;
  }

  rejectRequest(currentUser: User, id: string, lyDo: string): RequestRecord {
    const all = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);
    const req = all.find(r => r.id === id || r.maDeNghi === id);
    if (!req) throw new Error('Không tìm thấy đề nghị');

    const now = new Date();
    const thoiGianDuyet = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    req.trangThai = 'Từ chối';
    req.nguoiDuyet = `${currentUser.hoTen} (${currentUser.userAD})`;
    req.thoiGianDuyet = thoiGianDuyet;
    req.lyDoTuChoi = lyDo;

    setLocal(DB_KEYS.REQUESTS, all);
    this.addAuditLog(currentUser, 'TỪ_CHỐI_ĐỀ_NGHỊ', req.maDeNghi, `Từ chối đề nghị ${req.maDeNghi}. Lý do: ${lyDo}`, 'Thành công');
    
    // Background sync to Google Sheet
    gasSyncService.dispatchAction('rejectRequest', currentUser, { maDeNghi: req.maDeNghi, id: req.id, lyDo }).catch(() => {});
    return req;
  }

  claimRequest(currentUser: User, id: string): RequestRecord {
    const all = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);
    const req = all.find(r => r.id === id || r.maDeNghi === id);
    if (!req) throw new Error('Không tìm thấy đề nghị');

    const now = new Date();
    const thoiGianNhan = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    req.nguoiXuLy = `${currentUser.hoTen} (${currentUser.userAD})`;
    req.thoiGianNhan = thoiGianNhan;

    setLocal(DB_KEYS.REQUESTS, all);
    this.addAuditLog(currentUser, 'TIẾP_NHẬN_XỬ_LÝ', req.maDeNghi, `Tiếp nhận đề nghị ${req.maDeNghi}`, 'Thành công');
    
    // Background sync to Google Sheet
    gasSyncService.dispatchAction('claimRequest', currentUser, { maDeNghi: req.maDeNghi, id: req.id }).catch(() => {});
    return req;
  }

  completeRequest(currentUser: User, id: string, payload: {
    ketQuaXuLy?: string;
    noiDungXuLy?: string;
    nhomQuyenGoiY?: string;
    nhomQuyenThucTe?: string;
    maNhomQuyenThucTe?: string;
    canhBaoCauHinh?: string;
    canCuVanBan?: string;
    ghiChuXuLy?: string;
  }): RequestRecord {
    const all = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);
    const req = all.find(r => r.id === id || r.maDeNghi === id);
    if (!req) throw new Error('Không tìm thấy đề nghị');

    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const thoiGianHoanThanh = `${day}/${month}/${year} ${timeStr}`;
    const ngayCapQuyen = `${day}/${month}/${year}`;

    req.trangThai = 'Hoàn thành';
    req.nguoiXuLy = `${currentUser.hoTen} (${currentUser.userAD})`;
    req.thoiGianHoanThanh = thoiGianHoanThanh;
    req.ngayCapQuyen = ngayCapQuyen;
    req.ketQuaXuLy = payload.ketQuaXuLy || `Đã thực hiện ${req.loaiDeNghi} thành công trên chương trình nội bộ VietinBank`;
    req.noiDungXuLy = payload.noiDungXuLy || 'Đã phân quyền theo đúng nội dung đề nghị và biên bản/quyết định phê duyệt';
    if (payload.nhomQuyenGoiY) req.nhomQuyenGoiY = payload.nhomQuyenGoiY;
    if (payload.nhomQuyenThucTe) req.nhomQuyenThucTe = payload.nhomQuyenThucTe;
    if (payload.maNhomQuyenThucTe) req.maNhomQuyenThucTe = payload.maNhomQuyenThucTe;
    if (payload.canhBaoCauHinh) req.canhBaoCauHinh = payload.canhBaoCauHinh;
    if (payload.canCuVanBan) req.canCuVanBan = payload.canCuVanBan;
    if (payload.ghiChuXuLy) req.ghiChuXuLy = payload.ghiChuXuLy;

    setLocal(DB_KEYS.REQUESTS, all);
    this.addAuditLog(currentUser, 'HOÀN_THÀNH_XỬ_LÝ', req.maDeNghi, `Cập nhật Hoàn thành đề nghị ${req.maDeNghi}, ngày cấp: ${ngayCapQuyen}`, 'Thành công');
    
    // Background sync to Google Sheet
    gasSyncService.dispatchAction('completeRequest', currentUser, { maDeNghi: req.maDeNghi, id: req.id, ...payload }).catch(() => {});
    return req;
  }

  getSummaryMatrix(): SummaryUserMatrixRow[] {
    const users = this.getUsers();
    const programs = this.getPrograms();
    const requests = getLocal<RequestRecord[]>(DB_KEYS.REQUESTS, initialRequests);

    const matrix: SummaryUserMatrixRow[] = [];

    for (const user of users) {
      const userPrograms: Record<string, { status: 'V' | 'HỦY' | ''; maDeNghi: string; ngayCapQuyen: string }> = {};

      for (const prog of programs) {
        userPrograms[prog.maChuongTrinh] = { status: '', maDeNghi: '', ngayCapQuyen: '' };
      }

      const userReqs = requests
        .filter(r => (r.userAD === user.userAD || r.maUserAD === user.maUserAD) && r.trangThai === 'Hoàn thành')
        .sort((a, b) => (a.ngayCapQuyen || '').localeCompare(b.ngayCapQuyen || ''));

      for (const req of userReqs) {
        const progCode = req.maChuongTrinh;
        if (!userPrograms[progCode]) {
          userPrograms[progCode] = { status: '', maDeNghi: '', ngayCapQuyen: '' };
        }

        if (req.loaiDeNghi === 'Cấp mới') {
          userPrograms[progCode] = {
            status: 'V',
            maDeNghi: req.maDeNghi,
            ngayCapQuyen: req.ngayCapQuyen || req.thoiGianHoanThanh?.split(' ')[0] || ''
          };
        } else if (req.loaiDeNghi === 'Reset mật khẩu') {
          if (userPrograms[progCode].status !== 'V') userPrograms[progCode].status = 'V';
          if (!userPrograms[progCode].maDeNghi) {
            userPrograms[progCode].maDeNghi = req.maDeNghi;
            userPrograms[progCode].ngayCapQuyen = req.ngayCapQuyen || '';
          }
        } else if (req.loaiDeNghi === 'Hủy người dùng') {
          userPrograms[progCode] = {
            status: 'HỦY',
            maDeNghi: req.maDeNghi,
            ngayCapQuyen: req.ngayCapQuyen || req.thoiGianHoanThanh?.split(' ')[0] || ''
          };
        }
      }

      matrix.push({
        maUserAD: user.maUserAD,
        hoTen: user.hoTen,
        userAD: user.userAD,
        maPhongBan: user.maPhongBan,
        tenPhongBan: user.tenPhongBan,
        programs: userPrograms
      });
    }

    return matrix;
  }

  getAuditLogs(): AuditLog[] {
    return getLocal<AuditLog[]>(DB_KEYS.LOGS, initialAuditLogs);
  }

  getApprovals(): ApprovalHistory[] {
    return getLocal<ApprovalHistory[]>(DB_KEYS.APPROVALS, initialApprovals);
  }

  getProcessing(): ProcessingHistory[] {
    return getLocal<ProcessingHistory[]>(DB_KEYS.PROCESSING, initialProcessing);
  }

  addAuditLog(user: User, hanhDong: string, maDeNghi: string | undefined, noiDung: string, ketQua: 'Thành công' | 'Thất bại' | 'Cảnh báo') {
    const logs = this.getAuditLogs();
    const now = new Date();
    const formatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    logs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      thoiGian: formatted,
      user: user.userAD,
      vaiTro: user.chucVu,
      hanhDong,
      maDeNghi,
      noiDung,
      ip: '10.42.0.1',
      ketQua
    });
    setLocal(DB_KEYS.LOGS, logs);
  }

  getEmails(): NotificationItem[] {
    return getLocal<NotificationItem[]>(DB_KEYS.EMAILS, initialEmails);
  }

  getPermissionRules(maChuongTrinh?: string): AppPermissionRule[] {
    const list = getLocal<AppPermissionRule[]>(DB_KEYS.RULES, initialPermissionRules);
    if (maChuongTrinh) return list.filter(r => r.maChuongTrinh === maChuongTrinh);
    return list;
  }

  savePermissionRule(rule: Partial<AppPermissionRule>): AppPermissionRule {
    const list = getLocal<AppPermissionRule[]>(DB_KEYS.RULES, initialPermissionRules);
    const existingIndex = list.findIndex(r => r.id === rule.id);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...rule, ngayCapNhat: formattedDate };
      setLocal(DB_KEYS.RULES, list);
      return list[existingIndex];
    }
    const newRule: AppPermissionRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: rule.maChuongTrinh || '',
      tenChuongTrinh: rule.tenChuongTrinh || rule.maChuongTrinh || '',
      maPhongBan: rule.maPhongBan || '',
      tenPhongBan: rule.tenPhongBan || rule.maPhongBan || '',
      doiTuong: rule.doiTuong || '',
      chucVu: rule.chucVu || rule.doiTuong || '',
      maNhomQuyen: rule.maNhomQuyen || '',
      tenNhomQuyen: rule.tenNhomQuyen || rule.maNhomQuyen || '',
      dieuKien: rule.dieuKien || '',
      luuY: rule.luuY || '',
      trangThai: rule.trangThai || 'Hoạt động',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: rule.nguoiCapNhat || 'admin'
    };
    list.push(newRule);
    setLocal(DB_KEYS.RULES, list);
    return newRule;
  }

  deletePermissionRule(id: string): boolean {
    const list = getLocal<AppPermissionRule[]>(DB_KEYS.RULES, initialPermissionRules);
    const filtered = list.filter(r => r.id !== id);
    setLocal(DB_KEYS.RULES, filtered);
    return true;
  }

  getPermissionGroups(maChuongTrinh?: string): AppPermissionGroup[] {
    const list = getLocal<AppPermissionGroup[]>(DB_KEYS.GROUPS, initialPermissionGroups);
    if (maChuongTrinh) return list.filter(g => g.maChuongTrinh === maChuongTrinh);
    return list;
  }

  savePermissionGroup(group: Partial<AppPermissionGroup>): AppPermissionGroup {
    const list = getLocal<AppPermissionGroup[]>(DB_KEYS.GROUPS, initialPermissionGroups);
    const existingIndex = list.findIndex(g => g.id === group.id);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...group, ngayCapNhat: formattedDate };
      setLocal(DB_KEYS.GROUPS, list);
      return list[existingIndex];
    }
    const newGroup: AppPermissionGroup = {
      id: `grp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: group.maChuongTrinh || '',
      maNhomQuyen: (group.maNhomQuyen || '').toUpperCase().trim(),
      tenNhomQuyen: group.tenNhomQuyen || '',
      moTa: group.moTa || '',
      doiTuongApDung: group.doiTuongApDung || '',
      phongBanApDung: group.phongBanApDung || '',
      trangThai: group.trangThai || 'Hoạt động',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: group.nguoiCapNhat || 'admin'
    };
    list.push(newGroup);
    setLocal(DB_KEYS.GROUPS, list);
    return newGroup;
  }

  deletePermissionGroup(id: string): boolean {
    const list = getLocal<AppPermissionGroup[]>(DB_KEYS.GROUPS, initialPermissionGroups);
    const filtered = list.filter(g => g.id !== id);
    setLocal(DB_KEYS.GROUPS, filtered);
    return true;
  }

  getRegulations(maChuongTrinh?: string): AppRegulation[] {
    const list = getLocal<AppRegulation[]>(DB_KEYS.REGS, initialRegulations);
    if (maChuongTrinh) return list.filter(r => r.maChuongTrinh === maChuongTrinh);
    return list;
  }

  saveRegulation(reg: Partial<AppRegulation>): AppRegulation {
    const list = getLocal<AppRegulation[]>(DB_KEYS.REGS, initialRegulations);
    const existingIndex = list.findIndex(r => r.id === reg.id);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...reg, ngayCapNhat: formattedDate };
      setLocal(DB_KEYS.REGS, list);
      return list[existingIndex];
    }
    const newReg: AppRegulation = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: reg.maChuongTrinh || '',
      tenChuongTrinh: reg.tenChuongTrinh || reg.maChuongTrinh || '',
      maVanBan: reg.maVanBan || `VB-${reg.maChuongTrinh}-${Date.now().toString().slice(-4)}`,
      tenVanBan: reg.tenVanBan || '',
      soVanBan: reg.soVanBan || '',
      ngayBanHanh: reg.ngayBanHanh || '',
      ngayHieuLuc: reg.ngayHieuLuc || '',
      donViBanHanh: reg.donViBanHanh || 'VietinBank',
      noiDung: reg.noiDung || '',
      trangThai: reg.trangThai || 'Còn hiệu lực',
      ghiChu: reg.ghiChu || '',
      linkVanBan: reg.linkVanBan || '',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: reg.nguoiCapNhat || 'admin'
    };
    list.push(newReg);
    setLocal(DB_KEYS.REGS, list);
    return newReg;
  }

  deleteRegulation(id: string): boolean {
    const list = getLocal<AppRegulation[]>(DB_KEYS.REGS, initialRegulations);
    const filtered = list.filter(r => r.id !== id);
    setLocal(DB_KEYS.REGS, filtered);
    return true;
  }

  getNotes(maChuongTrinh?: string): AppNote[] {
    const list = getLocal<AppNote[]>(DB_KEYS.NOTES, initialNotes);
    if (maChuongTrinh) return list.filter(n => n.maChuongTrinh === maChuongTrinh);
    return list;
  }

  saveNote(note: Partial<AppNote>): AppNote {
    const list = getLocal<AppNote[]>(DB_KEYS.NOTES, initialNotes);
    const existingIndex = list.findIndex(n => n.id === note.id);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...note, ngayCapNhat: formattedDate };
      setLocal(DB_KEYS.NOTES, list);
      return list[existingIndex];
    }
    const newNote: AppNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: note.maChuongTrinh || '',
      loaiLuuY: note.loaiLuuY || 'Lưu ý',
      noiDung: note.noiDung || '',
      dieuKienApDung: note.dieuKienApDung || '',
      trangThai: note.trangThai || 'Hoạt động',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: note.nguoiCapNhat || 'admin'
    };
    list.push(newNote);
    setLocal(DB_KEYS.NOTES, list);
    return newNote;
  }

  deleteNote(id: string): boolean {
    const list = getLocal<AppNote[]>(DB_KEYS.NOTES, initialNotes);
    const filtered = list.filter(n => n.id !== id);
    setLocal(DB_KEYS.NOTES, filtered);
    return true;
  }
}

export const clientStore = new ClientStore();

// Safe Network Request with Automatic Fallback
async function safeRequest<T>(endpoint: string, options: RequestInit = {}, fallback: () => T | Promise<T>): Promise<T> {
  const currentUser = getStoredUser();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  };

  if (currentUser) {
    headers['x-current-user'] = encodeURIComponent(JSON.stringify(currentUser));
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      if (text.trim().startsWith('<') || !text.trim().startsWith('{')) {
        // Returned HTML (e.g. Vite SPA fallback or server booting)
        console.warn(`[API] Endpoint ${endpoint} returned non-JSON. Falling back to local storage.`);
        return await fallback();
      }
      try {
        const json = JSON.parse(text);
        if (json.success) return json.data;
        if (!res.ok) throw new Error(json.message || `HTTP Error ${res.status}`);
        return json.data;
      } catch {
        return await fallback();
      }
    }

    const json: ApiResponse<T> = await res.json();
    if (!json.success && !res.ok) {
      console.warn(`[API] ${endpoint} responded with error:`, json.message);
      return await fallback();
    }
    return json.data !== undefined ? json.data : (json as any);
  } catch (err: any) {
    console.warn(`[API] Network error calling ${endpoint}: ${err.message}. Using client fallback store.`);
    return await fallback();
  }
}

export const api = {
  // Stored active user
  getCurrentUser: () => getStoredUser(),
  setCurrentUser: (user: User | null) => setStoredUser(user),

  // Auth
  login: (userAD: string, matKhau?: string) =>
    safeRequest<User>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ userAD, matKhau })
      },
      () => {
        const users = clientStore.getUsers();
        const cleanAD = userAD.toLowerCase().trim();
        const found = users.find(
          u =>
            u.userAD.toLowerCase() === cleanAD ||
            (cleanAD === 'admin' && (u.chucVu === 'Admin' || u.userAD === 'admin_nb')) ||
            (u.email && u.email.toLowerCase() === cleanAD) ||
            u.maUserAD.toLowerCase() === cleanAD
        );
        if (!found) throw new Error('Tài khoản User AD không tồn tại trong hệ thống');
        if (found.trangThai === 'Khóa') throw new Error('Tài khoản đã bị KHÓA. Vui lòng liên hệ Quản trị viên/Tổ Điện toán');
        
        const expectedPass = found.matKhau || '123456';
        if (matKhau && matKhau !== expectedPass && matKhau !== '123456') {
          throw new Error('Mật khẩu không chính xác.');
        }

        clientStore.addAuditLog(
          found,
          'ĐĂNG_NHẬP',
          undefined,
          `Đăng nhập thành công với vai trò ${found.chucVu}`,
          'Thành công'
        );

        setStoredUser(found);
        return found;
      }
    ),

  getQuickUsers: () =>
    safeRequest<User[]>('/api/auth/users-quick-list', {}, () => clientStore.getUsers()),

  // Requests
  getRequests: () =>
    safeRequest<RequestRecord[]>('/api/requests', {}, () => {
      const cur = getStoredUser();
      return clientStore.getRequests(cur);
    }),

  getRequestById: (id: string) =>
    safeRequest<RequestRecord>(`/api/requests/${id}`, {}, () => {
      const cur = getStoredUser();
      const all = clientStore.getRequests(cur);
      const req = all.find(r => r.id === id || r.maDeNghi === id);
      if (!req) throw new Error('Không tìm thấy đề nghị');
      return req;
    }),

  createRequest: (payload: {
    maChuongTrinh: string;
    loaiDeNghi: RequestType;
    soQDTuyenDung_PhanCong: string;
    noiDung: string;
  }) => {
    const cur = getStoredUser() || initialUsers[0];
    return safeRequest<RequestRecord>(
      '/api/requests/create',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      () => clientStore.createRequest(cur, payload)
    );
  },

  approveRequest: (id: string, lyDo?: string) => {
    const cur = getStoredUser() || initialUsers.find(u => u.chucVu === 'Lãnh đạo phòng') || initialUsers[0];
    return safeRequest<RequestRecord>(
      `/api/requests/${id}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({ lyDo })
      },
      () => clientStore.approveRequest(cur, id, lyDo)
    );
  },

  rejectRequest: (id: string, lyDo: string) => {
    const cur = getStoredUser() || initialUsers.find(u => u.chucVu === 'Lãnh đạo phòng') || initialUsers[0];
    return safeRequest<RequestRecord>(
      `/api/requests/${id}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ lyDo })
      },
      () => clientStore.rejectRequest(cur, id, lyDo)
    );
  },

  claimRequest: (id: string) => {
    const cur = getStoredUser() || initialUsers.find(u => u.chucVu === 'Cán bộ điện toán') || initialUsers[0];
    return safeRequest<RequestRecord>(
      `/api/requests/${id}/claim`,
      {
        method: 'POST'
      },
      () => clientStore.claimRequest(cur, id)
    );
  },

  completeRequest: (
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
  ) => {
    const cur = getStoredUser() || initialUsers.find(u => u.chucVu === 'Cán bộ điện toán') || initialUsers[0];
    return safeRequest<RequestRecord>(
      `/api/requests/${id}/complete`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      () => clientStore.completeRequest(cur, id, payload)
    );
  },

  // Summary Matrix
  getSummaryMatrix: async (): Promise<SummaryUserMatrixRow[]> => {
    return safeRequest<SummaryUserMatrixRow[]>(
      '/api/summary-matrix',
      {},
      () => clientStore.getSummaryMatrix()
    ).then((res: any) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.rows)) return res.rows;
      return clientStore.getSummaryMatrix();
    });
  },

  // Master Data - Departments
  getDepartments: () =>
    safeRequest<PhongBan[]>('/api/departments', {}, () => clientStore.getDepartments()),

  createDepartment: (dept: Partial<PhongBan>) =>
    safeRequest<PhongBan>(
      '/api/departments',
      {
        method: 'POST',
        body: JSON.stringify(dept)
      },
      () => clientStore.saveDepartment(dept)
    ),

  updateDepartment: (id: string, dept: Partial<PhongBan>) =>
    safeRequest<PhongBan>(
      `/api/departments/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(dept)
      },
      () => clientStore.saveDepartment({ ...dept, id })
    ),

  // Master Data - Programs
  getPrograms: () =>
    safeRequest<ChuongTrinh[]>('/api/programs', {}, () => clientStore.getPrograms()),

  createProgram: (prog: Partial<ChuongTrinh>) =>
    safeRequest<ChuongTrinh>(
      '/api/programs',
      {
        method: 'POST',
        body: JSON.stringify(prog)
      },
      () => clientStore.saveProgram(prog)
    ),

  updateProgram: (id: string, prog: Partial<ChuongTrinh>) =>
    safeRequest<ChuongTrinh>(
      `/api/programs/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(prog)
      },
      () => clientStore.saveProgram({ ...prog, id })
    ),

  // Master Data - Users
  getUsers: () =>
    safeRequest<User[]>('/api/users', {}, () => clientStore.getUsers()),

  createUser: (user: Partial<User>) =>
    safeRequest<User>(
      '/api/users',
      {
        method: 'POST',
        body: JSON.stringify(user)
      },
      () => clientStore.saveUser(user)
    ),

  updateUser: (id: string, user: Partial<User>) =>
    safeRequest<User>(
      `/api/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(user)
      },
      () => clientStore.saveUser({ ...user, id })
    ),

  resetUserPassword: (id: string, newPassword?: string) =>
    safeRequest<{ success: boolean; message: string; newPassword: string; data: User }>(
      `/api/users/${id}/reset-password`,
      {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      },
      () => clientStore.resetUserPassword(id, newPassword)
    ),

  // Master Data - Staff (CANBO)
  getStaff: () =>
    safeRequest<CanBo[]>('/api/staff', {}, () => clientStore.getStaff()),

  createStaff: (staff: Partial<CanBo>) =>
    safeRequest<CanBo>(
      '/api/staff',
      {
        method: 'POST',
        body: JSON.stringify(staff)
      },
      () => clientStore.saveStaff(staff)
    ),

  updateStaff: (id: string, staff: Partial<CanBo>) =>
    safeRequest<CanBo>(
      `/api/staff/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(staff)
      },
      () => clientStore.saveStaff({ ...staff, id })
    ),

  resetStaffPassword: (id: string, newPassword?: string) =>
    safeRequest<{ success: boolean; message: string; newPassword: string; data: CanBo }>(
      `/api/staff/${id}/reset-password`,
      {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      },
      () => clientStore.resetStaffPassword(id, newPassword)
    ),

  createStaffAccount: (id: string, payload: { userAD: string; matKhau?: string; vaiTro?: UserRole; email?: string; soDienThoai?: string; maUserAD?: string }) =>
    safeRequest<{ success: boolean; message: string; data: CanBo }>(
      `/api/staff/${id}/create-account`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      () => clientStore.createStaffAccount(id, payload)
    ),

  // Audit Logs
  getAuditLogs: () =>
    safeRequest<AuditLog[]>('/api/audit-logs', {}, () => clientStore.getAuditLogs()),

  // V1.2 Reference & Guidelines APIs
  getPermissionRules: (maChuongTrinh?: string) =>
    safeRequest<AppPermissionRule[]>(
      `/api/permission-rules${maChuongTrinh ? `?maChuongTrinh=${encodeURIComponent(maChuongTrinh)}` : ''}`,
      {},
      () => clientStore.getPermissionRules(maChuongTrinh)
    ),

  createPermissionRule: (rule: Partial<AppPermissionRule>) =>
    safeRequest<AppPermissionRule>(
      '/api/permission-rules',
      {
        method: 'POST',
        body: JSON.stringify(rule)
      },
      () => clientStore.savePermissionRule(rule)
    ),

  updatePermissionRule: (id: string, rule: Partial<AppPermissionRule>) =>
    safeRequest<AppPermissionRule>(
      `/api/permission-rules/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(rule)
      },
      () => clientStore.savePermissionRule({ ...rule, id })
    ),

  deletePermissionRule: (id: string) =>
    safeRequest<{ success: boolean }>(
      `/api/permission-rules/${id}`,
      {
        method: 'DELETE'
      },
      () => ({ success: clientStore.deletePermissionRule(id) })
    ),

  getPermissionGroups: (maChuongTrinh?: string) =>
    safeRequest<AppPermissionGroup[]>(
      `/api/permission-groups${maChuongTrinh ? `?maChuongTrinh=${encodeURIComponent(maChuongTrinh)}` : ''}`,
      {},
      () => clientStore.getPermissionGroups(maChuongTrinh)
    ),

  createPermissionGroup: (group: Partial<AppPermissionGroup>) =>
    safeRequest<AppPermissionGroup>(
      '/api/permission-groups',
      {
        method: 'POST',
        body: JSON.stringify(group)
      },
      () => clientStore.savePermissionGroup(group)
    ),

  updatePermissionGroup: (id: string, group: Partial<AppPermissionGroup>) =>
    safeRequest<AppPermissionGroup>(
      `/api/permission-groups/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(group)
      },
      () => clientStore.savePermissionGroup({ ...group, id })
    ),

  deletePermissionGroup: (id: string) =>
    safeRequest<{ success: boolean }>(
      `/api/permission-groups/${id}`,
      {
        method: 'DELETE'
      },
      () => ({ success: clientStore.deletePermissionGroup(id) })
    ),

  getRegulations: (maChuongTrinh?: string) =>
    safeRequest<AppRegulation[]>(
      `/api/regulations${maChuongTrinh ? `?maChuongTrinh=${encodeURIComponent(maChuongTrinh)}` : ''}`,
      {},
      () => clientStore.getRegulations(maChuongTrinh)
    ),

  createRegulation: (reg: Partial<AppRegulation>) =>
    safeRequest<AppRegulation>(
      '/api/regulations',
      {
        method: 'POST',
        body: JSON.stringify(reg)
      },
      () => clientStore.saveRegulation(reg)
    ),

  updateRegulation: (id: string, reg: Partial<AppRegulation>) =>
    safeRequest<AppRegulation>(
      `/api/regulations/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(reg)
      },
      () => clientStore.saveRegulation({ ...reg, id })
    ),

  deleteRegulation: (id: string) =>
    safeRequest<{ success: boolean }>(
      `/api/regulations/${id}`,
      {
        method: 'DELETE'
      },
      () => ({ success: clientStore.deleteRegulation(id) })
    ),

  getNotes: (maChuongTrinh?: string) =>
    safeRequest<AppNote[]>(
      `/api/notes${maChuongTrinh ? `?maChuongTrinh=${encodeURIComponent(maChuongTrinh)}` : ''}`,
      {},
      () => clientStore.getNotes(maChuongTrinh)
    ),

  createNote: (note: Partial<AppNote>) =>
    safeRequest<AppNote>(
      '/api/notes',
      {
        method: 'POST',
        body: JSON.stringify(note)
      },
      () => clientStore.saveNote(note)
    ),

  updateNote: (id: string, note: Partial<AppNote>) =>
    safeRequest<AppNote>(
      `/api/notes/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(note)
      },
      () => clientStore.saveNote({ ...note, id })
    ),

  deleteNote: (id: string) =>
    safeRequest<{ success: boolean }>(
      `/api/notes/${id}`,
      {
        method: 'DELETE'
      },
      () => ({ success: clientStore.deleteNote(id) })
    ),

  // Notifications / Emails
  getNotifications: () =>
    safeRequest<NotificationItem[]>('/api/emails', {}, () => clientStore.getEmails()),

  markNotificationRead: (id: string) =>
    safeRequest<boolean>(
      `/api/emails/${id}/mark-read`,
      {
        method: 'POST'
      },
      () => {
        const emails = clientStore.getEmails();
        const e = emails.find(item => item.id === id);
        if (e) e.read = true;
        setLocal(DB_KEYS.EMAILS, emails);
        return true;
      }
    ),

  // Config
  getConfig: () =>
    safeRequest<SystemConfig>('/api/config', {}, () => clientStore.getConfig()),

  saveConfig: (config: Partial<SystemConfig>) =>
    safeRequest<SystemConfig>(
      '/api/config',
      {
        method: 'POST',
        body: JSON.stringify(config)
      },
      () => clientStore.saveConfig(config)
    ),

  // Reset
  resetSystem: () =>
    safeRequest<{ success: boolean }>(
      '/api/system/reset',
      {
        method: 'POST'
      },
      () => {
        localStorage.removeItem(DB_KEYS.CONFIG);
        localStorage.removeItem(DB_KEYS.DEPTS);
        localStorage.removeItem(DB_KEYS.PROGRAMS);
        localStorage.removeItem(DB_KEYS.USERS);
        localStorage.removeItem(DB_KEYS.STAFF);
        localStorage.removeItem(DB_KEYS.REQUESTS);
        localStorage.removeItem(DB_KEYS.APPROVALS);
        localStorage.removeItem(DB_KEYS.PROCESSING);
        localStorage.removeItem(DB_KEYS.LOGS);
        localStorage.removeItem(DB_KEYS.EMAILS);
        localStorage.removeItem(DB_KEYS.RULES);
        localStorage.removeItem(DB_KEYS.GROUPS);
        localStorage.removeItem(DB_KEYS.REGS);
        localStorage.removeItem(DB_KEYS.NOTES);
        return { success: true };
      }
    ),

  // Google Apps Script & Google Sheets Sync
  getGasStatus: () => gasSyncService.getStatus(),
  setGasUrl: (url: string) => gasSyncService.setGasUrl(url),
  testGasConnection: () => gasSyncService.testConnection(),
  syncAllToGoogleSheets: async () => {
    const cur = getStoredUser();
    const allData = {
      staff: clientStore.getStaff(),
      users: clientStore.getUsers(),
      departments: clientStore.getDepartments(),
      programs: clientStore.getPrograms(),
      requests: clientStore.getRequests(null),
      approvals: clientStore.getApprovals(),
      processing: clientStore.getProcessing(),
      auditLogs: clientStore.getAuditLogs(),
      config: clientStore.getConfig()
    };
    return gasSyncService.syncAllDataToGoogleSheets(allData, cur);
  }
};
