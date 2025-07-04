import React from 'react';
import logo from './logo_anpan.png';

function Header(){
    return(
        <div className='Header'>
            <a
             href= "https://www.anpanman.jp/"
             target="_blank"
             rel="noopener noreferrer"
            >
             <img src={logo}  alt='ロゴ' className='Header-logo' />
            </a>
        </div>
    );
}
export default Header;

