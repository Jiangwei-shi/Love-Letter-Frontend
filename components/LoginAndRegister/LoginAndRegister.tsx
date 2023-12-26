'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Loader, Notification, rem } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import styles from './LoginAndRegister.module.css';
import { loginThunk, registerThunk } from '@/thunks/authorize-thunk';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export function LoginAndRegister() {
    // State Hooks
    const [isGx, setIsGx] = useState(false);
    const [isTxr, setIsTxr] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isTxl, setIsTxl] = useState(false);
    const [isZ, setIsZ] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [finishedSignUp, setFinishedSignUp] = useState(false);
    const [alreadySignUp, setAlreadySignUp] = useState(false);
    const [occurError, setOccurError] = useState(false);
    const [passwordWrong, setPasswordWrong] = useState(false);
    const [notRegisterYet, setNotRegisterYet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [noInputError, setNoInputError] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.currentUser);
    const router = useRouter();
    const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            router.push('/styleSelect');
        }
        if (finishedSignUp || alreadySignUp || occurError
            || passwordWrong || notRegisterYet || noInputError) {
            const timer = setTimeout(() => {
                setFinishedSignUp(false);
                setAlreadySignUp(false);
                setOccurError(false);
                setPasswordWrong(false);
                setNotRegisterYet(false);
                setNoInputError(false);
            }, 4000);
            return () => clearTimeout(timer); // Clean up the timer
        }
    }, [user, finishedSignUp, alreadySignUp, occurError,
        passwordWrong, notRegisterYet, noInputError]);

    const changeForm = () => {
        setIsGx(true);
        setTimeout(() => setIsGx(false), 1500);
        setIsTxr(!isTxr);
        setIsHidden(!isHidden);
        setIsTxl(!isTxl);
        setIsZ(!isZ);
        setUsername('');
        setPassword('');
    };
    const login = async (event: { preventDefault: () => void; }) => {
        setIsLoading(true);
        event.preventDefault();
        if (!username || !password) {
            // 可以设置一个错误状态或者返回错误信息
            setNoInputError(true);
            setIsLoading(false);
            return; // 直接返回，不执行下面的代码
        }
        const loginInformation = { username, password };
        const action = loginThunk(loginInformation);
        const resultAction = await dispatch(action);
        if (loginThunk.rejected.match(resultAction)) {
            const errorMessage = resultAction.error.message;
            if (errorMessage === 'Request failed with status code 400') {
                setPasswordWrong(true);
            } else {
                setNotRegisterYet(true);
            }
        }
        setIsLoading(false);
    };

    const register = async (event: { preventDefault: () => void; }) => {
        setIsLoading(true);
        event.preventDefault();
        const signupInformation = { username, password };
        const action = registerThunk(signupInformation);
        const resultAction = await dispatch(action);
        if (registerThunk.rejected.match(resultAction)) {
            const errorMessage = resultAction.error.message;
            if (errorMessage === 'Request failed with status code 400') {
                setAlreadySignUp(true);
            } else {
                setOccurError(true);
            }
        } else {
            setFinishedSignUp(true);
        }
        setIsLoading(false);
    };
    const handleUsernameChange = (event: { target: { value:
                React.SetStateAction<string>; }; }) => setUsername(event.target.value);

    const handlePasswordChange = (event: { target: { value:
                React.SetStateAction<string>; }; }) => setPassword(event.target.value);

    const switchCtnClasses = `${styles.switch} ${isGx ? styles.isGx : ''} ${isTxr ? styles.isTxr : ''}`;

    return (
        <Container size="auto" className={styles.containerStyle}>
         <div className={styles.shell}>
             <div className={`${styles.container} ${isHidden ? styles.isHidden : ''}  ${styles.aContainer} ${isTxl ? styles.isTxl : ''}`}>
                 <form action="" method="" className={styles.form} id="b-form">
                     <h2 className={`${styles.title}`}>登入账号</h2>
                     <input
                       type="text"
                       className={styles.form_input}
                       placeholder="Email"
                       value={username}
                       onChange={handleUsernameChange}
                     />
                     <input type="password" className={styles.form_input} placeholder="Password" value={password} onChange={handlePasswordChange} />
                     {passwordWrong && (
                         <Notification icon={xIcon} color="red" title="Sorry!" mt="md" onClose={() => setPasswordWrong(false)} className={styles.notificationFadeOut}>
                             password is wrong
                         </Notification>
                     )}
                     {notRegisterYet && (
                         <Notification icon={xIcon} color="red" title="Sorry!" mt="md" onClose={() => setNotRegisterYet(false)} className={styles.notificationFadeOut}>
                             No such user, please Register.
                         </Notification>
                     )}
                     {noInputError && (
                         <Notification icon={xIcon} color="red" title="Sorry!" mt="md" onClose={() => setNoInputError(false)} className={styles.notificationFadeOut}>
                             please filling your username and password.
                         </Notification>
                     )}
                     <Button
                       type="button"
                       className={`${styles.button} ${styles.submit}`}
                       onClick={login}
                     >
                         {isLoading ? (
                             <Loader color="blue" />
                         ) : (
                             'SIGN IN'
                         )}
                     </Button>
                 </form>
             </div>

             <div className={`${styles.container} ${isHidden ? '' : styles.isHidden} ${styles.bContainer} ${isTxl ? styles.isTxl : ''} ${isZ ? styles.isZ : ''}  `}>
                 <form action="" method="" className={styles.form} id="a-form">
                     <h2 className={`${styles.form_title} ${styles.title}`}>创建账号</h2>
                     <input type="text" className={styles.form_input} placeholder="Email" value={username} onChange={handleUsernameChange} />
                     <input type="text" className={styles.form_input} placeholder="Password" value={password} onChange={handlePasswordChange} />
                     {finishedSignUp && (
                     <Notification icon={checkIcon} color="teal" title="All good!" mt="md" onClose={() => setFinishedSignUp(false)} className={styles.notificationFadeOut}>
                         Everything is fine
                     </Notification>
                     )}
                     {alreadySignUp && (
                         <Notification icon={xIcon} color="red" title="Bummer!" mt="md" onClose={() => setAlreadySignUp(false)} className={styles.notificationFadeOut}>
                             This account has been registered
                         </Notification>
                     )}
                     {occurError && (
                         <Notification icon={xIcon} color="red" title="Ooops!" mt="md" onClose={() => setOccurError(false)} className={styles.notificationFadeOut}>
                             service seems have some issue
                         </Notification>
                     )}
                     <Button type="button" className={`${styles.form_button} ${styles.button} ${styles.submit}`} onClick={register}>
                         {isLoading ? (
                             <Loader color="blue" />
                         ) : (
                             'SIGN UP'
                         )}
                     </Button>
                 </form>
             </div>

             <div className={switchCtnClasses}>
                 {/*<div className={`${styles.switch_circle} ${isTxr ? styles.isTxr : ''} `} />*/}
                 {/*<div className={`${styles.switch_circle} ${isTxr ? styles.isTxr : ''} ${styles.switch_circle_t} }`} />*/}
                 <div className={`${styles.switch_container} ${isHidden ? styles.isHidden : ''} `}>
                     <h2 className={`${styles.switch_title} ${styles.title}`} style={{ letterSpacing: 0 }}>Hello
                         Friend！
                     </h2>
                     <p className={`${styles.switch_description} ${styles.description}`}>去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！</p>
                     <Button type="button" className={`${styles.switch_button} ${styles.button}`} onClick={changeForm}>
                         SIGN UP
                     </Button>
                 </div>

                 <div className={`${styles.switch_container} ${isHidden ? '' : styles.isHidden}`}>

                     <h2 className={`${styles.switch_title} ${styles.title}`} style={{ letterSpacing: 0 }}>
                         Welcome Back！
                     </h2>
                     <p className={`${styles.switch_description} ${styles.description}`}>
                         已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
                     </p>
                     <Button type="button" className={`${styles.switch_button} ${styles.button} `} onClick={changeForm}>
                         SIGN IN
                     </Button>
                 </div>
             </div>
         </div>
        </Container>
    );
}
