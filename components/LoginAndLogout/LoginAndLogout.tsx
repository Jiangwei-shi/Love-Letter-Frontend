'use client';

import React, { useState } from 'react';
import styles from './LoginAndLogout.module.css'; // 确保您的CSS样式在这个文件中

export function LoginAndLogout() {
    // State Hooks
    const [isGx, setIsGx] = useState(false);
    const [isTxr, setIsTxr] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isTxl, setIsTxl] = useState(false);
    const [isZ, setIsZ] = useState(false);

    // Button Click Handler
    const changeForm = () => {
        setIsGx(true);
        setTimeout(() => setIsGx(false), 1500);
        setIsTxr(!isTxr);
        setIsHidden(!isHidden);
        setIsTxl(!isTxl);
        setIsZ(!isZ);
    };
    const switchCtnClasses = `${styles.switch} ${isGx ? styles.isGx : ''} ${isTxr ? styles.isTxr : ''}`;
    return (
        <div className={styles.loginAndLogout}>
         <div className={styles.shell}>
             <div className={`${styles.container} ${styles.aContainer} ${isTxl ? styles.isTxl : ''}`} id="aContainer">
                 <form action="" method="" className={styles.form} id="a-form">
                    <h2 className={`${styles.form_title} ${styles.title}`}>创建账号</h2>
                    <span className={styles.form_span}>选择注册方式或电子邮箱注册</span>
                    <input type="text" className={styles.form_input} placeholder="Name" />
                     <input type="text" className={styles.form_input} placeholder="Email" />
                    <input type="text" className={styles.form_input} placeholder="Password" />
                   <button type="button" className={`${styles.form_button} ${styles.button} ${styles.submit}`}>
                     SIGN UP
                   </button>
                 </form>
             </div>

             <div
               className={`${styles.container} ${styles.bContainer} ${isTxl ? styles.isTxl : ''} ${isZ ? styles.isZ : ''}  `}
               id="bContainer"
             >
                <form action="" method="" className={styles.form} id="b-form">
                    <h2 className={`${styles.title}`}>登入账号</h2>
                    <span className={styles.form_span}>选择登录方式或电子邮箱登录</span>
                    <input type="text" className={styles.form_input} placeholder="Email" />
                    <input type="text" className={styles.form_input} placeholder="Password" />
                    <a className={styles.form_link}>忘记密码？</a>
                    <button type="button" className={`${styles.formButton} ${styles.button} ${styles.submit}`}>
                        SIGN IN
                    </button>
                </form>
             </div>

            <div className={switchCtnClasses} id="switch-cnt">
                <div className={`${styles.switch_circle} ${isTxr ? styles.isTxr : ''} `} />
                <div className={`${styles.switch_circle} ${isTxr ? styles.isTxr : ''} ${styles.switch_circle_t} }`} />
                <div className={`${styles.switch_container} ${isHidden ? styles.isHidden : ''} `} id="switch-c1">
                    <h2 className={`${styles.switch_title} ${styles.title}`} style={{ letterSpacing: 0 }}>
                        Welcome Back！
                    </h2>
                    <p className={`${styles.switch_description} ${styles.description}`}>
                        已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
                    </p>
                    <button type="button" className={`${styles.switch_button} ${styles.button} `} onClick={changeForm}>
                        SIGN IN
                    </button>
                </div>

                <div className={`${styles.switch_container} ${isHidden ? '' : styles.isHidden}`} id="switch-c2">
                    <h2 className={`${styles.switch_title} ${styles.title}`} style={{ letterSpacing: 0 }}>Hello Friend！</h2>
                    <p className={`${styles.switch_description} ${styles.description}`}>去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！</p>
                    <button type="button" className={`${styles.switch_button} ${styles.button}`} onClick={changeForm}>
                        SIGN UP
                    </button>
                </div>
            </div>
         </div>
        </div>
    );
}
