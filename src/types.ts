export type UserRole = 'Cán bộ' | 'Lãnh đạo phòng' | 'Cán bộ điện toán' | 'Admin';

export type UserStatus = 'Hoạt động' | 'Khóa';
export type DepartmentStatus = 'Hoạt động' | 'Ngừng sử dụng';
export type ProgramStatus = 'Hoạt động' | 'Ngừng sử dụng';

export type RequestType = 'Cấp mới' | 'Thay đổi' | 'Hủy người dùng';

export type RequestStatus =
  | 'Đề nghị mới'
  | 'Chờ lãnh đạo phòng phê duyệt'
  | 'Chờ xử lý'
  | 'Từ chối'
  | 'Hoàn thành';

export interface User {
  id: string;
  maUserAD: string;
  hoTen: string;
  userAD: string;
  maPhongBan: string;
  tenPhongBan: string;
  chucVu: UserRole;
  trangThai: UserStatus;
  matKhau?: string;
  email?: string;
  soDienThoai?: string;
}

export interface CanBo {
  id: string;
  maCanBo: string;
  hoTen: string;
  maUserAD?: string;
  userAD: string;
  matKhau?: string;
  email?: string;
  soDienThoai?: string;
  vaiTro?: UserRole;
  maPhongBan: string;
  tenPhongBan: string;
  chucVu: string;
  trangThai: 'Đang làm việc' | 'Nghỉ việc' | 'Hoạt động' | 'Ngừng công tác' | 'Khóa';
  hasAccount?: boolean;
  ngayCapTaiKhoan?: string;
}

export interface PhongBan {
  id: string;
  maPhongBan: string;
  tenPhongBan: string;
  trangThai: DepartmentStatus | 'Hoạt động' | 'Tạm dừng';
  moTa?: string;
  ghiChu?: string;
}

export interface ChuongTrinh {
  id: string;
  maChuongTrinh: string;
  tenChuongTrinh: string;
  moTa?: string;
  nhomQuyenMacDinh?: string;
  ghiChu?: string;
  trangThai: ProgramStatus | 'Hoạt động' | 'Tạm dừng';
  // V1.2 Additions
  phamVi?: string; // Phạm vi sử dụng / các đơn vị được phép
  moTaNghiepVu?: string; // Mô tả chi tiết nghiệp vụ
  ghiChuChung?: string; // Ghi chú chung
}

// V1.2 New Entities
export interface AppPermissionRule {
  id: string;
  maChuongTrinh: string;
  tenChuongTrinh: string;
  maPhongBan: string;
  tenPhongBan: string;
  doiTuong: string; // Cán bộ / Lãnh đạo phòng / Quản trị viên
  chucVu: string; // Chức vụ tương ứng
  maNhomQuyen: string; // MAKER, CHECKER, APPROVER, VIEWER...
  tenNhomQuyen: string;
  dieuKien: string; // Điều kiện cấp quyền (VD: Có phân công nghiệp vụ)
  luuY?: string;
  trangThai: 'Hoạt động' | 'Ngừng sử dụng';
  ngayCapNhat: string;
  nguoiCapNhat: string;
}

export interface AppPermissionGroup {
  id: string;
  maChuongTrinh: string;
  maNhomQuyen: string;
  tenNhomQuyen: string;
  moTa: string;
  doiTuongApDung?: string;
  phongBanApDung?: string;
  trangThai: 'Hoạt động' | 'Ngừng sử dụng';
  ngayCapNhat: string;
  nguoiCapNhat: string;
}

export type RegulationStatus = 'Còn hiệu lực' | 'Hết hiệu lực' | 'Thay thế';

export interface AppRegulation {
  id: string;
  maChuongTrinh: string;
  tenChuongTrinh: string;
  maVanBan: string;
  tenVanBan: string;
  soVanBan: string;
  ngayBanHanh: string;
  ngayHieuLuc: string;
  donViBanHanh: string;
  noiDung: string;
  trangThai: RegulationStatus;
  ghiChu?: string;
  linkVanBan?: string;
  ngayCapNhat: string;
  nguoiCapNhat: string;
}

export type AppNoteType = 'Lưu ý' | 'Lưu ý quan trọng' | 'Cảnh báo' | 'Trường hợp đặc biệt';

export interface AppNote {
  id: string;
  maChuongTrinh: string;
  loaiLuuY: AppNoteType;
  noiDung: string;
  dieuKienApDung?: string;
  trangThai: 'Hoạt động' | 'Ngừng sử dụng';
  ngayCapNhat: string;
  nguoiCapNhat: string;
}

export interface RequestRecord {
  id: string;
  maDeNghi: string; // CN-YYYY-NNNN
  ngayTao: string; // ISO / formatted
  maUserAD: string;
  maCanBo?: string;
  hoTen: string;
  userAD: string;
  maPhongBan: string; // Snapshot at creation time
  tenPhongBan: string; // Snapshot at creation time
  maChuongTrinh: string;
  tenChuongTrinh: string;
  loaiDeNghi: RequestType;
  soQDTuyenDung_PhanCong: string;
  noiDung: string;
  trangThai: RequestStatus;
  
  // Approvals
  nguoiDuyet?: string;
  thoiGianDuyet?: string;
  lyDoTuChoi?: string;

  // Processing
  nguoiXuLy?: string;
  thoiGianNhan?: string;
  thoiGianHoanThanh?: string;
  ngayCapQuyen?: string; // Strictly the completion date by IT
  ketQuaXuLy?: string;
  noiDungXuLy?: string;

  // V1.2 Extensions for IT processing & regulation tracking
  nhomQuyenGoiY?: string;
  nhomQuyenThucTe?: string;
  maNhomQuyenThucTe?: string;
  canhBaoCauHinh?: string;
  canCuVanBan?: string;
  ghiChuXuLy?: string;
}

export interface ApprovalHistory {
  id: string;
  maDeNghi: string;
  nguoiDuyet: string;
  userAD: string;
  maPhongBan: string;
  ketQua: 'Phê duyệt' | 'Từ chối';
  lyDo?: string;
  thoiGian: string;
}

export interface ProcessingHistory {
  id: string;
  maDeNghi: string;
  nguoiXuLy: string;
  userAD: string;
  thoiGianNhan: string;
  thoiGianXuLy?: string;
  ketQua: string;
  noiDungXuLy: string;

  // V1.2 Additions
  maNhomQuyenGoiY?: string;
  tenNhomQuyenGoiY?: string;
  maNhomQuyenThucTe?: string;
  tenNhomQuyenThucTe?: string;
  canCuVanBan?: string;
}

export interface SummaryUserMatrixRow {
  maUserAD: string;
  hoTen: string;
  userAD: string;
  maPhongBan: string;
  tenPhongBan: string;
  programs: Record<string, {
    status: 'V' | 'HỦY' | '';
    maDeNghi: string;
    ngayCapQuyen: string;
  }>;
}

export interface AuditLog {
  id: string;
  thoiGian: string;
  user: string;
  vaiTro: UserRole;
  hanhDong: string;
  maDeNghi?: string;
  noiDung: string;
  ip?: string;
  ketQua: 'Thành công' | 'Thất bại' | 'Cảnh báo';
}

export interface NotificationItem {
  id: string;
  to: string;
  subject: string;
  body: string;
  thoiGian: string;
  maDeNghi?: string;
  loai: 'Phê duyệt' | 'Hoàn thành' | 'Từ chối' | 'Hệ thống';
  read: boolean;
}

export type EmailNotification = NotificationItem;

export interface SystemConfig {
  itEmail: string;
  tenChiNhanh: string;
  maChiNhanh: string;
  diaChi: string;
  appVersion: string;
  gasApiUrl?: string; // Optional live Google Apps Script endpoint
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
