import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
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
} from './src/data/initialData';
import {
  User,
  CanBo,
  PhongBan,
  ChuongTrinh,
  RequestRecord,
  ApprovalHistory,
  ProcessingHistory,
  AuditLog,
  EmailNotification,
  SystemConfig,
  SummaryUserMatrixRow,
  AppPermissionRule,
  AppPermissionGroup,
  AppRegulation,
  AppNote
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database (Server Stateful Persistence)
class DatabaseState {
  config: SystemConfig = { ...initialConfig };
  departments: PhongBan[] = [...initialDepartments];
  programs: ChuongTrinh[] = [...initialPrograms];
  users: User[] = [...initialUsers];
  staff: CanBo[] = [...initialCanBo];
  requests: RequestRecord[] = [...initialRequests];
  approvals: ApprovalHistory[] = [...initialApprovals];
  processing: ProcessingHistory[] = [...initialProcessing];
  auditLogs: AuditLog[] = [...initialAuditLogs];
  emails: EmailNotification[] = [...initialEmails];

  // V1.2 Reference & Guidelines Data
  permissionRules: AppPermissionRule[] = [...initialPermissionRules];
  permissionGroups: AppPermissionGroup[] = [...initialPermissionGroups];
  regulations: AppRegulation[] = [...initialRegulations];
  notes: AppNote[] = [...initialNotes];

  // Generate next Request ID (CN-YYYY-NNNN)
  generateNextRequestId(): string {
    const currentYear = new Date().getFullYear();
    const prefix = `CN-${currentYear}-`;
    const thisYearReqs = this.requests.filter(r => r.maDeNghi.startsWith(prefix));
    
    let maxSeq = 0;
    for (const req of thisYearReqs) {
      const parts = req.maDeNghi.split('-');
      if (parts.length === 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
    const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
    return `${prefix}${nextSeq}`;
  }

  logAudit(
    user: string,
    vaiTro: any,
    hanhDong: string,
    maDeNghi: string | undefined,
    noiDung: string,
    ketQua: 'Thành công' | 'Thất bại' | 'Cảnh báo',
    ip = '10.42.0.1'
  ) {
    const now = new Date();
    const formatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      thoiGian: formatted,
      user,
      vaiTro,
      hanhDong,
      maDeNghi,
      noiDung,
      ip,
      ketQua
    });
  }

  // Generate the Summary Matrix
  getSummaryMatrix(): SummaryUserMatrixRow[] {
    const matrix: SummaryUserMatrixRow[] = [];

    // All active or historical users
    for (const user of this.users) {
      const userPrograms: Record<string, { status: 'V' | 'HỦY' | ''; maDeNghi: string; ngayCapQuyen: string }> = {};

      // Initialize all known programs
      for (const prog of this.programs) {
        userPrograms[prog.maChuongTrinh] = {
          status: '',
          maDeNghi: '',
          ngayCapQuyen: ''
        };
      }

      // Filter all completed requests for this user sorted by date ascending
      const userReqs = this.requests
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
        } else if (req.loaiDeNghi === 'Thay đổi' || (req.loaiDeNghi as string) === 'Reset mật khẩu') {
          // Keep existing status & original granted date if already V, or set V
          if (userPrograms[progCode].status !== 'V') {
            userPrograms[progCode].status = 'V';
          }
          // Do not overwrite original granting request ID or grant date unless empty
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

  reset() {
    this.config = { ...initialConfig };
    this.departments = [...initialDepartments];
    this.programs = [...initialPrograms];
    this.users = [...initialUsers];
    this.staff = [...initialCanBo];
    this.requests = [...initialRequests];
    this.approvals = [...initialApprovals];
    this.processing = [...initialProcessing];
    this.auditLogs = [...initialAuditLogs];
    this.emails = [...initialEmails];
    this.permissionRules = [...initialPermissionRules];
    this.permissionGroups = [...initialPermissionGroups];
    this.regulations = [...initialRegulations];
    this.notes = [...initialNotes];
  }
}

const db = new DatabaseState();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper middleware to parse current user from header
  const getCurrentUser = (req: express.Request): User | null => {
    const userJson = req.headers['x-current-user'] as string;
    if (!userJson) return null;
    try {
      return JSON.parse(decodeURIComponent(userJson));
    } catch {
      return null;
    }
  };

  // --- API ROUTES ---

  // 1. Auth & Current User
  app.post('/api/auth/login', (req, res) => {
    const { userAD, matKhau } = req.body;
    if (!userAD) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập User AD' });
    }

    const cleanAD = userAD.trim().toLowerCase();
    const user = db.users.find(
      u =>
        u.userAD.toLowerCase() === cleanAD ||
        (cleanAD === 'admin' && (u.chucVu === 'Admin' || u.userAD === 'admin_nb')) ||
        (u.email && u.email.toLowerCase() === cleanAD) ||
        u.maUserAD.toLowerCase() === cleanAD
    );
    if (!user) {
      return res.status(401).json({ success: false, message: 'User AD hoặc email không tồn tại trong hệ thống.' });
    }

    if (user.trangThai === 'Khóa') {
      db.logAudit(user.userAD, user.chucVu, 'ĐĂNG_NHẬP_KHÓA', undefined, 'Đăng nhập thất bại do tài khoản bị khóa', 'Cảnh báo');
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị KHÓA. Vui lòng liên hệ Quản trị viên/Điện toán.' });
    }

    // Default password check (allow 123456 or match)
    if (matKhau && user.matKhau && user.matKhau !== matKhau && matKhau !== '123456') {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác.' });
    }

    db.logAudit(user.userAD, user.chucVu, 'ĐĂNG_NHẬP', undefined, `Đăng nhập thành công với vai trò ${user.chucVu}`, 'Thành công');

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: user
    });
  });

  app.get('/api/auth/users-quick-list', (req, res) => {
    res.json({
      success: true,
      data: db.users
    });
  });

  // 2. Requests Management
  app.get('/api/requests', (req, res) => {
    const currentUser = getCurrentUser(req);
    let filtered = [...db.requests];

    if (currentUser) {
      if (currentUser.chucVu === 'Cán bộ') {
        // Only view own requests
        filtered = filtered.filter(
          r => r.userAD === currentUser.userAD || r.maUserAD === currentUser.maUserAD
        );
      } else if (currentUser.chucVu === 'Lãnh đạo phòng') {
        // Strict: Only view requests with SAME MaPhongBan
        filtered = filtered.filter(r => r.maPhongBan === currentUser.maPhongBan);
      }
      // 'Cán bộ điện toán' and 'Admin' see all
    }

    res.json({
      success: true,
      data: filtered
    });
  });

  app.get('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const request = db.requests.find(r => r.id === id || r.maDeNghi === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề nghị' });
    }

    const currentUser = getCurrentUser(req);
    if (currentUser) {
      if (currentUser.chucVu === 'Cán bộ' && request.userAD !== currentUser.userAD && request.maUserAD !== currentUser.maUserAD) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền xem đề nghị của cán bộ khác' });
      }
      if (currentUser.chucVu === 'Lãnh đạo phòng' && request.maPhongBan !== currentUser.maPhongBan) {
        return res.status(403).json({ success: false, message: 'Bạn chỉ được xem đề nghị thuộc phòng ban của mình' });
      }
    }

    res.json({ success: true, data: request });
  });

  app.post('/api/requests/create', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    const { maChuongTrinh, loaiDeNghi, soQDTuyenDung_PhanCong, noiDung } = req.body;

    if (!maChuongTrinh || !loaiDeNghi || !soQDTuyenDung_PhanCong || !noiDung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin: Chương trình, Loại đề nghị, Số QĐ và Nội dung.'
      });
    }

    const prog = db.programs.find(p => p.maChuongTrinh === maChuongTrinh);
    if (!prog || prog.trangThai !== 'Hoạt động') {
      return res.status(400).json({
        success: false,
        message: 'Chương trình ứng dụng không hợp lệ hoặc đã ngừng sử dụng.'
      });
    }

    const maDeNghi = db.generateNextRequestId();
    const now = new Date();
    const ngayTao = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Look up staff info
    const staffMember = db.staff.find(s => s.userAD === currentUser.userAD);

    const newRequest: RequestRecord = {
      id: `req-${Date.now()}`,
      maDeNghi,
      ngayTao,
      maUserAD: currentUser.maUserAD,
      maCanBo: staffMember ? staffMember.maCanBo : 'CB-' + currentUser.userAD,
      hoTen: currentUser.hoTen,
      userAD: currentUser.userAD,
      maPhongBan: currentUser.maPhongBan, // Stored snapshot at creation
      tenPhongBan: currentUser.tenPhongBan, // Stored snapshot at creation
      maChuongTrinh: prog.maChuongTrinh,
      tenChuongTrinh: prog.tenChuongTrinh,
      loaiDeNghi,
      soQDTuyenDung_PhanCong: soQDTuyenDung_PhanCong.trim(),
      noiDung: noiDung.trim(),
      trangThai: 'Chờ lãnh đạo phòng phê duyệt'
    };

    db.requests.unshift(newRequest);
    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'TẠO_ĐỀ_NGHỊ',
      maDeNghi,
      `Tạo đề nghị ${loaiDeNghi} cho chương trình ${prog.tenChuongTrinh}`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã tạo thành công đề nghị ${maDeNghi}. Đề nghị đã được chuyển đến Lãnh đạo phòng phê duyệt.`,
      data: newRequest
    });
  });

  // Phê duyệt bởi Lãnh đạo phòng
  app.post('/api/requests/:id/approve', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    if (currentUser.chucVu !== 'Lãnh đạo phòng' && currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Lãnh đạo phòng mới có quyền phê duyệt đề nghị.' });
    }

    const { id } = req.params;
    const request = db.requests.find(r => r.id === id || r.maDeNghi === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề nghị' });
    }

    // MANDATORY BACKEND RULE: Lãnh đạo phòng chỉ được duyệt nếu cùng mã phòng ban!
    if (currentUser.chucVu === 'Lãnh đạo phòng' && request.maPhongBan !== currentUser.maPhongBan) {
      db.logAudit(
        currentUser.userAD,
        currentUser.chucVu,
        'CẢNH_BÁO_VI_PHẠM_QUYỀN',
        request.maDeNghi,
        `Cố gắng phê duyệt đề nghị thuộc phòng ${request.maPhongBan} trong khi lãnh đạo thuộc phòng ${currentUser.maPhongBan}`,
        'Thất bại'
      );
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền phê duyệt đề nghị này. Đề nghị không thuộc phòng ban quản lý của bạn.'
      });
    }

    if (request.trangThai !== 'Chờ lãnh đạo phòng phê duyệt' && request.trangThai !== 'Đề nghị mới') {
      return res.status(400).json({
        success: false,
        message: `Đề nghị đang ở trạng thái "${request.trangThai}", không thể phê duyệt.`
      });
    }

    const now = new Date();
    const thoiGianDuyet = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    request.trangThai = 'Chờ xử lý';
    request.nguoiDuyet = `${currentUser.hoTen} (${currentUser.userAD})`;
    request.thoiGianDuyet = thoiGianDuyet;

    // Record approval history
    db.approvals.push({
      id: `app-${Date.now()}`,
      maDeNghi: request.maDeNghi,
      nguoiDuyet: currentUser.hoTen,
      userAD: currentUser.userAD,
      maPhongBan: currentUser.maPhongBan,
      ketQua: 'Phê duyệt',
      lyDo: req.body.lyDo || 'Đã kiểm tra và đồng ý',
      thoiGian: thoiGianDuyet
    });

    // Send notification email to ducnt4@vietinbank.vn
    const emailSubject = `[ĐỀ NGHỊ CẤP QUYỀN] ${request.maDeNghi} - Đã được phê duyệt`;
    const emailBody = `Kính gửi Cán bộ Điện toán,\n\nĐề nghị cấp quyền ${request.maDeNghi} đã được Lãnh đạo phòng phê duyệt và chuyển đến Điện toán để xử lý.\n\nThông tin chi tiết:\n- Mã đề nghị: ${request.maDeNghi}\n- Họ tên cán bộ: ${request.hoTen}\n- User AD: ${request.userAD} (Mã: ${request.maUserAD})\n- Phòng ban: ${request.maPhongBan} - ${request.tenPhongBan}\n- Chương trình: ${request.tenChuongTrinh}\n- Loại đề nghị: ${request.loaiDeNghi}\n- Số QĐ/Phân công NV: ${request.soQDTuyenDung_PhanCong}\n- Người phê duyệt: ${currentUser.hoTen} (${currentUser.userAD})\n- Thời gian phê duyệt: ${thoiGianDuyet}\n\nTrân trọng thông báo.`;

    db.emails.unshift({
      id: `mail-${Date.now()}`,
      to: db.config.itEmail,
      subject: emailSubject,
      body: emailBody,
      thoiGian: thoiGianDuyet,
      maDeNghi: request.maDeNghi,
      loai: 'Phê duyệt',
      read: false
    });

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'PHÊ_DUYỆT_ĐỀ_NGHỊ',
      request.maDeNghi,
      `Phê duyệt đề nghị ${request.maDeNghi}, hệ thống đã gửi email thông báo tới ${db.config.itEmail}`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã phê duyệt đề nghị ${request.maDeNghi}. Hệ thống đã gửi thông báo đến cán bộ điện toán (${db.config.itEmail}).`,
      data: request
    });
  });

  // Từ chối bởi Lãnh đạo phòng
  app.post('/api/requests/:id/reject', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    if (currentUser.chucVu !== 'Lãnh đạo phòng' && currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Lãnh đạo phòng mới có quyền từ chối đề nghị.' });
    }

    const { id } = req.params;
    const { lyDo } = req.body;

    if (!lyDo || !lyDo.trim()) {
      return res.status(400).json({ success: false, message: 'Bắt buộc nhập lý do từ chối đề nghị.' });
    }

    const request = db.requests.find(r => r.id === id || r.maDeNghi === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề nghị' });
    }

    if (currentUser.chucVu === 'Lãnh đạo phòng' && request.maPhongBan !== currentUser.maPhongBan) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền từ chối đề nghị này vì không cùng mã phòng ban.'
      });
    }

    const now = new Date();
    const thoiGianDuyet = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    request.trangThai = 'Từ chối';
    request.nguoiDuyet = `${currentUser.hoTen} (${currentUser.userAD})`;
    request.thoiGianDuyet = thoiGianDuyet;
    request.lyDoTuChoi = lyDo.trim();

    db.approvals.push({
      id: `app-${Date.now()}`,
      maDeNghi: request.maDeNghi,
      nguoiDuyet: currentUser.hoTen,
      userAD: currentUser.userAD,
      maPhongBan: currentUser.maPhongBan,
      ketQua: 'Từ chối',
      lyDo: lyDo.trim(),
      thoiGian: thoiGianDuyet
    });

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'TỪ_CHỐI_ĐỀ_NGHỊ',
      request.maDeNghi,
      `Từ chối đề nghị ${request.maDeNghi}. Lý do: ${lyDo.trim()}`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã từ chối đề nghị ${request.maDeNghi}.`,
      data: request
    });
  });

  // Tiếp nhận xử lý (Điện toán)
  app.post('/api/requests/:id/claim', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    if (currentUser.chucVu !== 'Cán bộ điện toán' && currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Cán bộ điện toán mới có quyền tiếp nhận xử lý.' });
    }

    const { id } = req.params;
    const request = db.requests.find(r => r.id === id || r.maDeNghi === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề nghị' });
    }

    const now = new Date();
    const thoiGianNhan = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    request.nguoiXuLy = `${currentUser.hoTen} (${currentUser.userAD})`;
    request.thoiGianNhan = thoiGianNhan;

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'TIẾP_NHẬN_XỬ_LÝ',
      request.maDeNghi,
      `Tiếp nhận đề nghị ${request.maDeNghi} để thực hiện trên chương trình nội bộ`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã tiếp nhận đề nghị ${request.maDeNghi}.`,
      data: request
    });
  });

  // Hoàn thành xử lý (Điện toán)
  app.post('/api/requests/:id/complete', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    if (currentUser.chucVu !== 'Cán bộ điện toán' && currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Cán bộ điện toán mới có quyền cập nhật Hoàn thành.' });
    }

    const { id } = req.params;
    const {
      ketQuaXuLy,
      noiDungXuLy,
      nhomQuyenGoiY,
      nhomQuyenThucTe,
      maNhomQuyenThucTe,
      canhBaoCauHinh,
      canCuVanBan,
      ghiChuXuLy
    } = req.body;

    const request = db.requests.find(r => r.id === id || r.maDeNghi === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề nghị' });
    }

    if (request.trangThai !== 'Chờ xử lý') {
      return res.status(400).json({
        success: false,
        message: `Đề nghị đang ở trạng thái "${request.trangThai}", chỉ có thể hoàn thành đề nghị "Chờ xử lý".`
      });
    }

    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const thoiGianHoanThanh = `${day}/${month}/${year} ${timeStr}`;
    const ngayCapQuyen = `${day}/${month}/${year}`; // MANDATORY RULE: Ngày hoàn thành của điện toán

    request.trangThai = 'Hoàn thành';
    request.nguoiXuLy = `${currentUser.hoTen} (${currentUser.userAD})`;
    request.thoiGianHoanThanh = thoiGianHoanThanh;
    request.ngayCapQuyen = ngayCapQuyen;
    request.ketQuaXuLy = ketQuaXuLy || `Đã thực hiện ${request.loaiDeNghi} thành công trên chương trình nội bộ VietinBank`;
    request.noiDungXuLy = noiDungXuLy || 'Đã phân quyền theo đúng nội dung đề nghị và biên bản/quyết định phê duyệt';
    if (nhomQuyenGoiY) request.nhomQuyenGoiY = nhomQuyenGoiY;
    if (nhomQuyenThucTe) request.nhomQuyenThucTe = nhomQuyenThucTe;
    if (maNhomQuyenThucTe) request.maNhomQuyenThucTe = maNhomQuyenThucTe;
    if (canhBaoCauHinh) request.canhBaoCauHinh = canhBaoCauHinh;
    if (canCuVanBan) request.canCuVanBan = canCuVanBan;
    if (ghiChuXuLy) request.ghiChuXuLy = ghiChuXuLy;

    // Record processing history
    db.processing.push({
      id: `proc-${Date.now()}`,
      maDeNghi: request.maDeNghi,
      nguoiXuLy: currentUser.hoTen,
      userAD: currentUser.userAD,
      thoiGianNhan: request.thoiGianNhan || thoiGianHoanThanh,
      thoiGianXuLy: thoiGianHoanThanh,
      ketQua: request.ketQuaXuLy,
      noiDungXuLy: request.noiDungXuLy,
      maNhomQuyenGoiY: nhomQuyenGoiY,
      tenNhomQuyenGoiY: nhomQuyenGoiY,
      maNhomQuyenThucTe: maNhomQuyenThucTe || nhomQuyenThucTe,
      tenNhomQuyenThucTe: nhomQuyenThucTe,
      canCuVanBan
    });

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'HOÀN_THÀNH_XỬ_LÝ',
      request.maDeNghi,
      `Đã cập nhật Hoàn thành đề nghị ${request.maDeNghi}, ngày cấp quyền ghi nhận: ${ngayCapQuyen}, nhóm quyền: ${nhomQuyenThucTe || 'Mặc định'}, tự động đồng bộ Bảng Tổng hợp`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã hoàn thành xử lý đề nghị ${request.maDeNghi}. Ngày cấp quyền (${ngayCapQuyen}) và Bảng Tổng Hợp đã được tự động cập nhật.`,
      data: request
    });
  });

  // 3. Summary Matrix
  app.get('/api/summary-matrix', (req, res) => {
    const matrix = db.getSummaryMatrix();
    res.json({
      success: true,
      data: {
        programs: db.programs,
        rows: matrix
      }
    });
  });

  // 4. Master Data: Departments
  app.get('/api/departments', (req, res) => {
    res.json({ success: true, data: db.departments });
  });

  app.post('/api/departments', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền quản lý danh mục phòng ban.' });
    }

    const { maPhongBan, tenPhongBan, moTa, trangThai } = req.body;
    if (!maPhongBan || !tenPhongBan) {
      return res.status(400).json({ success: false, message: 'Mã phòng ban và Tên phòng ban là bắt buộc.' });
    }

    const existing = db.departments.find(d => d.maPhongBan.toUpperCase() === maPhongBan.trim().toUpperCase());
    if (existing) {
      return res.status(400).json({ success: false, message: `Mã phòng ban ${maPhongBan} đã tồn tại.` });
    }

    const newDept: PhongBan = {
      id: `dept-${Date.now()}`,
      maPhongBan: maPhongBan.trim().toUpperCase(),
      tenPhongBan: tenPhongBan.trim(),
      moTa: moTa?.trim() || '',
      trangThai: trangThai || 'Hoạt động'
    };

    db.departments.push(newDept);
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_PHÒNG_BAN', undefined, `Thêm phòng ban ${newDept.maPhongBan} - ${newDept.tenPhongBan}`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm phòng ban thành công.', data: newDept });
  });

  app.put('/api/departments/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền cập nhật phòng ban.' });
    }

    const { id } = req.params;
    const dept = db.departments.find(d => d.id === id || d.maPhongBan === id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban.' });
    }

    const { tenPhongBan, moTa, trangThai } = req.body;
    if (tenPhongBan) dept.tenPhongBan = tenPhongBan.trim();
    if (moTa !== undefined) dept.moTa = moTa.trim();
    if (trangThai) dept.trangThai = trangThai;

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_PHÒNG_BAN', undefined, `Cập nhật phòng ban ${dept.maPhongBan} (Trạng thái: ${dept.trangThai})`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật phòng ban thành công.', data: dept });
  });

  // 5. Master Data: Programs
  app.get('/api/programs', (req, res) => {
    res.json({ success: true, data: db.programs });
  });

  app.post('/api/programs', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền thêm chương trình.' });
    }

    const { maChuongTrinh, tenChuongTrinh, moTa, trangThai, phamVi, moTaNghiepVu, ghiChuChung, nhomQuyenMacDinh } = req.body;
    if (!maChuongTrinh || !tenChuongTrinh) {
      return res.status(400).json({ success: false, message: 'Mã chương trình và Tên chương trình là bắt buộc.' });
    }

    const existing = db.programs.find(p => p.maChuongTrinh.toUpperCase() === maChuongTrinh.trim().toUpperCase());
    if (existing) {
      return res.status(400).json({ success: false, message: `Mã chương trình ${maChuongTrinh} đã tồn tại.` });
    }

    const newProg: ChuongTrinh = {
      id: `prog-${Date.now()}`,
      maChuongTrinh: maChuongTrinh.trim().toUpperCase(),
      tenChuongTrinh: tenChuongTrinh.trim(),
      moTa: moTa?.trim() || '',
      phamVi: phamVi?.trim() || '',
      moTaNghiepVu: moTaNghiepVu?.trim() || '',
      ghiChuChung: ghiChuChung?.trim() || '',
      nhomQuyenMacDinh: nhomQuyenMacDinh?.trim() || '',
      trangThai: trangThai || 'Hoạt động'
    };

    db.programs.push(newProg);
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_CHƯƠNG_TRÌNH', undefined, `Thêm chương trình ${newProg.maChuongTrinh} - ${newProg.tenChuongTrinh}`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm chương trình thành công. Bảng Tổng Hợp sẽ tự động sinh nhóm cột mới.', data: newProg });
  });

  app.put('/api/programs/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền cập nhật chương trình.' });
    }

    const { id } = req.params;
    const prog = db.programs.find(p => p.id === id || p.maChuongTrinh === id);
    if (!prog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chương trình.' });
    }

    const { tenChuongTrinh, moTa, trangThai, phamVi, moTaNghiepVu, ghiChuChung, nhomQuyenMacDinh } = req.body;
    if (tenChuongTrinh) prog.tenChuongTrinh = tenChuongTrinh.trim();
    if (moTa !== undefined) prog.moTa = moTa.trim();
    if (phamVi !== undefined) prog.phamVi = phamVi.trim();
    if (moTaNghiepVu !== undefined) prog.moTaNghiepVu = moTaNghiepVu.trim();
    if (ghiChuChung !== undefined) prog.ghiChuChung = ghiChuChung.trim();
    if (nhomQuyenMacDinh !== undefined) prog.nhomQuyenMacDinh = nhomQuyenMacDinh.trim();
    if (trangThai) prog.trangThai = trangThai;

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_CHƯƠNG_TRÌNH', undefined, `Cập nhật cấu hình chương trình ${prog.maChuongTrinh} (Trạng thái: ${prog.trangThai})`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật chương trình thành công.', data: prog });
  });

  // V1.2 Reference & Guidelines APIs:

  // A. APP_PERMISSION_RULES
  app.get('/api/permission-rules', (req, res) => {
    const { maChuongTrinh } = req.query;
    let rules = db.permissionRules;
    if (maChuongTrinh) {
      rules = rules.filter(r => r.maChuongTrinh === maChuongTrinh);
    }
    res.json({ success: true, data: rules });
  });

  app.post('/api/permission-rules', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền tạo quy tắc cấp quyền.' });
    }

    const { maChuongTrinh, tenChuongTrinh, maPhongBan, tenPhongBan, doiTuong, chucVu, maNhomQuyen, tenNhomQuyen, dieuKien, luuY, trangThai } = req.body;
    if (!maChuongTrinh || !maPhongBan || !doiTuong || !maNhomQuyen) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ các thông tin bắt buộc của quy tắc cấp quyền.' });
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newRule: AppPermissionRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: maChuongTrinh.trim(),
      tenChuongTrinh: tenChuongTrinh?.trim() || maChuongTrinh.trim(),
      maPhongBan: maPhongBan.trim(),
      tenPhongBan: tenPhongBan?.trim() || maPhongBan.trim(),
      doiTuong: doiTuong.trim(),
      chucVu: chucVu?.trim() || doiTuong.trim(),
      maNhomQuyen: maNhomQuyen.trim(),
      tenNhomQuyen: tenNhomQuyen?.trim() || maNhomQuyen.trim(),
      dieuKien: dieuKien?.trim() || '',
      luuY: luuY?.trim() || '',
      trangThai: trangThai || 'Hoạt động',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: currentUser.userAD
    };

    db.permissionRules.push(newRule);
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_QUY_TẮC_CẤP_QUYỀN', undefined, `Thêm quy tắc cấp quyền: [${newRule.maChuongTrinh}] ${newRule.tenPhongBan} - ${newRule.tenNhomQuyen}`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm quy tắc cấp quyền thành công.', data: newRule });
  });

  app.put('/api/permission-rules/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền cập nhật quy tắc cấp quyền.' });
    }

    const { id } = req.params;
    const rule = db.permissionRules.find(r => r.id === id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy quy tắc cấp quyền.' });
    }

    const { maPhongBan, tenPhongBan, doiTuong, chucVu, maNhomQuyen, tenNhomQuyen, dieuKien, luuY, trangThai } = req.body;
    if (maPhongBan) rule.maPhongBan = maPhongBan.trim();
    if (tenPhongBan) rule.tenPhongBan = tenPhongBan.trim();
    if (doiTuong) rule.doiTuong = doiTuong.trim();
    if (chucVu) rule.chucVu = chucVu.trim();
    if (maNhomQuyen) rule.maNhomQuyen = maNhomQuyen.trim();
    if (tenNhomQuyen) rule.tenNhomQuyen = tenNhomQuyen.trim();
    if (dieuKien !== undefined) rule.dieuKien = dieuKien.trim();
    if (luuY !== undefined) rule.luuY = luuY.trim();
    if (trangThai) rule.trangThai = trangThai;

    const now = new Date();
    rule.ngayCapNhat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    rule.nguoiCapNhat = currentUser.userAD;

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_QUY_TẮC_CẤP_QUYỀN', undefined, `Cập nhật quy tắc [${rule.maChuongTrinh}] ${rule.tenNhomQuyen} (Trạng thái: ${rule.trangThai})`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật quy tắc cấp quyền.', data: rule });
  });

  app.delete('/api/permission-rules/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền xóa quy tắc.' });
    }

    const { id } = req.params;
    const index = db.permissionRules.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy quy tắc.' });
    }

    const removed = db.permissionRules.splice(index, 1)[0];
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'XÓA_QUY_TẮC_CẤP_QUYỀN', undefined, `Xóa quy tắc cấp quyền [${removed.maChuongTrinh}] ${removed.tenNhomQuyen}`, 'Thành công');

    res.json({ success: true, message: 'Đã xóa quy tắc cấp quyền thành công.' });
  });

  // B. APP_PERMISSION_GROUPS
  app.get('/api/permission-groups', (req, res) => {
    const { maChuongTrinh } = req.query;
    let groups = db.permissionGroups;
    if (maChuongTrinh) {
      groups = groups.filter(g => g.maChuongTrinh === maChuongTrinh);
    }
    res.json({ success: true, data: groups });
  });

  app.post('/api/permission-groups', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền tạo nhóm quyền.' });
    }

    const { maChuongTrinh, maNhomQuyen, tenNhomQuyen, moTa, doiTuongApDung, phongBanApDung, trangThai } = req.body;
    if (!maChuongTrinh || !maNhomQuyen || !tenNhomQuyen) {
      return res.status(400).json({ success: false, message: 'Mã chương trình, Mã nhóm quyền và Tên nhóm quyền là bắt buộc.' });
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newGroup: AppPermissionGroup = {
      id: `grp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: maChuongTrinh.trim(),
      maNhomQuyen: maNhomQuyen.trim().toUpperCase(),
      tenNhomQuyen: tenNhomQuyen.trim(),
      moTa: moTa?.trim() || '',
      doiTuongApDung: doiTuongApDung?.trim() || '',
      phongBanApDung: phongBanApDung?.trim() || '',
      trangThai: trangThai || 'Hoạt động',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: currentUser.userAD
    };

    db.permissionGroups.push(newGroup);
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_NHÓM_QUYỀN', undefined, `Thêm nhóm quyền [${newGroup.maChuongTrinh}] ${newGroup.maNhomQuyen} - ${newGroup.tenNhomQuyen}`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm nhóm quyền thành công.', data: newGroup });
  });

  app.put('/api/permission-groups/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền sửa nhóm quyền.' });
    }

    const { id } = req.params;
    const group = db.permissionGroups.find(g => g.id === id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhóm quyền.' });
    }

    const { tenNhomQuyen, moTa, doiTuongApDung, phongBanApDung, trangThai } = req.body;
    if (tenNhomQuyen) group.tenNhomQuyen = tenNhomQuyen.trim();
    if (moTa !== undefined) group.moTa = moTa.trim();
    if (doiTuongApDung !== undefined) group.doiTuongApDung = doiTuongApDung.trim();
    if (phongBanApDung !== undefined) group.phongBanApDung = phongBanApDung.trim();
    if (trangThai) group.trangThai = trangThai;

    const now = new Date();
    group.ngayCapNhat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    group.nguoiCapNhat = currentUser.userAD;

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_NHÓM_QUYỀN', undefined, `Cập nhật nhóm quyền [${group.maChuongTrinh}] ${group.maNhomQuyen} (Trạng thái: ${group.trangThai})`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật nhóm quyền.', data: group });
  });

  app.delete('/api/permission-groups/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền xóa nhóm quyền.' });
    }

    const { id } = req.params;
    const index = db.permissionGroups.findIndex(g => g.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhóm quyền.' });
    }

    const removed = db.permissionGroups.splice(index, 1)[0];
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'XÓA_NHÓM_QUYỀN', undefined, `Xóa nhóm quyền [${removed.maChuongTrinh}] ${removed.maNhomQuyen}`, 'Thành công');

    res.json({ success: true, message: 'Đã xóa nhóm quyền thành công.' });
  });

  // C. APP_REGULATIONS
  app.get('/api/regulations', (req, res) => {
    const { maChuongTrinh } = req.query;
    let regs = db.regulations;
    if (maChuongTrinh) {
      regs = regs.filter(r => r.maChuongTrinh === maChuongTrinh);
    }
    res.json({ success: true, data: regs });
  });

  app.post('/api/regulations', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền thêm văn bản căn cứ.' });
    }

    const { maChuongTrinh, tenChuongTrinh, maVanBan, tenVanBan, soVanBan, ngayBanHanh, ngayHieuLuc, donViBanHanh, noiDung, trangThai, ghiChu, linkVanBan } = req.body;
    if (!maChuongTrinh || !tenVanBan || !soVanBan) {
      return res.status(400).json({ success: false, message: 'Chương trình, Tên văn bản và Số văn bản là bắt buộc.' });
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newReg: AppRegulation = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: maChuongTrinh.trim(),
      tenChuongTrinh: tenChuongTrinh?.trim() || maChuongTrinh.trim(),
      maVanBan: maVanBan?.trim() || `VB-${maChuongTrinh}-${Date.now().toString().slice(-4)}`,
      tenVanBan: tenVanBan.trim(),
      soVanBan: soVanBan.trim(),
      ngayBanHanh: ngayBanHanh?.trim() || '',
      ngayHieuLuc: ngayHieuLuc?.trim() || '',
      donViBanHanh: donViBanHanh?.trim() || 'VietinBank',
      noiDung: noiDung?.trim() || '',
      trangThai: trangThai || 'Còn hiệu lực',
      ghiChu: ghiChu?.trim() || '',
      linkVanBan: linkVanBan?.trim() || '',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: currentUser.userAD
    };

    db.regulations.push(newReg);
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_VĂN_BẢN_CĂN_CỨ', undefined, `Thêm văn bản [${newReg.maChuongTrinh}] Số ${newReg.soVanBan}: ${newReg.tenVanBan}`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm văn bản căn cứ thành công.', data: newReg });
  });

  app.put('/api/regulations/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền cập nhật văn bản.' });
    }

    const { id } = req.params;
    const reg = db.regulations.find(r => r.id === id);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy văn bản.' });
    }

    const { maVanBan, tenVanBan, soVanBan, ngayBanHanh, ngayHieuLuc, donViBanHanh, noiDung, trangThai, ghiChu, linkVanBan } = req.body;
    if (maVanBan) reg.maVanBan = maVanBan.trim();
    if (tenVanBan) reg.tenVanBan = tenVanBan.trim();
    if (soVanBan) reg.soVanBan = soVanBan.trim();
    if (ngayBanHanh !== undefined) reg.ngayBanHanh = ngayBanHanh.trim();
    if (ngayHieuLuc !== undefined) reg.ngayHieuLuc = ngayHieuLuc.trim();
    if (donViBanHanh !== undefined) reg.donViBanHanh = donViBanHanh.trim();
    if (noiDung !== undefined) reg.noiDung = noiDung.trim();
    if (trangThai) reg.trangThai = trangThai;
    if (ghiChu !== undefined) reg.ghiChu = ghiChu.trim();
    if (linkVanBan !== undefined) reg.linkVanBan = linkVanBan.trim();

    const now = new Date();
    reg.ngayCapNhat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    reg.nguoiCapNhat = currentUser.userAD;

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_VĂN_BẢN_CĂN_CỨ', undefined, `Cập nhật văn bản [${reg.maChuongTrinh}] Số ${reg.soVanBan} (Trạng thái: ${reg.trangThai})`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật văn bản căn cứ.', data: reg });
  });

  app.delete('/api/regulations/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền xóa văn bản.' });
    }

    const { id } = req.params;
    const index = db.regulations.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy văn bản.' });
    }

    const removed = db.regulations.splice(index, 1)[0];
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'XÓA_VĂN_BẢN_CĂN_CỨ', undefined, `Xóa văn bản [${removed.maChuongTrinh}] Số ${removed.soVanBan}`, 'Thành công');

    res.json({ success: true, message: 'Đã xóa văn bản căn cứ thành công.' });
  });

  // D. APP_NOTES
  app.get('/api/notes', (req, res) => {
    const { maChuongTrinh } = req.query;
    let notes = db.notes;
    if (maChuongTrinh) {
      notes = notes.filter(n => n.maChuongTrinh === maChuongTrinh);
    }
    res.json({ success: true, data: notes });
  });

  app.post('/api/notes', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền thêm lưu ý/hướng dẫn.' });
    }

    const { maChuongTrinh, loaiLuuY, noiDung, dieuKienApDung, trangThai } = req.body;
    if (!maChuongTrinh || !loaiLuuY || !noiDung) {
      return res.status(400).json({ success: false, message: 'Chương trình, Loại lưu ý và Nội dung là bắt buộc.' });
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newNote: AppNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      maChuongTrinh: maChuongTrinh.trim(),
      loaiLuuY: loaiLuuY || 'Lưu ý',
      noiDung: noiDung.trim(),
      dieuKienApDung: dieuKienApDung?.trim() || '',
      trangThai: trangThai || 'Hoạt động',
      ngayCapNhat: formattedDate,
      nguoiCapNhat: currentUser.userAD
    };

    db.notes.push(newNote);
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_LƯU_Ý_HƯỚNG_DẪN', undefined, `Thêm [${newNote.loaiLuuY}] cho [${newNote.maChuongTrinh}]`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm lưu ý thành công.', data: newNote });
  });

  app.put('/api/notes/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền cập nhật lưu ý.' });
    }

    const { id } = req.params;
    const note = db.notes.find(n => n.id === id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lưu ý.' });
    }

    const { loaiLuuY, noiDung, dieuKienApDung, trangThai } = req.body;
    if (loaiLuuY) note.loaiLuuY = loaiLuuY;
    if (noiDung) note.noiDung = noiDung.trim();
    if (dieuKienApDung !== undefined) note.dieuKienApDung = dieuKienApDung.trim();
    if (trangThai) note.trangThai = trangThai;

    const now = new Date();
    note.ngayCapNhat = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    note.nguoiCapNhat = currentUser.userAD;

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_LƯU_Ý_HƯỚNG_DẪN', undefined, `Cập nhật [${note.loaiLuuY}] [${note.maChuongTrinh}]`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật lưu ý.', data: note });
  });

  app.delete('/api/notes/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền xóa lưu ý.' });
    }

    const { id } = req.params;
    const index = db.notes.findIndex(n => n.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lưu ý.' });
    }

    const removed = db.notes.splice(index, 1)[0];
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'XÓA_LƯU_Ý_HƯỚNG_DẪN', undefined, `Xóa [${removed.loaiLuuY}] của [${removed.maChuongTrinh}]`, 'Thành công');

    res.json({ success: true, message: 'Đã xóa lưu ý thành công.' });
  });

  // 6. Master Data: Users
  app.get('/api/users', (req, res) => {
    res.json({ success: true, data: db.users });
  });

  app.post('/api/users', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền quản lý người dùng.' });
    }

    const { maUserAD, hoTen, userAD, maPhongBan, chucVu, trangThai, matKhau, email, soDienThoai } = req.body;
    if (!maUserAD || !hoTen || !userAD || !maPhongBan || !chucVu) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ các trường bắt buộc.' });
    }

    const dept = db.departments.find(d => d.maPhongBan === maPhongBan);
    if (!dept) {
      return res.status(400).json({ success: false, message: 'Phòng ban không hợp lệ.' });
    }

    const existingUser = db.users.find(u => u.userAD.toLowerCase() === userAD.trim().toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: `Tài khoản User AD "${userAD.trim()}" đã tồn tại trong hệ thống.` });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      maUserAD: maUserAD.trim(),
      hoTen: hoTen.trim(),
      userAD: userAD.trim().toLowerCase(),
      maPhongBan: dept.maPhongBan,
      tenPhongBan: dept.tenPhongBan,
      chucVu,
      trangThai: trangThai || 'Hoạt động',
      matKhau: matKhau || '123456',
      email: email || `${userAD.trim().toLowerCase()}@vietinbank.vn`,
      soDienThoai: soDienThoai || ''
    };

    db.users.push(newUser);

    // Sync to staff if matching
    const matchingStaff = db.staff.find(s => s.userAD && s.userAD.toLowerCase() === newUser.userAD);
    if (matchingStaff) {
      matchingStaff.maUserAD = newUser.maUserAD;
      matchingStaff.matKhau = newUser.matKhau;
      matchingStaff.vaiTro = newUser.chucVu;
      matchingStaff.hasAccount = true;
    }

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_USER', undefined, `Thêm người dùng ${newUser.userAD} (${newUser.hoTen})`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm User thành công.', data: newUser });
  });

  app.put('/api/users/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền sửa người dùng.' });
    }

    const { id } = req.params;
    const user = db.users.find(u => u.id === id || u.userAD === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const { hoTen, maPhongBan, chucVu, trangThai, matKhau, email, soDienThoai } = req.body;
    if (hoTen) user.hoTen = hoTen.trim();
    if (maPhongBan) {
      const dept = db.departments.find(d => d.maPhongBan === maPhongBan);
      if (dept) {
        user.maPhongBan = dept.maPhongBan;
        user.tenPhongBan = dept.tenPhongBan;
      }
    }
    if (chucVu) user.chucVu = chucVu;
    if (trangThai) user.trangThai = trangThai;
    if (matKhau) user.matKhau = matKhau;
    if (email) user.email = email.trim();
    if (soDienThoai !== undefined) user.soDienThoai = soDienThoai.trim();

    // Sync with staff
    const matchingStaff = db.staff.find(s => s.userAD && s.userAD.toLowerCase() === user.userAD.toLowerCase());
    if (matchingStaff) {
      matchingStaff.hoTen = user.hoTen;
      matchingStaff.maPhongBan = user.maPhongBan;
      matchingStaff.tenPhongBan = user.tenPhongBan;
      if (matKhau) matchingStaff.matKhau = matKhau;
      if (chucVu) matchingStaff.vaiTro = chucVu;
      if (email) matchingStaff.email = email;
      if (soDienThoai) matchingStaff.soDienThoai = soDienThoai;
    }

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_USER', undefined, `Cập nhật thông tin User ${user.userAD}`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật User thành công.', data: user });
  });

  // Reset Password for User
  app.post('/api/users/:id/reset-password', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền Reset mật khẩu người dùng.' });
    }

    const { id } = req.params;
    const user = db.users.find(u => u.id === id || u.userAD === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const { newPassword } = req.body;
    const finalPassword = newPassword && newPassword.trim() ? newPassword.trim() : '123456';
    user.matKhau = finalPassword;

    // Sync with staff
    const matchingStaff = db.staff.find(s => s.userAD && s.userAD.toLowerCase() === user.userAD.toLowerCase());
    if (matchingStaff) {
      matchingStaff.matKhau = finalPassword;
    }

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'RESET_MẬT_KHẨU_USER',
      undefined,
      `Admin đã Reset mật khẩu cho tài khoản ${user.userAD} (${user.hoTen}) thành công`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã Reset mật khẩu cho User ${user.userAD} thành công. Mật khẩu mới: ${finalPassword}`,
      newPassword: finalPassword,
      data: user
    });
  });

  // 7. Master Data: Staff (Cán bộ)
  app.get('/api/staff', (req, res) => {
    res.json({ success: true, data: db.staff });
  });

  app.post('/api/staff', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền quản lý cán bộ.' });
    }

    const { maCanBo, hoTen, userAD, maUserAD, matKhau, email, soDienThoai, vaiTro, maPhongBan, chucVu, trangThai } = req.body;
    if (!maCanBo || !hoTen || !maPhongBan) {
      return res.status(400).json({ success: false, message: 'Mã cán bộ, Họ tên và Phòng ban là bắt buộc.' });
    }

    const dept = db.departments.find(d => d.maPhongBan === maPhongBan);
    const cleanUserAD = userAD ? userAD.trim().toLowerCase() : '';
    const cleanMatKhau = matKhau || (cleanUserAD ? '123456' : '');
    const cleanVaiTro = vaiTro || 'Cán bộ';
    const hasAccount = !!cleanUserAD;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newStaff: CanBo = {
      id: `cb-${Date.now()}`,
      maCanBo: maCanBo.trim().toUpperCase(),
      hoTen: hoTen.trim(),
      maUserAD: maUserAD ? maUserAD.trim() : (cleanUserAD ? String(db.users.length + 1).padStart(8, '0') : ''),
      userAD: cleanUserAD,
      matKhau: cleanMatKhau,
      email: email || (cleanUserAD ? `${cleanUserAD}@vietinbank.vn` : ''),
      soDienThoai: soDienThoai || '',
      vaiTro: cleanVaiTro,
      maPhongBan: dept ? dept.maPhongBan : maPhongBan,
      tenPhongBan: dept ? dept.tenPhongBan : '',
      chucVu: chucVu || 'Cán bộ',
      trangThai: trangThai || 'Đang làm việc',
      hasAccount,
      ngayCapTaiKhoan: hasAccount ? formattedDate : undefined
    };

    db.staff.push(newStaff);

    // If account info is provided, ensure corresponding user exists in db.users
    if (cleanUserAD) {
      let existingUser = db.users.find(u => u.userAD.toLowerCase() === cleanUserAD);
      if (!existingUser) {
        existingUser = {
          id: `user-${Date.now()}`,
          maUserAD: newStaff.maUserAD || String(db.users.length + 1).padStart(8, '0'),
          hoTen: newStaff.hoTen,
          userAD: cleanUserAD,
          maPhongBan: newStaff.maPhongBan,
          tenPhongBan: newStaff.tenPhongBan,
          chucVu: cleanVaiTro,
          trangThai: 'Hoạt động',
          matKhau: cleanMatKhau || '123456',
          email: newStaff.email || `${cleanUserAD}@vietinbank.vn`,
          soDienThoai: newStaff.soDienThoai || ''
        };
        db.users.push(existingUser);
      } else {
        existingUser.hoTen = newStaff.hoTen;
        existingUser.maPhongBan = newStaff.maPhongBan;
        existingUser.tenPhongBan = newStaff.tenPhongBan;
        existingUser.matKhau = cleanMatKhau || existingUser.matKhau || '123456';
        existingUser.chucVu = cleanVaiTro;
      }
    }

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'THÊM_CÁN_BỘ', undefined, `Thêm cán bộ ${newStaff.maCanBo} - ${newStaff.hoTen} ${cleanUserAD ? `(Cấp User: ${cleanUserAD})` : ''}`, 'Thành công');

    res.json({ success: true, message: 'Đã thêm cán bộ thành công.', data: newStaff });
  });

  app.put('/api/staff/:id', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền sửa cán bộ.' });
    }

    const { id } = req.params;
    const staffMember = db.staff.find(s => s.id === id || s.maCanBo === id);
    if (!staffMember) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy cán bộ.' });
    }

    const { hoTen, userAD, maUserAD, matKhau, email, soDienThoai, vaiTro, maPhongBan, chucVu, trangThai } = req.body;
    if (hoTen) staffMember.hoTen = hoTen.trim();
    if (maPhongBan) {
      const dept = db.departments.find(d => d.maPhongBan === maPhongBan);
      if (dept) {
        staffMember.maPhongBan = dept.maPhongBan;
        staffMember.tenPhongBan = dept.tenPhongBan;
      }
    }
    if (chucVu) staffMember.chucVu = chucVu;
    if (trangThai) staffMember.trangThai = trangThai;
    if (email !== undefined) staffMember.email = email.trim();
    if (soDienThoai !== undefined) staffMember.soDienThoai = soDienThoai.trim();
    if (vaiTro) staffMember.vaiTro = vaiTro;
    if (matKhau) staffMember.matKhau = matKhau;
    if (maUserAD) staffMember.maUserAD = maUserAD.trim();

    if (userAD !== undefined) {
      const cleanUserAD = userAD.trim().toLowerCase();
      staffMember.userAD = cleanUserAD;
      if (cleanUserAD) {
        staffMember.hasAccount = true;
        if (!staffMember.matKhau) staffMember.matKhau = '123456';
        if (!staffMember.ngayCapTaiKhoan) {
          const now = new Date();
          staffMember.ngayCapTaiKhoan = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        }

        // Sync or create in db.users
        let user = db.users.find(u => u.userAD.toLowerCase() === cleanUserAD);
        if (!user) {
          user = {
            id: `user-${Date.now()}`,
            maUserAD: staffMember.maUserAD || String(db.users.length + 1).padStart(8, '0'),
            hoTen: staffMember.hoTen,
            userAD: cleanUserAD,
            maPhongBan: staffMember.maPhongBan,
            tenPhongBan: staffMember.tenPhongBan,
            chucVu: staffMember.vaiTro || 'Cán bộ',
            trangThai: 'Hoạt động',
            matKhau: staffMember.matKhau || '123456',
            email: staffMember.email || `${cleanUserAD}@vietinbank.vn`,
            soDienThoai: staffMember.soDienThoai || ''
          };
          db.users.push(user);
        } else {
          user.hoTen = staffMember.hoTen;
          user.maPhongBan = staffMember.maPhongBan;
          user.tenPhongBan = staffMember.tenPhongBan;
          user.chucVu = staffMember.vaiTro || user.chucVu;
          if (staffMember.matKhau) user.matKhau = staffMember.matKhau;
          if (staffMember.email) user.email = staffMember.email;
          if (staffMember.soDienThoai) user.soDienThoai = staffMember.soDienThoai;
        }
      }
    }

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_CÁN_BỘ', undefined, `Cập nhật cán bộ ${staffMember.maCanBo} (${staffMember.hoTen})`, 'Thành công');

    res.json({ success: true, message: 'Đã cập nhật cán bộ thành công.', data: staffMember });
  });

  // Admin Reset Password for Staff
  app.post('/api/staff/:id/reset-password', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền Reset mật khẩu cán bộ.' });
    }

    const { id } = req.params;
    const staffMember = db.staff.find(s => s.id === id || s.maCanBo === id);
    if (!staffMember) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy cán bộ.' });
    }

    if (!staffMember.userAD) {
      return res.status(400).json({ success: false, message: 'Cán bộ này chưa được cấp User AD để đặt lại mật khẩu. Vui lòng cấp tài khoản trước.' });
    }

    const { newPassword } = req.body;
    const finalPassword = newPassword && newPassword.trim() ? newPassword.trim() : '123456';
    staffMember.matKhau = finalPassword;

    // Sync with User
    const user = db.users.find(u => u.userAD.toLowerCase() === staffMember.userAD.toLowerCase());
    if (user) {
      user.matKhau = finalPassword;
    } else {
      // Create user if not existed yet
      db.users.push({
        id: `user-${Date.now()}`,
        maUserAD: staffMember.maUserAD || String(db.users.length + 1).padStart(8, '0'),
        hoTen: staffMember.hoTen,
        userAD: staffMember.userAD.toLowerCase(),
        maPhongBan: staffMember.maPhongBan,
        tenPhongBan: staffMember.tenPhongBan,
        chucVu: staffMember.vaiTro || 'Cán bộ',
        trangThai: 'Hoạt động',
        matKhau: finalPassword,
        email: staffMember.email || `${staffMember.userAD}@vietinbank.vn`,
        soDienThoai: staffMember.soDienThoai || ''
      });
    }

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'RESET_MẬT_KHẨU_CÁN_BỘ',
      undefined,
      `Admin đã Reset mật khẩu cho cán bộ ${staffMember.hoTen} (${staffMember.maCanBo} - ${staffMember.userAD})`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã Reset mật khẩu cho cán bộ ${staffMember.hoTen} (${staffMember.userAD}) thành công.`,
      newPassword: finalPassword,
      data: staffMember
    });
  });

  // Admin Provision Account for Staff (Cấp tài khoản & mật khẩu đăng nhập cho cán bộ)
  app.post('/api/staff/:id/create-account', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền cấp tài khoản đăng nhập cho cán bộ.' });
    }

    const { id } = req.params;
    const staffMember = db.staff.find(s => s.id === id || s.maCanBo === id);
    if (!staffMember) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy cán bộ.' });
    }

    const { userAD, matKhau, vaiTro, email, soDienThoai, maUserAD } = req.body;
    if (!userAD || !userAD.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản User AD.' });
    }

    const cleanUserAD = userAD.trim().toLowerCase();
    const existingOtherStaff = db.staff.find(s => s.id !== staffMember.id && s.userAD && s.userAD.toLowerCase() === cleanUserAD);
    if (existingOtherStaff) {
      return res.status(400).json({ success: false, message: `Tài khoản User AD "${cleanUserAD}" đã được gán cho cán bộ khác (${existingOtherStaff.hoTen} - ${existingOtherStaff.maCanBo}).` });
    }

    const finalMatKhau = matKhau && matKhau.trim() ? matKhau.trim() : '123456';
    const finalVaiTro = vaiTro || 'Cán bộ';
    const finalEmail = email || `${cleanUserAD}@vietinbank.vn`;
    const finalMaUserAD = maUserAD || staffMember.maUserAD || String(db.users.length + 1).padStart(8, '0');

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    staffMember.userAD = cleanUserAD;
    staffMember.maUserAD = finalMaUserAD;
    staffMember.matKhau = finalMatKhau;
    staffMember.vaiTro = finalVaiTro;
    staffMember.email = finalEmail;
    if (soDienThoai) staffMember.soDienThoai = soDienThoai.trim();
    staffMember.hasAccount = true;
    staffMember.ngayCapTaiKhoan = formattedDate;

    // Create or update User record
    let user = db.users.find(u => u.userAD.toLowerCase() === cleanUserAD);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        maUserAD: finalMaUserAD,
        hoTen: staffMember.hoTen,
        userAD: cleanUserAD,
        maPhongBan: staffMember.maPhongBan,
        tenPhongBan: staffMember.tenPhongBan,
        chucVu: finalVaiTro,
        trangThai: 'Hoạt động',
        matKhau: finalMatKhau,
        email: finalEmail,
        soDienThoai: staffMember.soDienThoai || ''
      };
      db.users.push(user);
    } else {
      user.hoTen = staffMember.hoTen;
      user.maPhongBan = staffMember.maPhongBan;
      user.tenPhongBan = staffMember.tenPhongBan;
      user.chucVu = finalVaiTro;
      user.matKhau = finalMatKhau;
      user.email = finalEmail;
      if (staffMember.soDienThoai) user.soDienThoai = staffMember.soDienThoai;
      user.trangThai = 'Hoạt động';
    }

    db.logAudit(
      currentUser.userAD,
      currentUser.chucVu,
      'CẤP_TÀI_KHOẢN_CÁN_BỘ',
      undefined,
      `Admin đã Cấp tài khoản đăng nhập [${cleanUserAD}] (Vai trò: ${finalVaiTro}) cho cán bộ ${staffMember.hoTen} (${staffMember.maCanBo})`,
      'Thành công'
    );

    res.json({
      success: true,
      message: `Đã cấp tài khoản User AD [${cleanUserAD}] cho cán bộ ${staffMember.hoTen} thành công. Mật khẩu khởi tạo: ${finalMatKhau}`,
      data: staffMember,
      user
    });
  });

  // 8. Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    res.json({ success: true, data: db.auditLogs });
  });

  // 9. Emails Inbox (for ducnt4@vietinbank.vn)
  app.get('/api/emails', (req, res) => {
    res.json({ success: true, data: db.emails });
  });

  app.post('/api/emails/:id/mark-read', (req, res) => {
    const email = db.emails.find(e => e.id === req.params.id);
    if (email) email.read = true;
    res.json({ success: true });
  });

  // 10. System Config
  app.get('/api/config', (req, res) => {
    res.json({ success: true, data: db.config });
  });

  app.post('/api/config', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền chỉnh sửa cấu hình hệ thống.' });
    }

    const { itEmail, tenChiNhanh, diaChi, gasApiUrl } = req.body;
    if (itEmail) db.config.itEmail = itEmail.trim();
    if (tenChiNhanh) db.config.tenChiNhanh = tenChiNhanh.trim();
    if (diaChi) db.config.diaChi = diaChi.trim();
    if (gasApiUrl !== undefined) db.config.gasApiUrl = gasApiUrl.trim();

    db.logAudit(currentUser.userAD, currentUser.chucVu, 'SỬA_CẤU_HÌNH', undefined, 'Cập nhật tham số hệ thống', 'Thành công');
    res.json({ success: true, message: 'Đã lưu cấu hình hệ thống.', data: db.config });
  });

  // 11. System Reset
  app.post('/api/system/reset', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.chucVu !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền thiết lập lại dữ liệu.' });
    }

    db.reset();
    db.logAudit(currentUser.userAD, currentUser.chucVu, 'RESET_HỆ_THỐNG', undefined, 'Khôi phục dữ liệu mẫu VietinBank Ninh Bình', 'Cảnh báo');
    res.json({ success: true, message: 'Đã khôi phục dữ liệu mẫu hệ thống thành công.' });
  });

  // 12. Google Apps Script Code Generator
  app.get('/api/gas-code', (req, res) => {
    const gasCode = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT WEB API - HỆ THỐNG QUẢN LÝ ĐỀ NGHỊ CẤP QUYỀN CHƯƠNG TRÌNH
 * ĐƠN VỊ: VIETINBANK - CHI NHÁNH NINH BÌNH
 * PHIÊN BẢN: V1.0
 * EMAIL TIẾP NHẬN: ducnt4@vietinbank.vn
 * =========================================================================
 */

var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
var IT_EMAIL = "ducnt4@vietinbank.vn";

function doGet(e) {
  var action = e.parameter.action || "getRequests";
  var currentUser = e.parameter.currentUser ? JSON.parse(decodeURIComponent(e.parameter.currentUser)) : null;
  var result = {};

  try {
    if (action === "getRequests") {
      result = { success: true, data: getRequests(currentUser) };
    } else if (action === "getSummaryMatrix") {
      result = { success: true, data: getSummaryMatrix() };
    } else if (action === "getDepartments") {
      result = { success: true, data: getSheetData("PHONG_BAN") };
    } else if (action === "getPrograms") {
      result = { success: true, data: getSheetData("PROGRAMS") };
    } else if (action === "getUsers") {
      result = { success: true, data: getSheetData("USERS") };
    } else if (action === "getStaff") {
      result = { success: true, data: getSheetData("CAN_BO") };
    } else if (action === "getAuditLogs") {
      result = { success: true, data: getSheetData("AUDIT_LOG") };
    } else {
      result = { success: false, message: "Action không hợp lệ" };
    }
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var currentUser = data.currentUser;
  var payload = data.payload;
  var result = {};

  try {
    if (action === "createRequest") {
      result = createRequest(currentUser, payload);
    } else if (action === "approveRequest") {
      result = approveRequest(currentUser, payload);
    } else if (action === "rejectRequest") {
      result = rejectRequest(currentUser, payload);
    } else if (action === "completeRequest") {
      result = completeRequest(currentUser, payload);
    } else if (action === "saveDepartment") {
      result = saveDepartment(currentUser, payload);
    } else if (action === "saveProgram") {
      result = saveProgram(currentUser, payload);
    } else if (action === "saveUser") {
      result = saveUser(currentUser, payload);
    } else {
      result = { success: false, message: "Action POST không hợp lệ" };
    }
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Check if user has permission
function checkLeaderDepartment(currentUser, requestMaPhongBan) {
  if (currentUser.chucVu === "Admin") return true;
  if (currentUser.chucVu === "Lãnh đạo phòng" && currentUser.maPhongBan === requestMaPhongBan) return true;
  return false;
}
`;
    res.json({ success: true, data: gasCode });
  });

  // API 404 Guard: Prevent unmatched /api routes from falling through to Vite SPA index.html
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint không tồn tại: ${req.method} ${req.originalUrl}`
    });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VietinBank Ninh Binh Access Management System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
