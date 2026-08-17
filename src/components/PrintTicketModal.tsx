import React from 'react';
import { RequestRecord, User } from '../types';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrintTicketModalProps {
  request: RequestRecord | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintTicketModal: React.FC<PrintTicketModalProps> = ({
  request,
  currentUser,
  isOpen,
  onClose
}) => {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-6 overflow-hidden border border-gray-300 print:shadow-none print:border-none print:max-w-none print:w-full print:m-0">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">
              Xem trước Phiếu đề nghị A4 • {request.maDeNghi}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu A4 ngay</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document A4 Form */}
        <div className="p-8 sm:p-12 text-black bg-white font-serif leading-relaxed text-sm print:p-6 print:text-[12pt] print:leading-normal">
          {/* Header 2 columns */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-400">
            {/* Left: Bank Unit */}
            <div className="text-center">
              <div className="font-bold uppercase tracking-tight text-xs sm:text-sm">
                NGÂN HÀNG TMCP CÔNG THƯƠNG VIỆT NAM
              </div>
              <div className="font-bold uppercase text-xs sm:text-sm text-[#004F9E] print:text-black">
                CHI NHÁNH NINH BÌNH
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 italic">
                Số: {request.maDeNghi}/PĐN-CQ
              </div>
            </div>

            {/* Right: National Motto */}
            <div className="text-center">
              <div className="font-bold uppercase text-xs sm:text-sm">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="font-semibold text-xs sm:text-sm border-b border-black inline-block pb-0.5">
                Độc lập – Tự do – Hạnh phúc
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 italic">
                Ninh Bình, ngày {request.ngayTao.split(' ')[0] || '... tháng ... năm 2026'}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h1 className="text-lg sm:text-xl font-bold uppercase text-[#004F9E] print:text-black tracking-wide">
              PHIẾU ĐỀ NGHỊ CẤP QUYỀN TRUY CẬP CHƯƠNG TRÌNH
            </h1>
            <p className="text-xs italic text-gray-700 mt-1">
              (Kính gửi: Lãnh đạo Phòng & Tổ Điện toán – VietinBank Chi nhánh Ninh Bình)
            </p>
          </div>

          {/* Section I: Staff Info */}
          <div className="space-y-3 mb-6">
            <div className="font-bold text-xs uppercase bg-gray-100 p-1.5 border-l-4 border-[#004F9E] print:border-l-4 print:border-black print:bg-gray-200">
              I. THÔNG TIN CÁN BỘ ĐỀ NGHỊ
            </div>
            <table className="w-full text-xs border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold w-1/3 bg-gray-50 border-r border-gray-300">
                    Họ và tên cán bộ:
                  </td>
                  <td className="p-2 font-bold uppercase">{request.hoTen}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Tài khoản User AD / Mã User:
                  </td>
                  <td className="p-2 font-mono">
                    {request.userAD} (Mã User: {request.maUserAD})
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Phòng ban công tác:
                  </td>
                  <td className="p-2">
                    {request.tenPhongBan} (Mã phòng: {request.maPhongBan})
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Mã số cán bộ:
                  </td>
                  <td className="p-2 font-mono">{request.maCanBo || 'CB-' + request.userAD}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section II: Request Scope */}
          <div className="space-y-3 mb-6">
            <div className="font-bold text-xs uppercase bg-gray-100 p-1.5 border-l-4 border-[#004F9E] print:border-l-4 print:border-black print:bg-gray-200">
              II. NỘI DUNG ĐỀ NGHỊ CẤP QUYỀN
            </div>
            <table className="w-full text-xs border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold w-1/3 bg-gray-50 border-r border-gray-300">
                    Chương trình ứng dụng:
                  </td>
                  <td className="p-2 font-bold text-[#004F9E] print:text-black">
                    {request.tenChuongTrinh} ({request.maChuongTrinh})
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Loại đề nghị:
                  </td>
                  <td className="p-2 font-bold uppercase">{request.loaiDeNghi}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Số QĐ tuyển dụng / Phân công NV:
                  </td>
                  <td className="p-2 font-semibold">{request.soQDTuyenDung_PhanCong}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300 align-top">
                    Nội dung / Lý do cụ thể:
                  </td>
                  <td className="p-2 whitespace-pre-wrap">{request.noiDung}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section III: Approval & Execution Results */}
          <div className="space-y-3 mb-8">
            <div className="font-bold text-xs uppercase bg-gray-100 p-1.5 border-l-4 border-[#004F9E] print:border-l-4 print:border-black print:bg-gray-200">
              III. KẾT QUẢ PHÊ DUYỆT & THỰC HIỆN ĐIỆN TOÁN
            </div>
            <table className="w-full text-xs border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold w-1/3 bg-gray-50 border-r border-gray-300">
                    Ý kiến Lãnh đạo phòng:
                  </td>
                  <td className="p-2">
                    {request.nguoiDuyet ? (
                      <div>
                        <span className="font-bold text-emerald-800 print:text-black">
                          {request.trangThai === 'Từ chối' ? '✕ TỪ CHỐI' : '✓ ĐỒNG Ý PHÊ DUYỆT'}
                        </span>{' '}
                        – Người duyệt: {request.nguoiDuyet} ({request.thoiGianDuyet})
                        {request.lyDoTuChoi && (
                          <div className="text-red-700 print:text-black mt-1">
                            Lý do: {request.lyDoTuChoi}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Chờ phê duyệt</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Cán bộ Điện toán xử lý:
                  </td>
                  <td className="p-2">
                    {request.nguoiXuLy ? (
                      <span>{request.nguoiXuLy}</span>
                    ) : (
                      <span className="text-gray-400 italic">Chờ tiếp nhận</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Ngày cấp quyền chính thức:
                  </td>
                  <td className="p-2 font-bold text-emerald-800 print:text-black">
                    {request.ngayCapQuyen || (
                      <span className="text-gray-400 italic font-normal">
                        Ghi nhận khi hoàn thành
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                    Kết quả thực hiện IT:
                  </td>
                  <td className="p-2">
                    {request.ketQuaXuLy || (
                      <span className="text-gray-400 italic">Chưa thực hiện</span>
                    )}
                  </td>
                </tr>
                {request.nhomQuyenThucTe && (
                  <tr className="border-b border-gray-300">
                    <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                      Nhóm quyền đã cấp:
                    </td>
                    <td className="p-2 font-mono font-bold text-[#004F9E] print:text-black">
                      {request.nhomQuyenThucTe}
                    </td>
                  </tr>
                )}
                {request.canCuVanBan && (
                  <tr>
                    <td className="p-2 font-bold bg-gray-50 border-r border-gray-300">
                      Căn cứ văn bản quy định:
                    </td>
                    <td className="p-2 text-[11px]">
                      {request.canCuVanBan}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Signature 3 columns */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-10 pt-4">
            <div>
              <div className="font-bold uppercase">CÁN BỘ ĐỀ NGHỊ</div>
              <div className="text-[10px] text-gray-500 italic">(Ký, ghi rõ họ tên)</div>
              <div className="h-20 flex items-end justify-center font-bold">{request.hoTen}</div>
            </div>

            <div>
              <div className="font-bold uppercase">LÃNH ĐẠO PHÒNG DUYỆT</div>
              <div className="text-[10px] text-gray-500 italic">(Ký, ghi rõ họ tên)</div>
              <div className="h-20 flex items-end justify-center font-bold">
                {request.nguoiDuyet?.split('(')[0] || ''}
              </div>
            </div>

            <div>
              <div className="font-bold uppercase">TỔ ĐIỆN TOÁN & CNTT</div>
              <div className="text-[10px] text-gray-500 italic">(Ký, ghi rõ họ tên)</div>
              <div className="h-20 flex items-end justify-center font-bold">
                {request.nguoiXuLy?.split('(')[0] || 'Nguyễn Trọng Đức'}
              </div>
            </div>
          </div>

          {/* Footer Footnote */}
          <div className="mt-10 pt-3 border-t border-gray-300 text-[10px] text-gray-500 flex items-center justify-between italic">
            <span>Hệ thống Quản lý Đề nghị Cấp quyền Chương trình – VietinBank Ninh Bình V1.0</span>
            <span>Mã phiếu: {request.maDeNghi}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
