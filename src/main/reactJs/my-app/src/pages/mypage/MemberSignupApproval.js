import React, { useEffect, useState } from "react";
import "./style/MemberSignupApproval.css";
import jwt_decode from "jwt-decode";
import axiosIns from "../../api/JwtConfig";
import MenuModal from "./MenuModal";

function MemberSignupApproval(props) {
  const [memberList, setMemberList] = useState([]);

  const photoUrl = process.env.REACT_APP_MEMBERURL;

  console.log(memberList);

  const list = async () => {
    const listUrl = "/member";

    try {
      const response = await axiosIns.get(listUrl);
      setMemberList(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //처음 시작시 목록 가져오기
  useEffect(() => {
    list();
  }, []);

  const [selectedMemberImage, setSelectedMemberImage] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenuBar = (image) => {
    setSelectedMemberImage(image);
    setIsMenuOpen(true);
  };

  return (
    <div className="memberApproval">
      <div className="content-memberApproval">
        <b className="text-constent-memberApproval">일반회원 가입 승인</b>
        <div className="text-before-memberApproval">
          {memberList.every((member) => member.m_filename === "no") ? (
            <p className="p">회원가입 승인을 요청한 회원이 없습니다.</p>
          ) : (
            memberList
              .filter((member) => member.m_filename !== "no")
              .map((item, idx) => (
                <div key={idx} className="memberApproval-box">
                  <img
                    alt=""
                    src={`${photoUrl}${item.m_filename}`}
                    onClick={() => openMenuBar(`${photoUrl}${item.m_filename}`)}
                  />
                  <div>{item.m_name}</div>
                  <div>{item.ai_name}</div>
                  <button>승인</button>
                  <button>반려</button>
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

export default MemberSignupApproval;