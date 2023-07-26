import React, {useCallback, useEffect, useState} from 'react';
import './style/Reviewdetail.css';
import axiosIns from "../../api/JwtConfig";
import {Link, useParams} from "react-router-dom";
import jwt_decode from "jwt-decode";
import StarRating from "./StarRating";
import {Reviewcomment} from "./index";
function Reviewdetail() {

    let de = jwt_decode(localStorage.getItem('accessToken'));
    const m_idx = de.idx;
    const [reviewData, setReviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { rb_idx, currentPage } = useParams();
    const [isGood, setIsGood] = useState(false);
    const [isBad, setIsBad] = useState(false);
    const [status, setStatus] = useState("");

    const fetchReview = useCallback((rb_idx, currentPage = null) => {
        const url=`/api/review/D0/${rb_idx}`;
        axiosIns.get(url)
            .then(response => {
                console.log(response.data);
                setReviewData(response.data);
                setIsLoading(false);

                // fetchReview가 성공적으로 완료된 후에 좋아요 상태 조회
                if (m_idx && rb_idx) {
                    axiosIns.get(`/api/review/D0/${m_idx}/checkGood/${rb_idx}`)
                        .then(response => {
                            setIsGood(response.data); // 좋아요 상태를 받아서 상태 변수에 저장
                        })
                        .catch(error => {
                            console.error('Error checking good status:', error);
                        });

                    // fetchReview가 성공적으로 완료된 후에 싫어요 상태 조회
                    axiosIns.get(`/api/review/D0/${m_idx}/checkBad/${rb_idx}`)
                        .then(response => {
                            setIsBad(response.data); // 싫어요 상태를 받아서 상태 변수에 저장
                        })
                        .catch(error => {
                            console.error('Error checking bad status:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching review:', error);
            });
    }, [m_idx, rb_idx]);


    useEffect(() => {
        fetchReview(rb_idx, currentPage);
    }, [rb_idx, currentPage, fetchReview]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const timeForToday = (value) => {
        if (!value) {
            return '';
        }

        const valueConv = value.slice(0, -10);
        const today = new Date();
        const timeValue = new Date(valueConv);

        // timeValue를 한국 시간대로 변환
        const timeValueUTC = new Date(timeValue.toISOString());
        const offset = timeValue.getTimezoneOffset() * 60 * 1000; // 분 단위를 밀리초 단위로 변환
        const timeValueKST = new Date(timeValueUTC.getTime() - offset);


        const betweenTime = Math.floor((today.getTime() - timeValueKST.getTime()) / 1000 / 60);
        if (betweenTime < 1) return '방금 전';
        if (betweenTime < 60) {
            return `${betweenTime}분 전`;
        }
        //console.log(betweenTime);

        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간 전`;
        }

        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 8) {
            return `${betweenTimeDay}일 전`;
        }

        const year = String(timeValue.getFullYear()).slice(0, 4);
        const month = String(timeValue.getMonth() + 1).padStart(2, '0');
        const day = String(timeValue.getDate()).padStart(2, '0');

        const formattedDateWithoutTime = `${year}-${month}-${day}`;

        return formattedDateWithoutTime;
    };

    const handlelike = (m_idx, rb_idx) => {
        // 먼저 좋아요 상태를 체크합니다.
        axiosIns.get(`/api/review/D0/${m_idx}/checkBad/${rb_idx}`)
            .then(response => {
                if (response.data === 2) {
                    fetchReview(rb_idx, currentPage);
                } else {
                    // 좋아요가 눌러져 있지 않으면, 싫어요 상태를 체크합니다.
                    axiosIns.get(`/api/review/D0/${m_idx}/checkGood/${rb_idx}`)
                        .then(response => {
                            if (response.data === 1) {
                                axiosIns.post(`/api/review/D1/${m_idx}/like/${rb_idx}`)
                                    .then(response => {
                                        fetchReview(rb_idx, currentPage);
                                    })
                                    .catch(error => {
                                        console.error('좋아요 요청 실패:', error);
                                    });
                            } else {
                                // 좋아요와 싫어요 둘 다 눌러져 있지 않으면, 싫어요 작업을 수행합니다.
                                axiosIns.post(`/api/review/D1/${m_idx}/like/${rb_idx}`)
                                    .then(response => {
                                        console.log('좋아요 요청 성공:', response.data);
                                        fetchReview(rb_idx, currentPage);
                                    })
                                    .catch(error => {
                                        console.error('좋아요 요청 실패:', error);
                                    });
                            }
                        })
                        .catch(error => {
                            console.error('좋아요 상태 체크 실패:', error);
                        });
                }
            })
            .catch(error => {
                console.error('싫어요 상태 체크 실패:', error);
            });
    };


    const handleDislike = (m_idx, rb_idx) => {
        // 먼저 좋아요 상태를 체크합니다.
        axiosIns.get(`/api/review/D0/${m_idx}/checkGood/${rb_idx}`)
            .then(response => {
                if (response.data === 1) {
                    fetchReview(rb_idx, currentPage);
                } else {
                    // 좋아요가 눌러져 있지 않으면, 싫어요 상태를 체크합니다.
                    axiosIns.get(`/api/review/D0/${m_idx}/checkBad/${rb_idx}`)
                        .then(response => {
                            if (response.data === 2) {

                                axiosIns.post(`/api/review/D1/${m_idx}/dislike/${rb_idx}`)
                                    .then(response => {
                                        fetchReview(rb_idx, currentPage);
                                    })
                                    .catch(error => {
                                        console.error('싫어요 요청 실패:', error);
                                    });
                            } else {
                                // 좋아요와 싫어요 둘 다 눌러져 있지 않으면, 싫어요 작업을 수행합니다.
                                axiosIns.post(`/api/review/D1/${m_idx}/dislike/${rb_idx}`)
                                    .then(response => {
                                        console.log('싫어요 요청 성공:', response.data);
                                        fetchReview(rb_idx, currentPage);
                                    })
                                    .catch(error => {
                                        console.error('싫어요 요청 실패:', error);
                                    });
                            }
                        })
                        .catch(error => {
                            console.error('싫어요 상태 체크 실패:', error);
                        });
                }
            })
            .catch(error => {
                console.error('좋아요 상태 체크 실패:', error);
            });
    };



    const deleteReview = (rb_idx) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            axiosIns.delete(`/api/review/D1/${rb_idx}`)
                .then(response => {
                    console.log('Review deleted successfully');
                    window.location.href="/review";
                })
                .catch(error => {
                    console.error('Error deleting review:', error);
                });
        }
    };



    let result = reviewData.review.rb_like - reviewData.review.rb_dislike;

    if (reviewData.review.rb_like <= reviewData.review.rb_dislike) {
        result = - result;
    }

    return (
        <div className="review-detail">

            <div className="advertise-box">
                <div className="advertise-main" />
                <b className="advertise-text">광고</b>
            </div>
            <div className="review-detail-comp">
                <div className="review-detail-comp-box" />
                <div className="review-detail-comp-info">
                    <img
                        className="review-detail-comp-info-img-icon"
                        alt=""
                        src={reviewData.ciPhoto}
                    />
                    <b className="ci_name_b">{reviewData.ciName} </b>

                    <div
                        className="review-detail-comp-info-stars-icon">
                        <StarRating rating={reviewData.ciStar} />
                    </div>
                </div>
                <div className="review-detail-comp-info-text">
                    <ul className="ul">
                        <li className="li">사원수 : {reviewData.ciPpl}명</li>
                        <li className="cisale_li">매출액 :{reviewData.ciSale}</li>
                        <li className="cisal_li">평균연봉 : {Number(reviewData.ciSal).toLocaleString('ko-KR')}원
                        </li>
                    </ul>
                </div>
            </div>
            <div className="review-detail-header">
                <div className="review-detail-info">
                    <img
                        className="review-detail-info-profile-img-icon"
                        alt=""
                        src={require('./assets/review_detail_info_profile_img.png').default}
                    />
                    <div className="review-detail-info-nickname">{reviewData.mNicname}</div>
                    <div className="review-detail-info-status">
                        <div className="review-detail-info-status-text"> 
                    
                         {timeForToday(reviewData.review.rb_writeday)
                        }{` ·        `}</div>
                        <img
                            className="review-detail-info-status-view-icon"
                            alt=""
                            src={require('./assets/review_detail_info_status_views.svg').default}
                        />
                        <div className="review-detail-info-status-text1">
                            <span className="rview-readcount">{reviewData.review.rb_readcount}</span>
                            {/*<span className="span">{`수정됨 `}</span>*/}
                        </div>
                    </div>
                </div>
                <img
                    className="review-detail-header-function-icon"
                    alt=""
                    src={require('./assets/review_detail_header_function_url.svg').default}
                />
                {m_idx === reviewData.review.m_idx &&(
                    <>
                <Link to={`/review/update/${reviewData.review.rb_idx}`}>
                <img className="review-edit-icon" alt=""
                     src={require('./assets/review-edit.svg').default}/>
                </Link>
                <img className="review-trash-icon" alt=""
                     src={require('./assets/review-trash.svg').default}
                     onClick={() => deleteReview(rb_idx)} />
                    </>
                )}
            </div>
            <div className="review-detail-body">
                <div className="review-detail-body-text">
                    {reviewData.review.rb_content}
                </div>
                <b className="review-detail-body-subject">{reviewData.review.rb_subject}</b>
            </div>
            <div className="review-detail-counter">
                <div className="review-detail-counter-like">
                    <div className="review-detail-counter-like-box" style={isGood ? { backgroundColor: '#F5EFF9' } : {}} />

                    <img
                        className="review-detail-counter-like-ico-icon"
                        alt=""
                        src={require('./assets/review_detail_counter_like_icon.svg').default}
                        onClick={()=>handlelike(m_idx,rb_idx)}
                    />
                </div>
                <div className="review-detail-counter-num">
                    <div className="review-detail-counter-num-box" />
                    <div className="review-detail-counter-num-text">{result}</div>
                </div>
                <div className="review-detail-counter-dislike"
                     onClick={()=> handleDislike(m_idx,rb_idx)}>
                    <div className="review-detail-counter-dislike-"
                         style={isBad ? { backgroundColor: '#F5EFF9' } : {}}
                    />
                    <img
                        className="review-detail-counter-like-ico-icon"
                        alt=""
                        src={require('./assets/review_detail_counter_dislike_icon.svg').default}
                    />
                </div>

            </div>
            <div className="advertise-box1">
                <div className="advertise-main" />
                <b className="advertise-text1">광고 2</b>
            </div>
            <img
                className="review-detail-hr-icon"
                alt=""
                src="/review-detail-hr.svg"
            />

        <Reviewcomment rb_idx={rb_idx}/>
        </div>

    );
}

export default Reviewdetail;