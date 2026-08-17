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
  AppPermissionRule,
  AppPermissionGroup,
  AppRegulation,
  AppNote,
  UserRole
} from '../types';

export const initialConfig: SystemConfig = {
  itEmail: 'ducnt4@vietinbank.vn',
  tenChiNhanh: 'VIETINBANK – CHI NHÁNH NINH BÌNH',
  maChiNhanh: 'CN Ninh Bình (042)',
  diaChi: 'Số 10 Tràng An, Phường Tân Thành, TP. Ninh Bình, Tỉnh Ninh Bình',
  appVersion: 'V1.2',
  gasApiUrl: 'https://script.google.com/macros/s/AKfycbwv5QSwAwKQKAsqwDKlY9B0YQ_z574Zo6iJTaN6ksBbb4D3l3f8J6V4Z3JQc_7qdlm5/exec'
};

export const initialDepartments: PhongBan[] = [
  {
    id: 'dept-bgd',
    maPhongBan: 'BGD',
    tenPhongBan: 'Ban giám đốc',
    trangThai: 'Hoạt động',
    moTa: 'Ban Giám đốc Chi nhánh Ninh Bình'
  },
  {
    id: 'dept-khdn',
    maPhongBan: 'P_KHDN',
    tenPhongBan: 'Phòng KHDN',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Khách hàng Doanh nghiệp'
  },
  {
    id: 'dept-bl',
    maPhongBan: 'P_BL',
    tenPhongBan: 'Phòng Bán lẻ',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Bán lẻ & Khách hàng Cá nhân'
  },
  {
    id: 'dept-dvkh',
    maPhongBan: 'P_DVKH',
    tenPhongBan: 'Phòng Dịch vụ khách hàng',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Kế toán & Dịch vụ Khách hàng'
  },
  {
    id: 'dept-httd',
    maPhongBan: 'P_HTTD',
    tenPhongBan: 'Phòng Hỗ trợ tín dụng',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Hỗ trợ tín dụng & Quản lý nợ'
  },
  {
    id: 'dept-tcth',
    maPhongBan: 'P_TCTH',
    tenPhongBan: 'Phòng Tổ chức Tổng hợp',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Tổ chức Cán bộ & Hành chính Tổng hợp'
  },
  {
    id: 'dept-it',
    maPhongBan: 'P_IT',
    tenPhongBan: 'Tổ Điện toán & Công nghệ thông tin',
    trangThai: 'Hoạt động',
    moTa: 'Vận hành hệ thống mạng, hạ tầng, phân quyền ứng dụng'
  },
  {
    id: 'dept-pgd-gv',
    maPhongBan: 'PGD_GV',
    tenPhongBan: 'PGD Gia Viễn',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Giao dịch Gia Viễn'
  },
  {
    id: 'dept-pgd-ks',
    maPhongBan: 'PGD_KS',
    tenPhongBan: 'PGD Kim Sơn',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Giao dịch Kim Sơn'
  },
  {
    id: 'dept-pgd-nt',
    maPhongBan: 'PGD_NT',
    tenPhongBan: 'PGD Ninh Thành',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Giao dịch Ninh Thành'
  },
  {
    id: 'dept-pgd-yk',
    maPhongBan: 'PGD_YK',
    tenPhongBan: 'PGD Yên Khánh',
    trangThai: 'Hoạt động',
    moTa: 'Phòng Giao dịch Yên Khánh'
  }
];

export const initialPrograms: ChuongTrinh[] = [
  {
    id: 'prog-tpss',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    moTa: 'Hệ thống phục vụ nghiệp vụ thanh toán chuyển tiền trong nước và quốc tế',
    phamVi: 'Phòng KHDN, Phòng Bán lẻ, Phòng Kế toán & DVKH',
    moTaNghiepVu: 'Khởi tạo, kiểm soát và truyền duyệt các giao dịch điện tử thanh toán đa kênh liên ngân hàng',
    ghiChuChung: 'Yêu cầu kiểm tra phân công nhiệm vụ và chữ ký số được cấp trước khi bàn giao User',
    nhomQuyenMacDinh: 'MAKER, CHECKER, APPROVER, VIEWER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-tptl',
    maChuongTrinh: 'TPTL',
    tenChuongTrinh: 'TPTL (Hệ thống Thu phí & Tự động Lãi suất)',
    moTa: 'Hệ thống tính toán, thu phí dịch vụ định kỳ và trích nợ tự động theo lịch',
    phamVi: 'Phòng KHDN, Phòng Bán lẻ, Phòng Kế toán & DVKH',
    moTaNghiepVu: 'Cài đặt biểu phí, lịch thu phí tự động, đối soát doanh thu phí dịch vụ chi nhánh',
    ghiChuChung: 'Chỉ cấp quyền kiểm soát cho KSV/Lãnh đạo phòng kế toán nghiệp vụ',
    nhomQuyenMacDinh: 'MAKER, CHECKER, VIEWER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-clims',
    maChuongTrinh: 'CLIMS',
    tenChuongTrinh: 'CLIMS (Hệ thống Quản lý Giới hạn Hạn mức & Tín dụng)',
    moTa: 'Quản lý hạn mức tín dụng tập đoàn, doanh nghiệp lớn, bảo lãnh và liên kết rủi ro',
    phamVi: 'Phòng KHDN, Phòng Quản lý rủi ro & Xử lý nợ',
    moTaNghiepVu: 'Kiểm tra hạn mức tín dụng khách hàng, nhập liệu hạn mức tổng thể và cảnh báo rủi ro tập trung',
    ghiChuChung: 'Cán bộ phải có chứng chỉ nghiệp vụ tín dụng hoặc quyết định phân công phụ trách KHDN',
    nhomQuyenMacDinh: 'CLIMS_INPUT, CLIMS_CHECK, CLIMS_VIEW',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-crlos',
    maChuongTrinh: 'CRLOS',
    tenChuongTrinh: 'CRLOS (Hệ thống Chấm điểm Tín dụng & Xếp hạng Khách hàng)',
    moTa: 'Hệ thống xếp hạng tín nhiệm nội bộ, tính xác suất vỡ nợ (PD, LGD, EAD)',
    phamVi: 'Phòng KHDN, Phòng Bán lẻ, Phòng Quản lý rủi ro',
    moTaNghiepVu: 'Chấm điểm tín dụng theo bộ chỉ tiêu tài chính và phi tài chính định kỳ',
    ghiChuChung: 'Kết quả chấm điểm là căn cứ bắt buộc cho tờ trình thẩm định phê duyệt tín dụng',
    nhomQuyenMacDinh: 'CRLOS_SCORER, CRLOS_APPROVER, CRLOS_AUDITOR',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-1',
    maChuongTrinh: 'CORE_BANKING',
    tenChuongTrinh: 'CoreBanking (Hệ thống Ngân hàng lõi)',
    moTa: 'Giao dịch hạch toán tài khoản, tiền gửi, thanh toán và báo cáo sổ cái',
    phamVi: 'Toàn chi nhánh theo phân công nghiệp vụ cụ thể',
    moTaNghiepVu: 'Hạch toán kế toán ngân hàng, quản lý thông tin CIF, phát hành sổ tiết kiệm, thanh toán',
    ghiChuChung: 'Quyền hạch toán tiền mặt/chuyển khoản phải tuân thủ hạn mức duyệt giao dịch',
    nhomQuyenMacDinh: 'GDV_TIEN_MAT, KSV_HACH_TOAN, TRA_CUU_CIF',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-2',
    maChuongTrinh: 'LOS_CREDIT',
    tenChuongTrinh: 'LOS (Khởi tạo và phê duyệt khoản vay)',
    moTa: 'Quy trình khởi tạo hồ sơ vay vốn, thẩm định và tờ trình tín dụng',
    phamVi: 'Phòng KHDN, Phòng Bán lẻ, Phòng Quản lý rủi ro',
    moTaNghiepVu: 'Lập hồ sơ khách hàng, phân tích phương án vay, tờ trình thẩm định và luân chuyển phê duyệt',
    ghiChuChung: 'Cán bộ chỉ lập hồ sơ thuộc phân khúc khách hàng được phân công',
    nhomQuyenMacDinh: 'LOS_KHDN_MAKER, LOS_RETAIL_MAKER, LOS_APPROVER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-3',
    maChuongTrinh: 'ITRADE',
    tenChuongTrinh: 'iTrade (Tài trợ Thương mại & Ngoại hối)',
    moTa: 'Xử lý L/C, nhờ thu, bảo lãnh ngân hàng và kinh doanh vốn',
    phamVi: 'Phòng KHDN, Phòng Kế toán & DVKH',
    moTaNghiepVu: 'Phát hành bảo lãnh, xử lý chứng từ thanh toán quốc tế L/C xuất nhập khẩu',
    ghiChuChung: 'Yêu cầu có biên bản phân công công việc tài trợ thương mại',
    nhomQuyenMacDinh: 'ITRADE_MAKER, ITRADE_CHECKER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-4',
    maChuongTrinh: 'FAST_FUND',
    tenChuongTrinh: 'FastFund (Chuyển tiền liên ngân hàng/Napas)',
    moTa: 'Điều chuyển vốn nhanh, thanh toán 24/7, song phương và CITAD',
    phamVi: 'Phòng Kế toán & DVKH, Phòng Tổng hợp',
    moTaNghiepVu: 'Kiểm soát lệnh thanh toán liên ngân hàng, điều tiết tài khoản thanh toán tại NHNN',
    nhomQuyenMacDinh: 'FAST_MAKER, FAST_CHECKER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-5',
    maChuongTrinh: 'ECM_DOC',
    tenChuongTrinh: 'ECM (Hệ thống Quản lý Chứng từ số)',
    moTa: 'Quét số hóa hồ sơ, lưu trữ chứng từ điện tử và tra cứu chứng từ',
    phamVi: 'Toàn chi nhánh',
    moTaNghiepVu: 'Upload scan chứng từ giao dịch hằng ngày, tra cứu số hóa',
    nhomQuyenMacDinh: 'ECM_SCANNER, ECM_APPROVER, ECM_VIEWER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-6',
    maChuongTrinh: 'ERP_INTERNAL',
    tenChuongTrinh: 'ERP Nội bộ & Quản lý Tài sản',
    moTa: 'Quản lý tài sản cố định, vật phẩm ấn chỉ và chi tiêu nội bộ',
    phamVi: 'Phòng TCCB & Hành chính, Phòng Kế toán',
    moTaNghiepVu: 'Quản lý kho ấn chỉ, điều chuyển công cụ dụng cụ, thanh quyết toán chi phí nội bộ',
    nhomQuyenMacDinh: 'ERP_USER, ERP_MANAGER',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-7',
    maChuongTrinh: 'SMART_OTP_ADMIN',
    tenChuongTrinh: 'SmartOTP & Quản lý Thẻ eBanking',
    moTa: 'Hỗ trợ khách hàng kích hoạt SmartOTP và mở khóa thẻ ATM/Visa',
    phamVi: 'Phòng Kế toán & DVKH, Phòng Bán lẻ',
    moTaNghiepVu: 'Xác thực định danh khách hàng, hỗ trợ kích hoạt lại soft token OTP',
    nhomQuyenMacDinh: 'OTP_AGENT, OTP_SUPERVISOR',
    trangThai: 'Hoạt động'
  },
  {
    id: 'prog-8',
    maChuongTrinh: 'OLD_SMS_SYSTEM',
    tenChuongTrinh: 'SMS Banking Cũ (Legacy Gateway)',
    moTa: 'Hệ thống gửi tin nhắn SMS phiên bản cũ (Ngừng sử dụng)',
    trangThai: 'Ngừng sử dụng'
  }
];

interface RawStaffItem {
  userAD: string;
  hoTen: string;
  maCanBo: string;
  tenPhongBan: string;
}

const rawStaffList: RawStaffItem[] = [
  // Ban giám đốc
  { userAD: 'ThangDX', hoTen: 'Đinh Xuân Thắng', maCanBo: '00005568', tenPhongBan: 'Ban giám đốc' },
  { userAD: 'Dung.BT', hoTen: 'Bùi Thị Thu Dung', maCanBo: '00006961', tenPhongBan: 'Ban giám đốc' },
  { userAD: 'duongdm', hoTen: 'Đoàn Mạnh Dương', maCanBo: '00006962', tenPhongBan: 'Ban giám đốc' },
  { userAD: 'lyhoang.ha', hoTen: 'Lý Hoàng Hà', maCanBo: '00006983', tenPhongBan: 'Ban giám đốc' },

  // PGD Gia Viễn
  { userAD: 'ANHNTV10', hoTen: 'Nguyễn Thị Vân Anh', maCanBo: '00044404', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'DTMHuong', hoTen: 'Đỗ Thị Mai Hương', maCanBo: '00006954', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'DUNGDVT', hoTen: 'Đỗ Văn Tấn Dũng', maCanBo: '00059439', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'DX.Hoa', hoTen: 'Đinh Xuân Hòa', maCanBo: '00021994', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'HANGPT14', hoTen: 'Phạm Thanh Hằng', maCanBo: '00055891', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'LINHNT51', hoTen: 'Nguyễn Thị Linh', maCanBo: '00049286', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'NTNgocBich', hoTen: 'Nguyễn Thị Ngọc Bích', maCanBo: '00021646', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'PHONGDN', hoTen: 'Đinh Ngọc Phong', maCanBo: '00049306', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'ThuyNTT400', hoTen: 'Nguyễn Thị Thu Thủy', maCanBo: '00015046', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'TTHHanh', hoTen: 'Trương Thị Hồng Hạnh', maCanBo: '00006956', tenPhongBan: 'PGD Gia Viễn' },
  { userAD: 'TUANDC', hoTen: 'Đinh Công Tuấn', maCanBo: '00044408', tenPhongBan: 'PGD Gia Viễn' },

  // PGD Kim Sơn
  { userAD: 'ANHNTH5', hoTen: 'Nguyễn Thị Hồng Ánh', maCanBo: '00059380', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'CUONGDM4', hoTen: 'Đào Mạnh Cường', maCanBo: '00041353', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'ducpt', hoTen: 'Phạm Thanh Đức', maCanBo: '00029596', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'Hien.NghiemThi', hoTen: 'Nghiêm Thị Hiền', maCanBo: '00006937', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'HungVH', hoTen: 'Vũ Hồng Hưng', maCanBo: '00015051', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'HuyenNTT400', hoTen: 'Nguyễn Thị Thương Huyền', maCanBo: '00015063', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'LD.Anh', hoTen: 'Lê Đức Anh', maCanBo: '00026294', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'MAINT11', hoTen: 'Nguyễn Thị Mai', maCanBo: '00050587', tenPhongBan: 'PGD Kim Sơn' },
  { userAD: 'MEN.PT', hoTen: 'Phạm Thị Mến', maCanBo: '00054558', tenPhongBan: 'PGD Kim Sơn' },

  // PGD Ninh Thành
  { userAD: 'HANHNTH14', hoTen: 'Nguyễn Thị Hồng Hạnh', maCanBo: '00055885', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'HUYENLT5', hoTen: 'Lã Thu Huyền', maCanBo: '00044378', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'HUYENTMT', hoTen: 'Trần Minh Thu Huyền', maCanBo: '00041357', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'NGUYETBTA', hoTen: 'Bùi Thị Ánh Nguyệt', maCanBo: '00026813', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'NHUNGVTH3', hoTen: 'Văn Thị Hồng Nhung', maCanBo: '00046628', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'PHUONG.DT', hoTen: 'Đinh Thị Phương', maCanBo: '00026248', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'PV.LONG', hoTen: 'Phan Văn Long', maCanBo: '00038216', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'ThuTH', hoTen: 'Tạ Hà Thu', maCanBo: '00015042', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'VTTHa', hoTen: 'Vũ Thị Thu Hà', maCanBo: '00006964', tenPhongBan: 'PGD Ninh Thành' },
  { userAD: 'VTTTrang', hoTen: 'Vũ Thị Thu Trang', maCanBo: '00006967', tenPhongBan: 'PGD Ninh Thành' },

  // PGD Yên Khánh
  { userAD: 'DT.Trung', hoTen: 'Đinh Thành Trung', maCanBo: '00015039', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'DTHThuy', hoTen: 'Đinh Thị Hồng Thúy', maCanBo: '00006951', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'DUCNH', hoTen: 'Nguyễn Hoài Đức', maCanBo: '00026281', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'GIANGPH1', hoTen: 'Phạm Hương Giang', maCanBo: '00041356', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'HANHNT1', hoTen: 'Nguyễn Thị Hạnh', maCanBo: '00026276', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'HIEPGN', hoTen: 'Giang Ngọc Hiệp', maCanBo: '00041354', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'HUONGDT21', hoTen: 'Đào Thu Hương', maCanBo: '00046638', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'NDQuang', hoTen: 'Nguyễn Đình Quang', maCanBo: '00006988', tenPhongBan: 'PGD Yên Khánh' },
  { userAD: 'THAMNT10', hoTen: 'Nguyễn Thị Thắm', maCanBo: '00042178', tenPhongBan: 'PGD Yên Khánh' },

  // Phòng Bán lẻ
  { userAD: 'ANHDVL', hoTen: 'Dương Văn Lan Anh', maCanBo: '00030624', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'HH.LY', hoTen: 'Hoàng Hương Ly', maCanBo: '00057244', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'HUONGVTL2', hoTen: 'Vũ Thị Lan Hương', maCanBo: '00043031', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'LINHHDT', hoTen: 'Hà Đặng Tuấn Linh', maCanBo: '00046627', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'LINHNVD', hoTen: 'Nguyễn Vũ Diệu Linh', maCanBo: '00055886', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'MAIPT1', hoTen: 'Phạm Thị Mai', maCanBo: '00046796', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'SonHM', hoTen: 'Hoàng Minh Sơn', maCanBo: '00015071', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'TheMN', hoTen: 'Mai Như Thế', maCanBo: '00017400', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'thodt', hoTen: 'Đỗ Trường Thọ', maCanBo: '00006945', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'THOHT', hoTen: 'Hoàng Thị Thơ', maCanBo: '00026273', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'THUYNTT39', hoTen: 'Nguyễn Thị Thu Thủy', maCanBo: '00044407', tenPhongBan: 'Phòng Bán lẻ' },
  { userAD: 'TUNGNQ1', hoTen: 'Nguyễn Quang Tùng', maCanBo: '00041584', tenPhongBan: 'Phòng Bán lẻ' },

  // Phòng Dịch vụ khách hàng
  { userAD: 'ANHCT', hoTen: 'Cù Thế Anh', maCanBo: '00030000', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'ANHLTN1', hoTen: 'Lê Thị Ngọc Anh', maCanBo: '00030628', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'CHIHL', hoTen: 'Hoàng Linh Chi', maCanBo: '00055890', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'DT.Hue', hoTen: 'Đỗ Thị Huệ', maCanBo: '00006950', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'DTHPhuong', hoTen: 'Đoàn Thị Hải Phượng', maCanBo: '00015062', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'DUCNT4', hoTen: 'Nguyễn Trọng Đức', maCanBo: '00053550', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'HUENT14', hoTen: 'Nguyễn Thị Huế', maCanBo: '00038210', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'Lien.LTK', hoTen: 'Lương Thị Kim Liên', maCanBo: '00006978', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'LOCLTM', hoTen: 'Lê Thị Mỹ Lộc', maCanBo: '00041358', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'Oanh.TH', hoTen: 'Trần Hoàng Oanh', maCanBo: '00015065', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'PHUONGTTT6', hoTen: 'Trần Thị Thu Phương', maCanBo: '00033307', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'PThiHa', hoTen: 'Phạm Thị Hà', maCanBo: '00006948', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'ThuanPTY', hoTen: 'Phạm Thị Yến Thuận', maCanBo: '00006980', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'THUYTT18', hoTen: 'Thái Thị Thủy', maCanBo: '00041361', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'TTQuy', hoTen: 'Trương Thanh Quý', maCanBo: '00021989', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'TuyetDTL', hoTen: 'Đinh Thị Lệ Tuyết', maCanBo: '00015068', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'VuNM', hoTen: 'Nguyễn Minh Vũ', maCanBo: '00006959', tenPhongBan: 'Phòng Dịch vụ khách hàng' },
  { userAD: 'YenVTH', hoTen: 'Vũ Thị Hải Yến', maCanBo: '00015048', tenPhongBan: 'Phòng Dịch vụ khách hàng' },

  // Phòng Hỗ trợ tín dụng
  { userAD: 'Chien.NK', hoTen: 'Nguyễn Kháng Chiến', maCanBo: '00006928', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'ChuyenVH', hoTen: 'Vũ Hữu Chuyên', maCanBo: '00017401', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'Cuong.NguyenTien', hoTen: 'Nguyễn Tiến Cương', maCanBo: '00006997', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'DODP', hoTen: 'Dương Phú Đô', maCanBo: '00033371', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'Duong.BQ', hoTen: 'Bùi Quý Dương', maCanBo: '00006985', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'GIANGPDH', hoTen: 'Phạm Đoàn Hương Giang', maCanBo: '00053396', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'haiqd', hoTen: 'Đào Quang Hải', maCanBo: '00006998', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },
  { userAD: 'Phuong.LeThiThanh', hoTen: 'Lê Thị Thanh Phương', maCanBo: '00024260', tenPhongBan: 'Phòng Hỗ trợ tín dụng' },

  // Phòng KHDN
  { userAD: 'ANHPNP', hoTen: 'Phạm Nguyễn Phương Anh', maCanBo: '00044380', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'DMCUONG', hoTen: 'Đinh Mạnh Cường', maCanBo: '00030627', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'GIANGDH3', hoTen: 'Đường Hoàng Giang', maCanBo: '00050013', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'HAPT20', hoTen: 'Phạm Thu Hà', maCanBo: '00057240', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'Lan.PTP', hoTen: 'Phạm Thị Thu Phi Lan', maCanBo: '00006946', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'LINHTT10', hoTen: 'Trần Thị Linh', maCanBo: '00041326', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'NGOCNT11', hoTen: 'Nguyễn Thị Ngọc', maCanBo: '00055888', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'NGUYENMH', hoTen: 'Mai Hoàng Nguyên', maCanBo: '00046626', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'PHONGTT1', hoTen: 'Trần Thanh Phong', maCanBo: '00038221', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'PV.ANH', hoTen: 'Phan Văn Anh', maCanBo: '00030623', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'TLANH', hoTen: 'Trần Lan Anh', maCanBo: '00059438', tenPhongBan: 'Phòng KHDN' },
  { userAD: 'VANNTT9', hoTen: 'Ngô Thị Thúy Vân', maCanBo: '00038213', tenPhongBan: 'Phòng KHDN' },

  // Phòng Tổ chức Tổng hợp
  { userAD: 'GiapNH', hoTen: 'Nguyễn Hữu Giáp', maCanBo: '00006966', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'Ha.DinhThanh', hoTen: 'Đinh Thanh Hà', maCanBo: '00006965', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'HuongNTT400', hoTen: 'Nguyễn Thị Thu Hường', maCanBo: '00006949', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'PhuongVTL', hoTen: 'Vũ Thị Lan Phương', maCanBo: '00021948', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'QuynhNH', hoTen: 'Nguyễn Hoàng Quỳnh', maCanBo: '00006975', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'THEMDT', hoTen: 'Đỗ Thị Thêm', maCanBo: '00043022', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'ThucTQ', hoTen: 'Tạ Quang Thức', maCanBo: '00006970', tenPhongBan: 'Phòng Tổ chức Tổng hợp' },
  { userAD: 'tra.ntt', hoTen: 'Nguyễn Thị Thu Trà', maCanBo: '00006989', tenPhongBan: 'Phòng Tổ chức Tổng hợp' }
];

const mapDepartmentCode = (tenPB: string): string => {
  switch (tenPB) {
    case 'Ban giám đốc': return 'BGD';
    case 'PGD Gia Viễn': return 'PGD_GV';
    case 'PGD Kim Sơn': return 'PGD_KS';
    case 'PGD Ninh Thành': return 'PGD_NT';
    case 'PGD Yên Khánh': return 'PGD_YK';
    case 'Phòng Bán lẻ': return 'P_BL';
    case 'Phòng Dịch vụ khách hàng': return 'P_DVKH';
    case 'Phòng Hỗ trợ tín dụng': return 'P_HTTD';
    case 'Phòng KHDN': return 'P_KHDN';
    case 'Phòng Tổ chức Tổng hợp': return 'P_TCTH';
    case 'Tổ Điện toán & Công nghệ thông tin': return 'P_IT';
    default: return 'P_NB';
  }
};

export const initialCanBo: CanBo[] = [
  ...rawStaffList.map((item, index) => {
    const isIT = item.userAD.toLowerCase() === 'ducnt4';
    const emailPrefix = item.userAD.toLowerCase().replace(/[^a-z0-9]/g, '');
    return {
      id: `cb-${index + 1}`,
      maCanBo: item.maCanBo,
      hoTen: item.hoTen,
      maUserAD: `AD_042_${item.maCanBo}`,
      userAD: item.userAD,
      matKhau: '123456',
      email: `${emailPrefix}@vietinbank.vn`,
      soDienThoai: `09${Math.floor(10000000 + (index * 7919) % 89999999).toString().padStart(8, '0')}`,
      vaiTro: (isIT ? 'Cán bộ điện toán' : 'Cán bộ') as UserRole,
      maPhongBan: mapDepartmentCode(item.tenPhongBan),
      tenPhongBan: item.tenPhongBan,
      chucVu: 'Nhân viên', // Mặc định chức vụ là Nhân viên theo yêu cầu
      trangThai: 'Đang làm việc' as const,
      hasAccount: true,
      ngayCapTaiKhoan: '17/08/2026'
    };
  }),
  {
    id: 'cb-admin',
    maCanBo: '00000001',
    hoTen: 'Quản trị viên Hệ thống (Admin)',
    maUserAD: 'AD_042_00000001',
    userAD: 'admin_nb',
    matKhau: '123456',
    email: 'admin.nb@vietinbank.vn',
    soDienThoai: '0901234567',
    vaiTro: 'Admin',
    maPhongBan: 'P_IT',
    tenPhongBan: 'Tổ Điện toán & Công nghệ thông tin',
    chucVu: 'Quản trị viên',
    trangThai: 'Đang làm việc',
    hasAccount: true,
    ngayCapTaiKhoan: '01/08/2026'
  }
];

export const initialUsers: User[] = initialCanBo.map((cb, idx) => ({
  id: `user-${idx + 1}`,
  maUserAD: cb.maUserAD || `AD_042_${cb.maCanBo}`,
  hoTen: cb.hoTen,
  userAD: cb.userAD,
  maPhongBan: cb.maPhongBan,
  tenPhongBan: cb.tenPhongBan,
  chucVu: (cb.vaiTro || 'Cán bộ') as UserRole,
  trangThai: 'Hoạt động',
  matKhau: '123456',
  email: cb.email,
  soDienThoai: cb.soDienThoai
}));

export const initialRequests: RequestRecord[] = [
  {
    id: 'req-1',
    maDeNghi: 'CN-2026-0001',
    ngayTao: '10/08/2026 08:30',
    maUserAD: 'AD_042_00044380',
    maCanBo: '00044380',
    hoTen: 'Phạm Nguyễn Phương Anh',
    userAD: 'ANHPNP',
    maPhongBan: 'P_KHDN',
    tenPhongBan: 'Phòng KHDN',
    maChuongTrinh: 'CORE_BANKING',
    tenChuongTrinh: 'CoreBanking (Hệ thống Ngân hàng lõi)',
    loaiDeNghi: 'Cấp mới',
    soQDTuyenDung_PhanCong: '142/QĐ-NHCT.NB ngày 01/08/2026',
    noiDung: 'Đề nghị cấp quyền tra cứu số dư tài khoản và hạch toán giải ngân KHDN',
    trangThai: 'Hoàn thành',
    nguoiDuyet: 'Đinh Mạnh Cường (DMCUONG)',
    thoiGianDuyet: '10/08/2026 10:15',
    nguoiXuLy: 'Nguyễn Trọng Đức (DUCNT4)',
    thoiGianNhan: '10/08/2026 14:00',
    thoiGianHoanThanh: '11/08/2026 09:30',
    ngayCapQuyen: '11/08/2026',
    ketQuaXuLy: 'Đã tạo User trên CoreBanking và phân quyền nhóm KHDN_USER thành công',
    noiDungXuLy: 'Cấp quyền theo nhóm quyền Role-KHDN-L1, mật khẩu ban đầu đã gửi qua email nội bộ'
  },
  {
    id: 'req-2',
    maDeNghi: 'CN-2026-0002',
    ngayTao: '12/08/2026 09:00',
    maUserAD: 'AD_042_00044380',
    maCanBo: '00044380',
    hoTen: 'Phạm Nguyễn Phương Anh',
    userAD: 'ANHPNP',
    maPhongBan: 'P_KHDN',
    tenPhongBan: 'Phòng KHDN',
    maChuongTrinh: 'LOS_CREDIT',
    tenChuongTrinh: 'LOS (Khởi tạo và phê duyệt khoản vay)',
    loaiDeNghi: 'Cấp mới',
    soQDTuyenDung_PhanCong: '142/QĐ-NHCT.NB ngày 01/08/2026',
    noiDung: 'Cấp user khởi tạo tờ trình thẩm định tín dụng doanh nghiệp trên phân hệ LOS',
    trangThai: 'Hoàn thành',
    nguoiDuyet: 'Đinh Mạnh Cường (DMCUONG)',
    thoiGianDuyet: '12/08/2026 10:45',
    nguoiXuLy: 'Nguyễn Trọng Đức (DUCNT4)',
    thoiGianNhan: '12/08/2026 14:30',
    thoiGianHoanThanh: '13/08/2026 10:00',
    ngayCapQuyen: '13/08/2026',
    ketQuaXuLy: 'Đã phân quyền LOS_KHDN_INITIATOR trên hệ thống LOS',
    noiDungXuLy: 'User LOS mapping userAD ANHPNP'
  },
  {
    id: 'req-3',
    maDeNghi: 'CN-2026-0003',
    ngayTao: '14/08/2026 14:15',
    maUserAD: 'AD_042_00030624',
    hoTen: 'Dương Văn Lan Anh',
    userAD: 'ANHDVL',
    maPhongBan: 'P_BL',
    tenPhongBan: 'Phòng Bán lẻ',
    maChuongTrinh: 'LOS_CREDIT',
    tenChuongTrinh: 'LOS (Khởi tạo và phê duyệt khoản vay)',
    loaiDeNghi: 'Cấp mới',
    soQDTuyenDung_PhanCong: '155/QĐ-NHCT.NB ngày 10/08/2026',
    noiDung: 'Cấp quyền lập hồ sơ vay tiêu dùng và ô tô thế chấp',
    trangThai: 'Chờ xử lý',
    nguoiDuyet: 'Hoàng Minh Sơn (SonHM)',
    thoiGianDuyet: '15/08/2026 08:30',
    nguoiXuLy: 'Nguyễn Trọng Đức (DUCNT4)',
    thoiGianNhan: '15/08/2026 09:10'
  },
  {
    id: 'req-4',
    maDeNghi: 'CN-2026-0004',
    ngayTao: '16/08/2026 10:00',
    maUserAD: 'AD_042_00044380',
    hoTen: 'Phạm Nguyễn Phương Anh',
    userAD: 'ANHPNP',
    maPhongBan: 'P_KHDN',
    tenPhongBan: 'Phòng KHDN',
    maChuongTrinh: 'ITRADE',
    tenChuongTrinh: 'iTrade (Tài trợ Thương mại & Ngoại hối)',
    loaiDeNghi: 'Cấp mới',
    soQDTuyenDung_PhanCong: '160/QĐ-NHCT.NB ngày 15/08/2026',
    noiDung: 'Cấp quyền nhập hồ sơ L/C nhập khẩu cho khách hàng xuất nhập khẩu',
    trangThai: 'Chờ lãnh đạo phòng phê duyệt'
  },
  {
    id: 'req-5',
    maDeNghi: 'CN-2026-0005',
    ngayTao: '16/08/2026 15:20',
    maUserAD: 'AD_042_00006950',
    hoTen: 'Đỗ Thị Huệ',
    userAD: 'DT.Hue',
    maPhongBan: 'P_DVKH',
    tenPhongBan: 'Phòng Dịch vụ khách hàng',
    maChuongTrinh: 'FAST_FUND',
    tenChuongTrinh: 'FastFund (Chuyển tiền liên ngân hàng/Napas)',
    loaiDeNghi: 'Reset mật khẩu',
    soQDTuyenDung_PhanCong: '88/TB-KTDV ngày 01/06/2026',
    noiDung: 'Tài khoản FastFund bị khóa do nhập sai mật khẩu 3 lần liên tiếp trong ca làm việc',
    trangThai: 'Chờ lãnh đạo phòng phê duyệt'
  },
  {
    id: 'req-6',
    maDeNghi: 'CN-2026-0006',
    ngayTao: '15/08/2026 16:00',
    maUserAD: 'AD_042_00030624',
    hoTen: 'Dương Văn Lan Anh',
    userAD: 'ANHDVL',
    maPhongBan: 'P_BL',
    tenPhongBan: 'Phòng Bán lẻ',
    maChuongTrinh: 'ERP_INTERNAL',
    tenChuongTrinh: 'ERP Nội bộ & Quản lý Tài sản',
    loaiDeNghi: 'Cấp mới',
    soQDTuyenDung_PhanCong: '155/QĐ-NHCT.NB ngày 10/08/2026',
    noiDung: 'Đề nghị cấp quyền duyệt mua sắm văn phòng phẩm cho toàn phòng',
    trangThai: 'Từ chối',
    nguoiDuyet: 'Hoàng Minh Sơn (SonHM)',
    thoiGianDuyet: '16/08/2026 08:20',
    lyDoTuChoi: 'Quyền duyệt ERP chỉ cấp cho Cán bộ Quản lý/Thủ kho của Phòng Hành chính'
  }
];

export const initialApprovals: ApprovalHistory[] = [
  {
    id: 'app-1',
    maDeNghi: 'CN-2026-0001',
    nguoiDuyet: 'Đinh Mạnh Cường',
    userAD: 'DMCUONG',
    maPhongBan: 'P_KHDN',
    ketQua: 'Phê duyệt',
    lyDo: 'Đồng ý cấp quyền theo phân công nghiệp vụ KHDN',
    thoiGian: '10/08/2026 10:15'
  },
  {
    id: 'app-2',
    maDeNghi: 'CN-2026-0002',
    nguoiDuyet: 'Đinh Mạnh Cường',
    userAD: 'DMCUONG',
    maPhongBan: 'P_KHDN',
    ketQua: 'Phê duyệt',
    lyDo: 'Nhất trí đề xuất',
    thoiGian: '12/08/2026 10:45'
  },
  {
    id: 'app-3',
    maDeNghi: 'CN-2026-0003',
    nguoiDuyet: 'Hoàng Minh Sơn',
    userAD: 'SonHM',
    maPhongBan: 'P_BL',
    ketQua: 'Phê duyệt',
    lyDo: 'Đã kiểm tra đúng quyết định phân công',
    thoiGian: '15/08/2026 08:30'
  },
  {
    id: 'app-4',
    maDeNghi: 'CN-2026-0006',
    nguoiDuyet: 'Hoàng Minh Sơn',
    userAD: 'SonHM',
    maPhongBan: 'P_BL',
    ketQua: 'Từ chối',
    lyDo: 'Quyền duyệt ERP chỉ cấp cho Cán bộ Quản lý/Thủ kho của Phòng Hành chính',
    thoiGian: '16/08/2026 08:20'
  }
];

export const initialProcessing: ProcessingHistory[] = [
  {
    id: 'proc-1',
    maDeNghi: 'CN-2026-0001',
    nguoiXuLy: 'Nguyễn Trọng Đức',
    userAD: 'DUCNT4',
    thoiGianNhan: '10/08/2026 14:00',
    thoiGianXuLy: '11/08/2026 09:30',
    ketQua: 'Hoàn thành cấp quyền',
    noiDungXuLy: 'Đã tạo User trên CoreBanking và phân quyền nhóm KHDN_USER thành công'
  },
  {
    id: 'proc-2',
    maDeNghi: 'CN-2026-0002',
    nguoiXuLy: 'Nguyễn Trọng Đức',
    userAD: 'DUCNT4',
    thoiGianNhan: '12/08/2026 14:30',
    thoiGianXuLy: '13/08/2026 10:00',
    ketQua: 'Hoàn thành cấp quyền',
    noiDungXuLy: 'Đã phân quyền LOS_KHDN_INITIATOR trên hệ thống LOS'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    thoiGian: '10/08/2026 08:30:15',
    user: 'annv12',
    vaiTro: 'Cán bộ',
    hanhDong: 'TẠO_ĐỀ_NGHỊ',
    maDeNghi: 'CN-2026-0001',
    noiDung: 'Lập đề nghị cấp quyền mới chương trình CoreBanking',
    ip: '10.42.1.25',
    ketQua: 'Thành công'
  },
  {
    id: 'log-2',
    thoiGian: '10/08/2026 10:15:22',
    user: 'dungpd',
    vaiTro: 'Lãnh đạo phòng',
    hanhDong: 'PHÊ_DUYỆT_ĐỀ_NGHỊ',
    maDeNghi: 'CN-2026-0001',
    noiDung: 'Phê duyệt đề nghị CN-2026-0001 của cán bộ Nguyễn Văn An',
    ip: '10.42.1.10',
    ketQua: 'Thành công'
  },
  {
    id: 'log-3',
    thoiGian: '11/08/2026 09:30:44',
    user: 'ducnt4',
    vaiTro: 'Cán bộ điện toán',
    hanhDong: 'HOÀN_THÀNH_XỬ_LÝ',
    maDeNghi: 'CN-2026-0001',
    noiDung: 'Hoàn tất phân quyền trên chương trình nội bộ, cập nhật ngày cấp quyền 11/08/2026',
    ip: '10.42.5.2',
    ketQua: 'Thành công'
  },
  {
    id: 'log-4',
    thoiGian: '16/08/2026 08:20:10',
    user: 'tuanhm',
    vaiTro: 'Lãnh đạo phòng',
    hanhDong: 'TỪ_CHỐI_ĐỀ_NGHỊ',
    maDeNghi: 'CN-2026-0006',
    noiDung: 'Từ chối đề nghị CN-2026-0006 do sai phạm vi phân quyền',
    ip: '10.42.2.10',
    ketQua: 'Thành công'
  }
];

export const initialEmails: EmailNotification[] = [
  {
    id: 'mail-1',
    to: 'ducnt4@vietinbank.vn',
    subject: '[ĐỀ NGHỊ CẤP QUYỀN] CN-2026-0001 - Đã được phê duyệt',
    body: `Kính gửi Cán bộ Điện toán,\n\nĐề nghị cấp quyền CN-2026-0001 đã được Lãnh đạo phòng phê duyệt và chuyển đến Tổ Điện toán để xử lý.\n\nThông tin chi tiết:\n- Mã đề nghị: CN-2026-0001\n- Họ tên cán bộ: Nguyễn Văn An\n- User AD: annv12 (Mã: AD_042_012)\n- Phòng ban: P001 - Phòng Khách hàng Doanh nghiệp\n- Chương trình: CoreBanking (Hệ thống Ngân hàng lõi)\n- Loại đề nghị: Cấp mới\n- Số QĐ/Phân công NV: 142/QĐ-NHCT.NB ngày 01/08/2026\n- Người phê duyệt: Phạm Đức Dũng (dungpd)\n- Thời gian phê duyệt: 10/08/2026 10:15\n\nTrân trọng thông báo.`,
    thoiGian: '10/08/2026 10:15',
    maDeNghi: 'CN-2026-0001',
    loai: 'Phê duyệt',
    read: true
  },
  {
    id: 'mail-2',
    to: 'ducnt4@vietinbank.vn',
    subject: '[ĐỀ NGHỊ CẤP QUYỀN] CN-2026-0003 - Đã được phê duyệt',
    body: `Kính gửi Cán bộ Điện toán,\n\nĐề nghị cấp quyền CN-2026-0003 đã được Lãnh đạo phòng phê duyệt và chuyển đến Tổ Điện toán để xử lý.\n\nThông tin chi tiết:\n- Mã đề nghị: CN-2026-0003\n- Họ tên cán bộ: Trần Thị Bích\n- User AD: bichtt (Mã: AD_042_018)\n- Phòng ban: P002 - Phòng Bán lẻ & Khách hàng Cá nhân\n- Chương trình: LOS (Khởi tạo và phê duyệt khoản vay)\n- Loại đề nghị: Cấp mới\n- Số QĐ/Phân công NV: 155/QĐ-NHCT.NB ngày 10/08/2026\n- Người phê duyệt: Hoàng Minh Tuấn (tuanhm)\n- Thời gian phê duyệt: 15/08/2026 08:30\n\nTrân trọng thông báo.`,
    thoiGian: '15/08/2026 08:30',
    maDeNghi: 'CN-2026-0003',
    loai: 'Phê duyệt',
    read: false
  }
];

// ==========================================
// V1.2 MODULE: CĂN CỨ & HƯỚNG DẪN CẤP QUYỀN
// ==========================================

// 1. Sheet: APP_PERMISSION_RULES
export const initialPermissionRules: AppPermissionRule[] = [
  // TPSS
  {
    id: 'rule-tpss-1',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maPhongBan: 'P001',
    tenPhongBan: 'Phòng Khách hàng Doanh nghiệp',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'MAKER',
    tenNhomQuyen: 'MAKER (Lập lệnh thanh toán)',
    dieuKien: 'Có phân công thực hiện nghiệp vụ thanh toán KHDN',
    luuY: 'Chỉ cấp khi có quyết định/phân công công việc cụ thể.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-tpss-2',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maPhongBan: 'P001',
    tenPhongBan: 'Phòng Khách hàng Doanh nghiệp',
    doiTuong: 'Lãnh đạo phòng',
    chucVu: 'Lãnh đạo phòng',
    maNhomQuyen: 'CHECKER',
    tenNhomQuyen: 'CHECKER (Kiểm soát thanh toán)',
    dieuKien: 'Theo chức năng nhiệm vụ quản lý phòng KHDN',
    luuY: 'Kiểm tra phân quyền duyệt theo hạn mức ủy quyền.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-tpss-3',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maPhongBan: 'P002',
    tenPhongBan: 'Phòng Bán lẻ & Khách hàng Cá nhân',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'MAKER',
    tenNhomQuyen: 'MAKER (Lập lệnh thanh toán)',
    dieuKien: 'Có phân công nghiệp vụ thanh toán bán lẻ',
    luuY: 'Áp dụng cho cán bộ tín dụng kiêm hỗ trợ giải ngân.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-tpss-4',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maPhongBan: 'P003',
    tenPhongBan: 'Phòng Kế toán & Dịch vụ Khách hàng',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'MAKER',
    tenNhomQuyen: 'MAKER (Giao dịch viên quầy)',
    dieuKien: 'Có phân công trực giao dịch quầy thanh toán',
    luuY: 'Cấp mã định danh GDV mapping với CoreBanking.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-tpss-5',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maPhongBan: 'P003',
    tenPhongBan: 'Phòng Kế toán & Dịch vụ Khách hàng',
    doiTuong: 'Lãnh đạo phòng',
    chucVu: 'Lãnh đạo phòng',
    maNhomQuyen: 'APPROVER',
    tenNhomQuyen: 'APPROVER (Kiểm soát viên / Duyệt lệnh)',
    dieuKien: 'Có quyết định bổ nhiệm KSV hoặc Lãnh đạo phòng',
    luuY: 'Cấp token ký số truyền duyệt thanh toán liên ngân hàng.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // TPTL
  {
    id: 'rule-tptl-1',
    maChuongTrinh: 'TPTL',
    tenChuongTrinh: 'TPTL (Hệ thống Thu phí & Tự động Lãi suất)',
    maPhongBan: 'P003',
    tenPhongBan: 'Phòng Kế toán & Dịch vụ Khách hàng',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'MAKER',
    tenNhomQuyen: 'MAKER (Cài đặt & chạy lịch thu phí)',
    dieuKien: 'Được phân công theo dõi doanh thu phí dịch vụ',
    luuY: 'Chỉ thực hiện ngoài giờ giao dịch quầy chính thức.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-tptl-2',
    maChuongTrinh: 'TPTL',
    tenChuongTrinh: 'TPTL (Hệ thống Thu phí & Tự động Lãi suất)',
    maPhongBan: 'P003',
    tenPhongBan: 'Phòng Kế toán & Dịch vụ Khách hàng',
    doiTuong: 'Lãnh đạo phòng',
    chucVu: 'Lãnh đạo phòng',
    maNhomQuyen: 'CHECKER',
    tenNhomQuyen: 'CHECKER (Kiểm soát biểu phí)',
    dieuKien: 'Kiểm soát viên / Lãnh đạo kế toán',
    luuY: 'Duyệt miễn giảm phí theo đúng thẩm quyền biểu phí VTB.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CLIMS
  {
    id: 'rule-clims-1',
    maChuongTrinh: 'CLIMS',
    tenChuongTrinh: 'CLIMS (Hệ thống Quản lý Giới hạn Hạn mức & Tín dụng)',
    maPhongBan: 'P001',
    tenPhongBan: 'Phòng Khách hàng Doanh nghiệp',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'CLIMS_INPUT',
    tenNhomQuyen: 'CLIMS_INPUT (Nhập liệu hạn mức)',
    dieuKien: 'Có phân công quản lý quan hệ KHDN lớn',
    luuY: 'Kiểm tra nghị quyết cấp tín dụng trước khi tạo hạn mức.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-clims-2',
    maChuongTrinh: 'CLIMS',
    tenChuongTrinh: 'CLIMS (Hệ thống Quản lý Giới hạn Hạn mức & Tín dụng)',
    maPhongBan: 'P004',
    tenPhongBan: 'Phòng Tổng hợp & Quản lý nợ',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'CLIMS_CHECK',
    tenNhomQuyen: 'CLIMS_CHECK (Kiểm tra & Giám sát rủi ro)',
    dieuKien: 'Cán bộ quản lý rủi ro và quản lý nợ',
    luuY: 'Theo dõi chỉ số an toàn hạn mức tập trung toàn chi nhánh.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CRLOS
  {
    id: 'rule-crlos-1',
    maChuongTrinh: 'CRLOS',
    tenChuongTrinh: 'CRLOS (Hệ thống Chấm điểm Tín dụng & Xếp hạng Khách hàng)',
    maPhongBan: 'P001',
    tenPhongBan: 'Phòng Khách hàng Doanh nghiệp',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'CRLOS_SCORER',
    tenNhomQuyen: 'CRLOS_SCORER (Chấm điểm tín dụng)',
    dieuKien: 'Cán bộ quan hệ KHDN phụ trách hồ sơ vay',
    luuY: 'Nhập đầy đủ BCTC đã kiểm toán hoặc xác nhận thuế.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-crlos-2',
    maChuongTrinh: 'CRLOS',
    tenChuongTrinh: 'CRLOS (Hệ thống Chấm điểm Tín dụng & Xếp hạng Khách hàng)',
    maPhongBan: 'P002',
    tenPhongBan: 'Phòng Bán lẻ & Khách hàng Cá nhân',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'CRLOS_SCORER',
    tenNhomQuyen: 'CRLOS_SCORER (Chấm điểm tín dụng thể nhân)',
    dieuKien: 'Cán bộ tín dụng bán lẻ',
    luuY: 'Kiểm tra thông tin CIC trước khi chạy mô hình chấm điểm.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CORE_BANKING
  {
    id: 'rule-core-1',
    maChuongTrinh: 'CORE_BANKING',
    tenChuongTrinh: 'CoreBanking (Hệ thống Ngân hàng lõi)',
    maPhongBan: 'P003',
    tenPhongBan: 'Phòng Kế toán & Dịch vụ Khách hàng',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'GDV_TIEN_MAT',
    tenNhomQuyen: 'GDV_TIEN_MAT (Giao dịch viên tiền mặt/tiền gửi)',
    dieuKien: 'Có quyết định tiếp nhận & phân công giao dịch viên',
    luuY: 'Cấp mã Teller ID định danh cá nhân không chia sẻ.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-core-2',
    maChuongTrinh: 'CORE_BANKING',
    tenChuongTrinh: 'CoreBanking (Hệ thống Ngân hàng lõi)',
    maPhongBan: 'P001',
    tenPhongBan: 'Phòng Khách hàng Doanh nghiệp',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'TRA_CUU_CIF',
    tenNhomQuyen: 'TRA_CUU_CIF (Tra cứu số dư & thông tin CIF)',
    dieuKien: 'Cán bộ quan hệ khách hàng',
    luuY: 'Chỉ được xem thông tin khách hàng thuộc danh mục quản lý.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // LOS_CREDIT
  {
    id: 'rule-los-1',
    maChuongTrinh: 'LOS_CREDIT',
    tenChuongTrinh: 'LOS (Khởi tạo và phê duyệt khoản vay)',
    maPhongBan: 'P001',
    tenPhongBan: 'Phòng Khách hàng Doanh nghiệp',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'LOS_KHDN_MAKER',
    tenNhomQuyen: 'LOS_KHDN_MAKER (Khởi tạo hồ sơ KHDN)',
    dieuKien: 'Có phân công lập tờ trình tín dụng KHDN',
    luuY: 'Quyền gắn với danh mục khách hàng được phân công.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'rule-los-2',
    maChuongTrinh: 'LOS_CREDIT',
    tenChuongTrinh: 'LOS (Khởi tạo và phê duyệt khoản vay)',
    maPhongBan: 'P002',
    tenPhongBan: 'Phòng Bán lẻ & Khách hàng Cá nhân',
    doiTuong: 'Cán bộ',
    chucVu: 'Cán bộ',
    maNhomQuyen: 'LOS_RETAIL_MAKER',
    tenNhomQuyen: 'LOS_RETAIL_MAKER (Khởi tạo hồ sơ vay Bán lẻ)',
    dieuKien: 'Có phân công lập hồ sơ vay tiêu dùng/thế chấp cá nhân',
    luuY: 'Kiểm tra đầy đủ chứng từ nguồn thu và pháp lý tài sản.',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  }
];

// 2. Sheet: APP_PERMISSION_GROUPS
export const initialPermissionGroups: AppPermissionGroup[] = [
  // TPSS
  {
    id: 'grp-tpss-1',
    maChuongTrinh: 'TPSS',
    maNhomQuyen: 'MAKER',
    tenNhomQuyen: 'MAKER (Lập lệnh giao dịch)',
    moTa: 'Quyền khởi tạo và lập lệnh thanh toán chuyển tiền trong nước và quốc tế',
    doiTuongApDung: 'Cán bộ nghiệp vụ KHDN, Bán lẻ, Giao dịch viên',
    phongBanApDung: 'P001, P002, P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-tpss-2',
    maChuongTrinh: 'TPSS',
    maNhomQuyen: 'CHECKER',
    tenNhomQuyen: 'CHECKER (Kiểm soát giao dịch)',
    moTa: 'Quyền kiểm tra tính hợp lệ, khớp đúng chứng từ và đồng ý chuyển tiếp lệnh thanh toán',
    doiTuongApDung: 'Lãnh đạo phòng KHDN, Bán lẻ, Kế toán',
    phongBanApDung: 'P001, P002, P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-tpss-3',
    maChuongTrinh: 'TPSS',
    maNhomQuyen: 'APPROVER',
    tenNhomQuyen: 'APPROVER (Phê duyệt & Truyền lệnh)',
    moTa: 'Quyền phê duyệt cuối cùng, ký số điện tử và phát lệnh thanh toán liên ngân hàng',
    doiTuongApDung: 'Kiểm soát viên, Trưởng/Phó phòng Kế toán & DVKH, Ban Giám đốc',
    phongBanApDung: 'P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-tpss-4',
    maChuongTrinh: 'TPSS',
    maNhomQuyen: 'VIEWER',
    tenNhomQuyen: 'VIEWER (Tra cứu & Báo cáo)',
    moTa: 'Quyền tra cứu trạng thái điện thanh toán, in chứng từ sao kê và kết xuất báo cáo',
    doiTuongApDung: 'Cán bộ tổng hợp, thanh tra nội bộ, kiểm toán',
    phongBanApDung: 'P001, P002, P003, P004',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // TPTL
  {
    id: 'grp-tptl-1',
    maChuongTrinh: 'TPTL',
    maNhomQuyen: 'MAKER',
    tenNhomQuyen: 'MAKER (Nhập liệu biểu phí)',
    moTa: 'Quyền thiết lập danh mục biểu phí và chạy lịch thu phí định kỳ',
    doiTuongApDung: 'Cán bộ kế toán nghiệp vụ',
    phongBanApDung: 'P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-tptl-2',
    maChuongTrinh: 'TPTL',
    maNhomQuyen: 'CHECKER',
    tenNhomQuyen: 'CHECKER (Kiểm soát thu phí)',
    moTa: 'Quyền duyệt biểu phí và đối soát trích nợ tự động',
    doiTuongApDung: 'Lãnh đạo phòng Kế toán',
    phongBanApDung: 'P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CLIMS
  {
    id: 'grp-clims-1',
    maChuongTrinh: 'CLIMS',
    maNhomQuyen: 'CLIMS_INPUT',
    tenNhomQuyen: 'CLIMS_INPUT (Nhập liệu hạn mức)',
    moTa: 'Khởi tạo và cập nhật hồ sơ hạn mức tín dụng khách hàng doanh nghiệp',
    doiTuongApDung: 'Cán bộ KHDN',
    phongBanApDung: 'P001',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-clims-2',
    maChuongTrinh: 'CLIMS',
    maNhomQuyen: 'CLIMS_CHECK',
    tenNhomQuyen: 'CLIMS_CHECK (Kiểm soát hạn mức)',
    moTa: 'Kiểm tra việc tuân thủ quy định hạn mức rủi ro và phê duyệt hạn mức',
    doiTuongApDung: 'Lãnh đạo KHDN, Cán bộ Quản lý rủi ro',
    phongBanApDung: 'P001, P004',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CRLOS
  {
    id: 'grp-crlos-1',
    maChuongTrinh: 'CRLOS',
    maNhomQuyen: 'CRLOS_SCORER',
    tenNhomQuyen: 'CRLOS_SCORER (Chấm điểm xếp hạng tín dụng)',
    moTa: 'Nhập thông tin tài chính/phi tài chính và chạy mô hình xếp hạng',
    doiTuongApDung: 'Cán bộ tín dụng KHDN & Bán lẻ',
    phongBanApDung: 'P001, P002',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-crlos-2',
    maChuongTrinh: 'CRLOS',
    maNhomQuyen: 'CRLOS_APPROVER',
    tenNhomQuyen: 'CRLOS_APPROVER (Duyệt kết quả xếp hạng)',
    moTa: 'Phê duyệt kết quả xếp hạng tín nhiệm khách hàng',
    doiTuongApDung: 'Lãnh đạo phòng tín dụng / Ban Giám đốc',
    phongBanApDung: 'P001, P002',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CORE_BANKING
  {
    id: 'grp-core-1',
    maChuongTrinh: 'CORE_BANKING',
    maNhomQuyen: 'GDV_TIEN_MAT',
    tenNhomQuyen: 'GDV_TIEN_MAT (Giao dịch viên)',
    moTa: 'Thực hiện giao dịch gửi/rút tiền mặt, mở tài khoản, chuyển tiền nội bộ',
    doiTuongApDung: 'Giao dịch viên',
    phongBanApDung: 'P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-core-2',
    maChuongTrinh: 'CORE_BANKING',
    maNhomQuyen: 'KSV_HACH_TOAN',
    tenNhomQuyen: 'KSV_HACH_TOAN (Kiểm soát viên)',
    moTa: 'Kiểm soát và duyệt các bút toán vượt hạn mức của Giao dịch viên',
    doiTuongApDung: 'Kiểm soát viên, Lãnh đạo kế toán',
    phongBanApDung: 'P003',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'grp-core-3',
    maChuongTrinh: 'CORE_BANKING',
    maNhomQuyen: 'TRA_CUU_CIF',
    tenNhomQuyen: 'TRA_CUU_CIF (Tra cứu số dư)',
    moTa: 'Chỉ xem số dư, sao kê giao dịch, không có quyền hạch toán tài chính',
    doiTuongApDung: 'Cán bộ KHDN, Bán lẻ, Tổng hợp',
    phongBanApDung: 'P001, P002, P004',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  }
];

// 3. Sheet: APP_REGULATIONS
export const initialRegulations: AppRegulation[] = [
  // TPSS
  {
    id: 'reg-tpss-1',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maVanBan: 'VB-TPSS-2024-01',
    tenVanBan: 'Quy định Quản lý và Cấp quyền Sử dụng Hệ thống Thanh toán TPSS',
    soVanBan: '235/QĐ-TGĐ-NHCT',
    ngayBanHanh: '15/03/2024',
    ngayHieuLuc: '01/04/2024',
    donViBanHanh: 'Tổng Giám đốc VietinBank (Trụ sở chính)',
    noiDung: 'Quy định chi tiết điều kiện cấp mới, phân tách vai trò Maker-Checker-Approver, nguyên tắc bảo mật và trách nhiệm của từng cấp phê duyệt trên TPSS.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Văn bản hiện hành áp dụng toàn hệ thống VietinBank',
    linkVanBan: 'https://noi-bo.vietinbank.vn/van-ban/235-qd-tgd',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'reg-tpss-2',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maVanBan: 'VB-TPSS-2024-02',
    tenVanBan: 'Hướng dẫn Phân quyền Chi tiết theo Chức danh Nghiệp vụ tại Chi nhánh',
    soVanBan: '118/HD-NHCT.NB',
    ngayBanHanh: '10/05/2024',
    ngayHieuLuc: '15/05/2024',
    donViBanHanh: 'VietinBank – Chi nhánh Ninh Bình',
    noiDung: 'Phân định hạn mức duyệt lệnh chuyển tiền, quy trình luân chuyển chứng từ và đăng ký chữ ký số cán bộ thanh toán.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Áp dụng nội bộ tại CN Ninh Bình',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'reg-tpss-3',
    maChuongTrinh: 'TPSS',
    tenChuongTrinh: 'TPSS (Hệ thống Thanh toán & Xử lý Giao dịch)',
    maVanBan: 'VB-TPSS-2021-00',
    tenVanBan: 'Quy trình Cấp User Thanh toán Thử nghiệm (Phiên bản Cũ)',
    soVanBan: '88/QĐ-NHCT-CN',
    ngayBanHanh: '12/01/2021',
    ngayHieuLuc: '01/02/2021',
    donViBanHanh: 'Trụ sở chính VietinBank',
    noiDung: 'Quy định phiên bản cũ, đã được thay thế bởi Quyết định 235/QĐ-TGĐ-NHCT.',
    trangThai: 'Hết hiệu lực',
    ghiChu: 'Đã hết hiệu lực từ ngày 01/04/2024',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // TPTL
  {
    id: 'reg-tptl-1',
    maChuongTrinh: 'TPTL',
    tenChuongTrinh: 'TPTL (Hệ thống Thu phí & Tự động Lãi suất)',
    maVanBan: 'VB-TPTL-2023-01',
    tenVanBan: 'Quy định Vận hành và Kiểm soát Thu phí Tự động TPTL',
    soVanBan: '412/QĐ-NHCT-TCKT',
    ngayBanHanh: '20/09/2023',
    ngayHieuLuc: '01/10/2023',
    donViBanHanh: 'Khối Tài chính Kế toán Trụ sở chính',
    noiDung: 'Quy định các nhóm quyền cài đặt biểu phí, thu hồi phí trích nợ tự động tài khoản và quản trị miễn giảm phí.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Văn bản hiện hành',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CLIMS
  {
    id: 'reg-clims-1',
    maChuongTrinh: 'CLIMS',
    tenChuongTrinh: 'CLIMS (Hệ thống Quản lý Giới hạn Hạn mức & Tín dụng)',
    maVanBan: 'VB-CLIMS-2024-01',
    tenVanBan: 'Quy chế Quản lý Hạn mức và Cảnh báo Rủi ro Tín dụng trên CLIMS',
    soVanBan: '190/QC-HĐQT-NHCT',
    ngayBanHanh: '05/02/2024',
    ngayHieuLuc: '01/03/2024',
    donViBanHanh: 'Hội đồng Quản trị VietinBank',
    noiDung: 'Quy định thẩm quyền nhập, kiểm tra và duyệt hạn mức tập đoàn, phân bổ hạn mức chi nhánh.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Văn bản hiện hành',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CRLOS
  {
    id: 'reg-crlos-1',
    maChuongTrinh: 'CRLOS',
    tenChuongTrinh: 'CRLOS (Hệ thống Chấm điểm Tín dụng & Xếp hạng Khách hàng)',
    maVanBan: 'VB-CRLOS-2024-01',
    tenVanBan: 'Quy định Xếp hạng Tín nhiệm Nội bộ Khách hàng trên Hệ thống CRLOS',
    soVanBan: '520/QĐ-TGĐ-QLRR',
    ngayBanHanh: '18/04/2024',
    ngayHieuLuc: '01/05/2024',
    donViBanHanh: 'Khối Quản lý Rủi ro Trụ sở chính',
    noiDung: 'Bắt buộc chấm điểm tín nhiệm khách hàng trước khi trình hạn mức hoặc tờ trình phê duyệt vay.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Văn bản hiện hành',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CORE_BANKING
  {
    id: 'reg-core-1',
    maChuongTrinh: 'CORE_BANKING',
    tenChuongTrinh: 'CoreBanking (Hệ thống Ngân hàng lõi)',
    maVanBan: 'VB-CORE-2023-01',
    tenVanBan: 'Quy chế Quản trị Người dùng và Phân quyền Hệ thống CoreBanking',
    soVanBan: '315/QC-TGĐ-CNTT',
    ngayBanHanh: '10/08/2023',
    ngayHieuLuc: '01/09/2023',
    donViBanHanh: 'Trung tâm CNTT Trụ sở chính',
    noiDung: 'Quy định nguyên tắc cấp Teller ID, bảo mật mật khẩu, thu hồi quyền khi nghỉ việc hoặc điều chuyển vị trí.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Văn bản hiện hành',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // LOS_CREDIT
  {
    id: 'reg-los-1',
    maChuongTrinh: 'LOS_CREDIT',
    tenChuongTrinh: 'LOS (Khởi tạo và phê duyệt khoản vay)',
    maVanBan: 'VB-LOS-2024-01',
    tenVanBan: 'Quy định Vận hành Phân hệ Tín dụng Tự động hóa LOS',
    soVanBan: '405/QĐ-TGĐ-KBL',
    ngayBanHanh: '01/06/2024',
    ngayHieuLuc: '15/06/2024',
    donViBanHanh: 'Khối Bán lẻ & Khối KHDN Trụ sở chính',
    noiDung: 'Quy chuẩn phân quyền luân chuyển hồ sơ vay vốn từ khởi tạo, thẩm định, phê duyệt đến giải ngân.',
    trangThai: 'Còn hiệu lực',
    ghiChu: 'Văn bản hiện hành',
    linkVanBan: '',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  }
];

// 4. Sheet: APP_NOTES
export const initialNotes: AppNote[] = [
  // TPSS
  {
    id: 'note-tpss-1',
    maChuongTrinh: 'TPSS',
    loaiLuuY: 'Lưu ý quan trọng',
    noiDung: 'Kiểm tra kỹ chức năng nhiệm vụ và quyết định phân công công việc của cán bộ trước khi cấp quyền. Tuyệt đối không cấp quyền MAKER nếu cán bộ chưa được đào tạo nghiệp vụ thanh toán.',
    dieuKienApDung: 'Tất cả các đề nghị cấp mới quyền MAKER/CHECKER',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'note-tpss-2',
    maChuongTrinh: 'TPSS',
    loaiLuuY: 'Cảnh báo',
    noiDung: 'Nghiêm cấm cấp đồng thời quyền MAKER và CHECKER/APPROVER cho cùng một cán bộ trên cùng một phòng ban nghiệp vụ (nguyên tắc bất kiêm nhiệm 4 mắt).',
    dieuKienApDung: 'Toàn bộ các phòng ban',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'note-tpss-3',
    maChuongTrinh: 'TPSS',
    loaiLuuY: 'Trường hợp đặc biệt',
    noiDung: 'Trường hợp cán bộ thuộc phòng khác nhưng được giao thực hiện nghiệp vụ có liên quan (kiêm nhiệm thanh toán hoặc giao dịch viên lưu động), cần kiểm tra quyết định phân công công việc bằng văn bản của Giám đốc Chi nhánh trước khi cấp.',
    dieuKienApDung: 'Cán bộ phòng ban ngoại lệ hoặc kiêm nhiệm',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // TPTL
  {
    id: 'note-tptl-1',
    maChuongTrinh: 'TPTL',
    loaiLuuY: 'Lưu ý',
    noiDung: 'Quyền sửa biểu phí chỉ cấp cho Trưởng/Phó phòng Kế toán & DVKH sau khi có phê duyệt chủ trương của Ban Giám đốc.',
    dieuKienApDung: 'Nhóm quyền CHECKER/ADMIN TPTL',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CLIMS
  {
    id: 'note-clims-1',
    maChuongTrinh: 'CLIMS',
    loaiLuuY: 'Lưu ý quan trọng',
    noiDung: 'Cán bộ chỉ được cấp quyền nhập liệu hạn mức tương ứng với phân khúc khách hàng (Doanh nghiệp lớn hoặc SME) theo quyết định phân công.',
    dieuKienApDung: 'Phòng Khách hàng Doanh nghiệp',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },
  {
    id: 'note-clims-2',
    maChuongTrinh: 'CLIMS',
    loaiLuuY: 'Trường hợp đặc biệt',
    noiDung: 'Đối với trường hợp khách hàng chuỗi/tập đoàn liên chi nhánh, phải có văn bản chỉ đạo của Khối KHDN Trụ sở chính mới được phân quyền cập nhật hạn mức nhóm liên quan.',
    dieuKienApDung: 'Khách hàng tập đoàn lớn',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CRLOS
  {
    id: 'note-crlos-1',
    maChuongTrinh: 'CRLOS',
    loaiLuuY: 'Cảnh báo',
    noiDung: 'Không cấp quyền chấm điểm cho cán bộ thẩm định độc lập/cán bộ tái thẩm định rủi ro (đảm bảo tính khách quan giữa đơn vị kinh doanh và đơn vị quản lý rủi ro).',
    dieuKienApDung: 'Phòng Tổng hợp & Quản lý nợ',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  },

  // CORE_BANKING
  {
    id: 'note-core-1',
    maChuongTrinh: 'CORE_BANKING',
    loaiLuuY: 'Lưu ý quan trọng',
    noiDung: 'Khi cán bộ chuyển công tác sang phòng ban khác, Điện toán phải lập tức khóa Teller ID cũ và cấp User mới theo đúng phạm vi phòng ban mới.',
    dieuKienApDung: 'Cán bộ điều chuyển công tác',
    trangThai: 'Hoạt động',
    ngayCapNhat: '15/08/2026 08:00',
    nguoiCapNhat: 'admin_nb'
  }
];
