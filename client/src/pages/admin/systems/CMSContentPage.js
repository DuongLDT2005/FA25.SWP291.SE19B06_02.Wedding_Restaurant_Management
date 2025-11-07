import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader, CRow, CCol,
  CButton, CFormTextarea, CFormInput
} from "@coreui/react";

const CMSContentPage = () => {
  const [homeContent, setHomeContent] = useState("Nội dung trang chủ...");
  const [aboutContent, setAboutContent] = useState("Giới thiệu hệ thống...");
  const [bannerUrl, setBannerUrl] = useState("https://example.com/banner.jpg");

  const handleSave = () => {
    console.log({ homeContent, aboutContent, bannerUrl });
    alert("✅ Đã lưu nội dung CMS (mock)");
  };

  return (
    <div>
      <h4>📝 CMS Content Management</h4>
      <p style={{ color: "#666" }}>Quản lý nội dung tĩnh của hệ thống</p>

      <CCard className="mt-3">
        <CCardHeader>Nội dung chính</CCardHeader>
        <CCardBody>
          <CFormTextarea
            className="mb-3"
            rows={4}
            label="Trang chủ"
            value={homeContent}
            onChange={(e) => setHomeContent(e.target.value)}
          />
          <CFormTextarea
            className="mb-3"
            rows={4}
            label="Giới thiệu"
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
          />
          <CFormInput
            className="mb-3"
            label="Banner URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />
          <CButton color="primary" onClick={handleSave}>
            Lưu thay đổi
          </CButton>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CMSContentPage;
