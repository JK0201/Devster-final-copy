import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setM_name, setNameIsValid} from '../../../../redux/normMemberSlice';

function InputName(props) {
    const dispatch = useDispatch();
    const m_name = useSelector(state => state.norm.m_name);
    const nameIsValid = useSelector(state => state.norm.nameIsValid);

    const [isNameTouched, setIsNameTouched] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInputValid, setisInputValid] = useState(true);

    useEffect(() => {
        if (isNameTouched) {
            const timer = setTimeout(() => {
                const isNameValid = m_name.trim() !== '' && /^[A-Za-z가-힣]+$/.test(m_name);
                dispatch(setNameIsValid(isNameValid));
                if (!m_name.trim()) {
                    setErrorMessage('필수 입력 항목입니다.');
                    setisInputValid(false);
                } else if (!isNameValid) {
                    setErrorMessage('이름을 확인해주세요.');
                    setisInputValid(false);
                } else {
                    setErrorMessage('');
                    setisInputValid(true);
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [m_name, dispatch, isNameTouched]);

    const handleNameChange = (e) => {
        if (!isNameTouched) {
            setIsNameTouched(true);
        }
        dispatch(setM_name(e.target.value));
        dispatch(setNameIsValid(false));
    }

    return (
        <div>
            <div className='signup-guest-name-text'>
                <span>이름</span>
                <span className='signup-guest-input-name'> *</span>
            </div>
            {
                isNameTouched && !nameIsValid &&
                <div className='signup-guest-name-valid'>
                    {errorMessage}
                </div>
            }
            <input
                type='text'
                className={`${isInputValid ? 'signup-guest-name-inputbox' : 'signup-guest-name-inputbox-error'}`}
                value={m_name}
                onChange={handleNameChange}
            />
        </div>
    );
}

export default InputName;