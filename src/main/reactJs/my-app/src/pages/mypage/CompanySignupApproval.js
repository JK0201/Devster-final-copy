import React, { useEffect, useState } from "react";
import axiosIns from "../../api/JwtConfig";
import MenuModal from "./MenuModal";

function CompanySignupApproval(props) {
  const [companyMemberList, setCompanyMemberList] = useState([]);

  const list = async () => {
    const listUrl = "/api/compmember/D1";

    try {
      const response = await axiosIns.get(listUrl);
      setCompanyMemberList(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    list();
  }, []);

  const [selectedMemberImage, setSelectedMemberImage] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenuBar = (image) => {
    setSelectedMemberImage(image);
    setIsMenuOpen(true);
  };

  const handleApprove = async (cm_idx) => {
    try {
      await axiosIns.patch(`/api/compmember/D1`, { cm_idx, sign: true });
      list();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (cm_idx) => {
    try {
      await axiosIns.patch(`/api/compmember/D1`, { cm_idx, sign: false });
      list();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="memberApproval">
      <div className="content-memberApproval">
        <b className="text-constent-memberApproval">기업회원 가입 승인</b>
        <div className="text-before-memberApproval">
          {companyMemberList.every((member) => member.cm_filename === "no") ? (
            <p>회원가입 승인을 요청한 기업회원이 없습니다.</p>
          ) : (
            companyMemberList
              .filter((member) => member.cm_filename !== "no")
              .map((item, idx) => (
                <div key={idx} className="memberApproval-box">
                  {/* <img
                    alt=""
                    src={`${photoUrl}${item.cm_filename}`}
                    onClick={() => openMenuBar(`${photoUrl}${item.cm_filename}`)}
                  /> */}
                  <div>{item.cm_compname}</div>
                  <div>{item.cm_name}</div>
                  <button onClick={() => handleApprove(item.cm_idx)}>
                    승인
                  </button>
                  <button onClick={() => handleReject(item.cm_idx)}>
                    반려
                  </button>
                </div>
              ))
          )}
        </div>
      </div>
      <MenuModal
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        selectedMemberImage={selectedMemberImage}
      />
    </div>
  );
}

export default CompanySignupApproval;
