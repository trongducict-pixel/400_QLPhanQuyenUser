export function generateGASBackendCode(): string {
  return getFullGoogleAppsScriptCode();
}

export function getFullGoogleAppsScriptCode(): string {
  return `/**
 * ==========================================================================================
 * HỆ THỐNG QUẢN LÝ ĐỀ NGHỊ CẤP QUYỀN CÁC CHƯƠNG TRÌNH ỨNG DỤNG NỘI BỘ
 * ĐƠN VỊ: VIETINBANK – CHI NHÁNH NINH BÌNH (PHIÊN BẢN V1.2)
 * 
 * Tác giả: Điện toán & Công nghệ thông tin - VietinBank Chi nhánh Ninh Bình
 * Email tiếp nhận thông báo & hồ sơ scan: ducnt4@vietinbank.vn
 * ==========================================================================================
 */

// CẤU HÌNH HỆ THỐNG
var IT_EMAIL = "ducnt4@vietinbank.vn";
var APP_NAME = "HỆ THỐNG QUẢN LÝ ĐỀ NGHỊ CẤP QUYỀN - VIETINBANK NINH BÌNH";
var BRANCH_NAME = "VIETINBANK – CHI NHÁNH NINH BÌNH";

/**
 * Hàm khởi tạo tự động toàn bộ 10 Sheet dữ liệu theo chuẩn ngân hàng
 * Bạn có thể chạy hàm này thủ công hoặc hệ thống sẽ tự động khởi tạo khi có request đầu tiên.
 */
function initDatabaseSchema() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheetsDef = [
    {
      name: "REQUESTS",
      headers: [
        "Mã Đề Nghị", "Ngày Tạo", "Mã User AD", "Mã Cán Bộ", "Họ Tên", "User AD",
        "Mã Phòng Ban", "Tên Phòng Ban", "Mã Chương Trình", "Tên Chương Trình",
        "Loại Đề Nghị", "Số QĐ Tuyển Dụng/Phân Công", "Nội Dung", "Trạng Thái",
        "Người Duyệt", "Thời Gian Duyệt", "Lý Do Từ Chối",
        "Người Xử Lý", "Thời Gian Nhận", "Thời Gian Hoàn Thành", "Ngày Cấp Quyền",
        "Kết Quả Xử Lý", "Nội Dung Xử Lý", "Nhóm Quyền Thực Tế", "Mã Nhóm Quyền"
      ]
    },
    {
      name: "CAN_BO",
      headers: [
        "Mã Cán Bộ", "Họ Tên", "User AD", "Mã User AD", "Vai Trò",
        "Mã Phòng Ban", "Tên Phòng Ban", "Chức Vụ", "Trạng Thái", "Mật Khẩu", "Email", "Số Điện Thoại", "Ngày Cấp TK"
      ]
    },
    {
      name: "USERS",
      headers: [
        "Mã User AD", "Họ Tên", "User AD", "Mã Phòng Ban", "Tên Phòng Ban",
        "Chức Vụ", "Trạng Thái", "Mật Khẩu", "Email", "Số Điện Thoại"
      ]
    },
    {
      name: "PHONG_BAN",
      headers: ["Mã Phòng Ban", "Tên Phòng Ban", "Mô Tả", "Trạng Thái"]
    },
    {
      name: "PROGRAMS",
      headers: ["Mã Chương Trình", "Tên Chương Trình", "Mô Tả", "Phạm Vi", "Mô Tả Nghiệp Vụ", "Ghi Chú Chung", "Nhóm Quyền Mặc Định", "Trạng Thái"]
    },
    {
      name: "APPROVALS",
      headers: ["Mã Đề Nghị", "Người Duyệt", "User AD", "Mã Phòng Ban", "Kết Quả", "Lý Do", "Thời Gian"]
    },
    {
      name: "PROCESSING",
      headers: ["Mã Đề Nghị", "Người Xử Lý", "User AD", "Thời Gian Nhận", "Thời Gian Xử Lý", "Kết Quả", "Nội Dung Xử Lý"]
    },
    {
      name: "TONG_HOP_QUYEN",
      headers: ["Mã Cán Bộ", "Họ Tên", "User AD", "Phòng Ban", "Chương Trình", "Quyền Thực Tế", "Ngày Cấp", "Trạng Thái"]
    },
    {
      name: "CONFIG",
      headers: ["Key", "Value", "Mô Tả"]
    },
    {
      name: "AUDIT_LOG",
      headers: ["Thời Gian", "User AD", "Vai Trò", "Hành Động", "Mã Đề Nghị", "Nội Dung", "IP", "Kết Quả"]
    }
  ];

  for (var i = 0; i < sheetsDef.length; i++) {
    var def = sheetsDef[i];
    var sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
      sheet.appendRow(def.headers);
      var headerRange = sheet.getRange(1, 1, 1, def.headers.length);
      headerRange.setBackground("#004F9E").setFontColor("#FFFFFF").setFontWeight("bold");
      sheet.setFrozenRows(1);
      sheet.setRowHeight(1, 32);
    }
  }

  Logger.log("Khởi tạo cấu trúc 10 Sheets VietinBank thành công!");
}

/**
 * Xử lý GET Web API (Kiểm tra kết nối và Đọc dữ liệu)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "ping";
  var responseData = {};

  try {
    ensureSchemaExists();

    if (action === "ping") {
      responseData = {
        success: true,
        message: "Kết nối Google Apps Script Web App (VietinBank Ninh Bình) thành công!",
        timestamp: new Date().toISOString(),
        branch: BRANCH_NAME
      };
    } else if (action === "getRequests") {
      responseData = { success: true, data: getSheetObjects("REQUESTS") };
    } else if (action === "getStaff") {
      responseData = { success: true, data: getSheetObjects("CAN_BO") };
    } else if (action === "getUsers") {
      responseData = { success: true, data: getSheetObjects("USERS") };
    } else if (action === "getDepartments") {
      responseData = { success: true, data: getSheetObjects("PHONG_BAN") };
    } else if (action === "getPrograms") {
      responseData = { success: true, data: getSheetObjects("PROGRAMS") };
    } else if (action === "getAuditLogs") {
      responseData = { success: true, data: getSheetObjects("AUDIT_LOG") };
    } else if (action === "getAllData") {
      responseData = {
        success: true,
        data: {
          requests: getSheetObjects("REQUESTS"),
          staff: getSheetObjects("CAN_BO"),
          users: getSheetObjects("USERS"),
          departments: getSheetObjects("PHONG_BAN"),
          programs: getSheetObjects("PROGRAMS"),
          auditLogs: getSheetObjects("AUDIT_LOG")
        }
      };
    } else {
      responseData = { success: false, message: "Action GET không hợp lệ: " + action };
    }
  } catch (err) {
    responseData = { success: false, message: "Lỗi hệ thống doGet: " + err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý POST Web API (Lưu dữ liệu, Cập nhật trạng thái, Ghi log, Đồng bộ toàn bộ)
 */
function doPost(e) {
  var responseData = {};

  try {
    ensureSchemaExists();

    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var action = data.action;
    var currentUser = data.currentUser || { userAD: "system", hoTen: "Hệ thống", chucVu: "Cán bộ" };
    var payload = data.payload || {};

    if (action === "createRequest") {
      responseData = handleCreateRequest(currentUser, payload);
    } else if (action === "approveRequest") {
      responseData = handleApproveRequest(currentUser, payload);
    } else if (action === "rejectRequest") {
      responseData = handleRejectRequest(currentUser, payload);
    } else if (action === "claimRequest") {
      responseData = handleClaimRequest(currentUser, payload);
    } else if (action === "completeRequest") {
      responseData = handleCompleteRequest(currentUser, payload);
    } else if (action === "saveStaff") {
      responseData = handleSaveStaff(currentUser, payload);
    } else if (action === "saveUser") {
      responseData = handleSaveUser(currentUser, payload);
    } else if (action === "saveDepartment") {
      responseData = handleSaveDepartment(currentUser, payload);
    } else if (action === "saveProgram") {
      responseData = handleSaveProgram(currentUser, payload);
    } else if (action === "addAuditLog") {
      logAudit(currentUser.userAD, currentUser.chucVu, payload.hanhDong || "LOG", payload.maDeNghi, payload.noiDung, payload.ketQua || "Thành công");
      responseData = { success: true, message: "Đã lưu Audit Log" };
    } else if (action === "syncAllData" || action === "syncBatch") {
      responseData = handleSyncAllData(currentUser, payload);
    } else {
      responseData = { success: false, message: "Action POST không hợp lệ: " + action };
    }
  } catch (err) {
    responseData = { success: false, message: "Lỗi xử lý doPost: " + err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Đảm bảo 10 Sheet luôn tồn tại
 */
function ensureSchemaExists() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var reqSheet = ss.getSheetByName("REQUESTS");
  if (!reqSheet) {
    initDatabaseSchema();
  }
}

/**
 * Xử lý: Tạo Đề Nghị Mới
 */
function handleCreateRequest(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("REQUESTS");
  var maDeNghi = payload.maDeNghi || generateNextRequestId();
  
  var now = new Date();
  var ngayTao = payload.ngayTao || Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm");
  
  var row = [
    maDeNghi,
    ngayTao,
    payload.maUserAD || currentUser.maUserAD || ("AD_042_" + currentUser.userAD),
    payload.maCanBo || currentUser.maCanBo || ("CB-" + currentUser.userAD),
    payload.hoTen || currentUser.hoTen,
    payload.userAD || currentUser.userAD,
    payload.maPhongBan || currentUser.maPhongBan,
    payload.tenPhongBan || currentUser.tenPhongBan,
    payload.maChuongTrinh,
    payload.tenChuongTrinh,
    payload.loaiDeNghi,
    payload.soQDTuyenDung_PhanCong || "",
    payload.noiDung || "",
    "Chờ lãnh đạo phòng phê duyệt",
    "", "", "",
    "", "", "", "",
    "", "",
    payload.nhomQuyenGoiY || "",
    payload.maNhomQuyenGoiY || ""
  ];

  sheet.appendRow(row);
  logAudit(currentUser.userAD, currentUser.chucVu, "TẠO_ĐỀ_NGHỊ", maDeNghi, "Tạo đề nghị cấp quyền " + payload.tenChuongTrinh, "Thành công");

  return {
    success: true,
    message: "Đã lưu đề nghị " + maDeNghi + " vào Google Sheet thành công!",
    data: { maDeNghi: maDeNghi }
  };
}

/**
 * Xử lý: Lãnh đạo phòng phê duyệt đề nghị
 */
function handleApproveRequest(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("REQUESTS");
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  var reqData = null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maDeNghi || payload.id)) {
      foundRow = i + 1;
      reqData = data[i];
      break;
    }
  }

  if (foundRow === -1) {
    return { success: false, message: "Không tìm thấy đề nghị " + (payload.maDeNghi || payload.id) };
  }

  var now = new Date();
  var thoiGianDuyet = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm");

  sheet.getRange(foundRow, 14).setValue("Chờ xử lý");
  sheet.getRange(foundRow, 15).setValue(currentUser.hoTen + " (" + currentUser.userAD + ")");
  sheet.getRange(foundRow, 16).setValue(thoiGianDuyet);

  var appSheet = ss.getSheetByName("APPROVALS");
  if (appSheet) {
    appSheet.appendRow([
      payload.maDeNghi || payload.id,
      currentUser.hoTen,
      currentUser.userAD,
      currentUser.maPhongBan,
      "Phê duyệt",
      payload.lyDo || "Đồng ý",
      thoiGianDuyet
    ]);
  }

  // Gửi Email thông báo tới Điện toán
  try {
    var emailSubject = "[ĐỀ NGHỊ CẤP QUYỀN] " + (payload.maDeNghi || payload.id) + " - Đã được phê duyệt";
    var emailBody = "Kính gửi Cán bộ Điện toán,\\n\\n" +
      "Đề nghị cấp quyền " + (payload.maDeNghi || payload.id) + " đã được Lãnh đạo phòng phê duyệt và chuyển đến Điện toán.\\n\\n" +
      "- Cán bộ: " + reqData[4] + " (User AD: " + reqData[5] + ")\\n" +
      "- Phòng ban: " + reqData[7] + "\\n" +
      "- Chương trình: " + reqData[9] + "\\n" +
      "- Lãnh đạo duyệt: " + currentUser.hoTen + "\\n" +
      "- Thời gian: " + thoiGianDuyet + "\\n\\n" +
      "Trân trọng thông báo.";
    MailApp.sendEmail(IT_EMAIL, emailSubject, emailBody);
  } catch (eMailErr) {
    Logger.log("Lỗi gửi email: " + eMailErr.toString());
  }

  logAudit(currentUser.userAD, currentUser.chucVu, "PHÊ_DUYỆT_ĐỀ_NGHỊ", payload.maDeNghi || payload.id, "Lãnh đạo duyệt đề nghị", "Thành công");

  return {
    success: true,
    message: "Đã cập nhật phê duyệt đề nghị " + (payload.maDeNghi || payload.id) + " vào Google Sheet."
  };
}

/**
 * Xử lý: Từ chối đề nghị
 */
function handleRejectRequest(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("REQUESTS");
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maDeNghi || payload.id)) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow === -1) return { success: false, message: "Không tìm thấy đề nghị" };

  var now = new Date();
  var thoiGianDuyet = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm");
  var lyDo = payload.lyDo || "Không đủ điều kiện cấp quyền";

  sheet.getRange(foundRow, 14).setValue("Từ chối");
  sheet.getRange(foundRow, 15).setValue(currentUser.hoTen + " (" + currentUser.userAD + ")");
  sheet.getRange(foundRow, 16).setValue(thoiGianDuyet);
  sheet.getRange(foundRow, 17).setValue(lyDo);

  var appSheet = ss.getSheetByName("APPROVALS");
  if (appSheet) {
    appSheet.appendRow([
      payload.maDeNghi || payload.id,
      currentUser.hoTen,
      currentUser.userAD,
      currentUser.maPhongBan,
      "Từ chối",
      lyDo,
      thoiGianDuyet
    ]);
  }

  logAudit(currentUser.userAD, currentUser.chucVu, "TỪ_CHỐI_ĐỀ_NGHỊ", payload.maDeNghi || payload.id, "Từ chối: " + lyDo, "Thành công");

  return { success: true, message: "Đã ghi nhận từ chối đề nghị trên Google Sheet." };
}

/**
 * Xử lý: Cán bộ IT tiếp nhận xử lý
 */
function handleClaimRequest(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("REQUESTS");
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maDeNghi || payload.id)) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow === -1) return { success: false, message: "Không tìm thấy đề nghị" };

  var now = new Date();
  var thoiGianNhan = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm");

  sheet.getRange(foundRow, 18).setValue(currentUser.hoTen + " (" + currentUser.userAD + ")");
  sheet.getRange(foundRow, 19).setValue(thoiGianNhan);

  logAudit(currentUser.userAD, currentUser.chucVu, "TIẾP_NHẬN_XỬ_LÝ", payload.maDeNghi || payload.id, "Cán bộ IT tiếp nhận xử lý", "Thành công");

  return { success: true, message: "Đã cập nhật người tiếp nhận xử lý." };
}

/**
 * Xử lý: Hoàn thành cấp quyền
 */
function handleCompleteRequest(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("REQUESTS");
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  var reqData = null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maDeNghi || payload.id)) {
      foundRow = i + 1;
      reqData = data[i];
      break;
    }
  }

  if (foundRow === -1) return { success: false, message: "Không tìm thấy đề nghị" };

  var now = new Date();
  var thoiGianHoanThanh = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm");
  var ngayCapQuyen = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy");

  var ketQua = payload.ketQuaXuLy || "Hoàn tất phân quyền trên hệ thống nội bộ";
  var noiDung = payload.noiDungXuLy || "Đã cấu hình quyền theo đề nghị";
  var nhomQuyenThucTe = payload.nhomQuyenThucTe || "";
  var maNhomQuyenThucTe = payload.maNhomQuyenThucTe || "";

  sheet.getRange(foundRow, 14).setValue("Hoàn thành");
  sheet.getRange(foundRow, 18).setValue(currentUser.hoTen + " (" + currentUser.userAD + ")");
  if (!sheet.getRange(foundRow, 19).getValue()) {
    sheet.getRange(foundRow, 19).setValue(thoiGianHoanThanh);
  }
  sheet.getRange(foundRow, 20).setValue(thoiGianHoanThanh);
  sheet.getRange(foundRow, 21).setValue(ngayCapQuyen);
  sheet.getRange(foundRow, 22).setValue(ketQua);
  sheet.getRange(foundRow, 23).setValue(noiDung);
  if (nhomQuyenThucTe) sheet.getRange(foundRow, 24).setValue(nhomQuyenThucTe);
  if (maNhomQuyenThucTe) sheet.getRange(foundRow, 25).setValue(maNhomQuyenThucTe);

  // Ghi vào Sheet PROCESSING
  var procSheet = ss.getSheetByName("PROCESSING");
  if (procSheet) {
    procSheet.appendRow([
      payload.maDeNghi || payload.id,
      currentUser.hoTen,
      currentUser.userAD,
      sheet.getRange(foundRow, 19).getValue(),
      thoiGianHoanThanh,
      ketQua,
      noiDung
    ]);
  }

  // Cập nhật ma trận TỔNG HỢP QUYỀN
  var tongHopSheet = ss.getSheetByName("TONG_HOP_QUYEN");
  if (tongHopSheet && reqData) {
    tongHopSheet.appendRow([
      reqData[3], // Mã cán bộ
      reqData[4], // Họ tên
      reqData[5], // User AD
      reqData[7], // Phòng ban
      reqData[9], // Chương trình
      nhomQuyenThucTe || ketQua,
      ngayCapQuyen,
      "Đã cấp quyền"
    ]);
  }

  logAudit(currentUser.userAD, currentUser.chucVu, "HOÀN_THÀNH_XỬ_LÝ", payload.maDeNghi || payload.id, "Hoàn tất cấp quyền: " + ketQua, "Thành công");

  return {
    success: true,
    message: "Đã cập nhật Hoàn thành đề nghị " + (payload.maDeNghi || payload.id) + " vào Google Sheet!"
  };
}

/**
 * Xử lý: Đồng bộ toàn bộ dữ liệu (101 Cán bộ, Phòng ban, Chương trình, Đề nghị)
 */
function handleSyncAllData(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Cán bộ (CAN_BO)
  if (payload.staff && payload.staff.length > 0) {
    var staffSheet = ss.getSheetByName("CAN_BO");
    if (staffSheet) {
      staffSheet.clearContents();
      staffSheet.appendRow([
        "Mã Cán Bộ", "Họ Tên", "User AD", "Mã User AD", "Vai Trò",
        "Mã Phòng Ban", "Tên Phòng Ban", "Chức Vụ", "Trạng Thái", "Mật Khẩu", "Email", "Số Điện Thoại", "Ngày Cấp TK"
      ]);
      var staffRows = payload.staff.map(function(s) {
        return [
          s.maCanBo || "",
          s.hoTen || "",
          s.userAD || "",
          s.maUserAD || "",
          s.vaiTro || "Cán bộ",
          s.maPhongBan || "",
          s.tenPhongBan || "",
          s.chucVu || "Nhân viên",
          s.trangThai || "Đang làm việc",
          s.matKhau || "123456",
          s.email || "",
          s.soDienThoai || "",
          s.ngayCapTaiKhoan || ""
        ];
      });
      if (staffRows.length > 0) {
        staffSheet.getRange(2, 1, staffRows.length, staffRows[0].length).setValues(staffRows);
      }
    }
  }

  // 2. Tài khoản (USERS)
  if (payload.users && payload.users.length > 0) {
    var userSheet = ss.getSheetByName("USERS");
    if (userSheet) {
      userSheet.clearContents();
      userSheet.appendRow([
        "Mã User AD", "Họ Tên", "User AD", "Mã Phòng Ban", "Tên Phòng Ban",
        "Chức Vụ", "Trạng Thái", "Mật Khẩu", "Email", "Số Điện Thoại"
      ]);
      var userRows = payload.users.map(function(u) {
        return [
          u.maUserAD || "",
          u.hoTen || "",
          u.userAD || "",
          u.maPhongBan || "",
          u.tenPhongBan || "",
          u.chucVu || "Cán bộ",
          u.trangThai || "Hoạt động",
          u.matKhau || "123456",
          u.email || "",
          u.soDienThoai || ""
        ];
      });
      if (userRows.length > 0) {
        userSheet.getRange(2, 1, userRows.length, userRows[0].length).setValues(userRows);
      }
    }
  }

  // 3. Phòng ban (PHONG_BAN)
  if (payload.departments && payload.departments.length > 0) {
    var deptSheet = ss.getSheetByName("PHONG_BAN");
    if (deptSheet) {
      deptSheet.clearContents();
      deptSheet.appendRow(["Mã Phòng Ban", "Tên Phòng Ban", "Mô Tả", "Trạng Thái"]);
      var deptRows = payload.departments.map(function(d) {
        return [d.maPhongBan, d.tenPhongBan, d.moTa || "", d.trangThai || "Hoạt động"];
      });
      deptSheet.getRange(2, 1, deptRows.length, deptRows[0].length).setValues(deptRows);
    }
  }

  // 4. Chương trình (PROGRAMS)
  if (payload.programs && payload.programs.length > 0) {
    var progSheet = ss.getSheetByName("PROGRAMS");
    if (progSheet) {
      progSheet.clearContents();
      progSheet.appendRow(["Mã Chương Trình", "Tên Chương Trình", "Mô Tả", "Phạm Vi", "Mô Tả Nghiệp Vụ", "Ghi Chú Chung", "Nhóm Quyền Mặc Định", "Trạng Thái"]);
      var progRows = payload.programs.map(function(p) {
        return [
          p.maChuongTrinh,
          p.tenChuongTrinh,
          p.moTa || "",
          p.phamVi || "",
          p.moTaNghiepVu || "",
          p.ghiChuChung || "",
          p.nhomQuyenMacDinh || "",
          p.trangThai || "Hoạt động"
        ];
      });
      progSheet.getRange(2, 1, progRows.length, progRows[0].length).setValues(progRows);
    }
  }

  // 5. Đề nghị (REQUESTS)
  if (payload.requests && payload.requests.length > 0) {
    var reqSheet = ss.getSheetByName("REQUESTS");
    if (reqSheet) {
      reqSheet.clearContents();
      reqSheet.appendRow([
        "Mã Đề Nghị", "Ngày Tạo", "Mã User AD", "Mã Cán Bộ", "Họ Tên", "User AD",
        "Mã Phòng Ban", "Tên Phòng Ban", "Mã Chương Trình", "Tên Chương Trình",
        "Loại Đề Nghị", "Số QĐ Tuyển Dụng/Phân Công", "Nội Dung", "Trạng Thái",
        "Người Duyệt", "Thời Gian Duyệt", "Lý Do Từ Chối",
        "Người Xử Lý", "Thời Gian Nhận", "Thời Gian Hoàn Thành", "Ngày Cấp Quyền",
        "Kết Quả Xử Lý", "Nội Dung Xử Lý", "Nhóm Quyền Thực Tế", "Mã Nhóm Quyền"
      ]);
      var reqRows = payload.requests.map(function(r) {
        return [
          r.maDeNghi || "",
          r.ngayTao || "",
          r.maUserAD || "",
          r.maCanBo || "",
          r.hoTen || "",
          r.userAD || "",
          r.maPhongBan || "",
          r.tenPhongBan || "",
          r.maChuongTrinh || "",
          r.tenChuongTrinh || "",
          r.loaiDeNghi || "",
          r.soQDTuyenDung_PhanCong || "",
          r.noiDung || "",
          r.trangThai || "",
          r.nguoiDuyet || "",
          r.thoiGianDuyet || "",
          r.lyDoTuChoi || "",
          r.nguoiXuLy || "",
          r.thoiGianNhan || "",
          r.thoiGianHoanThanh || "",
          r.ngayCapQuyen || "",
          r.ketQuaXuLy || "",
          r.noiDungXuLy || "",
          r.nhomQuyenThucTe || "",
          r.maNhomQuyenThucTe || ""
        ];
      });
      reqSheet.getRange(2, 1, reqRows.length, reqRows[0].length).setValues(reqRows);
    }
  }

  logAudit(currentUser.userAD || "system", currentUser.chucVu || "Admin", "ĐỒNG_BỘ_TOÀN_BỘ", "", "Đồng bộ toàn bộ cơ sở dữ liệu lên Google Sheets", "Thành công");

  return {
    success: true,
    message: "Đã đồng bộ toàn bộ dữ liệu (101 cán bộ, phòng ban, chương trình, đề nghị) vào Google Sheet thành công!"
  };
}

function handleSaveStaff(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("CAN_BO");
  if (!sheet) return { success: false, message: "Sheet CAN_BO không tồn tại" };
  
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maCanBo) || (payload.userAD && String(data[i][2]).toLowerCase() === String(payload.userAD).toLowerCase())) {
      foundRow = i + 1;
      break;
    }
  }

  var row = [
    payload.maCanBo,
    payload.hoTen,
    payload.userAD || "",
    payload.maUserAD || "",
    payload.vaiTro || "Cán bộ",
    payload.maPhongBan || "",
    payload.tenPhongBan || "",
    payload.chucVu || "Nhân viên",
    payload.trangThai || "Đang làm việc",
    payload.matKhau || "123456",
    payload.email || "",
    payload.soDienThoai || "",
    payload.ngayCapTaiKhoan || ""
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  logAudit(currentUser.userAD, currentUser.chucVu, "LƯU_CÁN_BỘ", "", "Lưu cán bộ " + payload.hoTen + " (" + payload.maCanBo + ")", "Thành công");
  return { success: true, message: "Đã lưu cán bộ vào Google Sheet." };
}

function handleSaveUser(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("USERS");
  if (!sheet) return { success: false, message: "Sheet USERS không tồn tại" };
  
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase() === String(payload.userAD).toLowerCase()) {
      foundRow = i + 1;
      break;
    }
  }

  var row = [
    payload.maUserAD || "",
    payload.hoTen || "",
    payload.userAD || "",
    payload.maPhongBan || "",
    payload.tenPhongBan || "",
    payload.chucVu || "Cán bộ",
    payload.trangThai || "Hoạt động",
    payload.matKhau || "123456",
    payload.email || "",
    payload.soDienThoai || ""
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return { success: true, message: "Đã lưu tài khoản người dùng." };
}

function handleSaveDepartment(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("PHONG_BAN");
  if (!sheet) return { success: false, message: "Sheet PHONG_BAN không tồn tại" };
  
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maPhongBan)) {
      foundRow = i + 1;
      break;
    }
  }

  var row = [payload.maPhongBan, payload.tenPhongBan, payload.moTa || "", payload.trangThai || "Hoạt động"];
  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return { success: true, message: "Đã lưu phòng ban." };
}

function handleSaveProgram(currentUser, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("PROGRAMS");
  if (!sheet) return { success: false, message: "Sheet PROGRAMS không tồn tại" };
  
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.maChuongTrinh)) {
      foundRow = i + 1;
      break;
    }
  }

  var row = [
    payload.maChuongTrinh,
    payload.tenChuongTrinh,
    payload.moTa || "",
    payload.phamVi || "",
    payload.moTaNghiepVu || "",
    payload.ghiChuChung || "",
    payload.nhomQuyenMacDinh || "",
    payload.trangThai || "Hoạt động"
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return { success: true, message: "Đã lưu chương trình." };
}

function generateNextRequestId() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("REQUESTS");
  var currentYear = new Date().getFullYear();
  var prefix = "CN-" + currentYear + "-";
  
  if (!sheet) return prefix + "0001";
  
  var data = sheet.getDataRange().getValues();
  var maxSeq = 0;
  
  for (var i = 1; i < data.length; i++) {
    var ma = String(data[i][0]);
    if (ma.indexOf(prefix) === 0) {
      var seq = parseInt(ma.replace(prefix, ""), 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }
  
  var nextSeq = String(maxSeq + 1);
  while (nextSeq.length < 4) nextSeq = "0" + nextSeq;
  return prefix + nextSeq;
}

function logAudit(user, vaiTro, hanhDong, maDeNghi, noiDung, ketQua) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("AUDIT_LOG");
  if (!sheet) return;
  
  var now = new Date();
  var thoiGian = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm:ss");
  sheet.appendRow([thoiGian, user || "system", vaiTro || "Cán bộ", hanhDong, maDeNghi || "", noiDung || "", "10.42.0.1", ketQua || "Thành công"]);
}

function getSheetObjects(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}
`;
}
