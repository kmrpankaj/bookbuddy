import React from 'react'

const Footer = () => {
    return (
        <footer className="py-3 my-4">
            <hr/>
            <p className="text-center text-body-secondary">© 2024 BookBuddy.co.in</p>
            <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item"><a href="https://whatsapp.com/channel/0029VaArd2GDeONE4OiJYn1j" target='_blank' className="nav-link px-2 text-body-secondary">WhatsApp</a></li>
                <li className="nav-item"><a href="https://t.me/bookbuddylib" target='_blank' className="nav-link px-2 text-body-secondary">Telegram</a></li>
                <li className="nav-item"><a href="https://www.instagram.com/bookbuddy.co.in/" target='_blank' className="nav-link px-2 text-body-secondary">Instagram</a></li>
                
            </ul>

        </footer>
    )
}

export default Footer