import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/AJIB-DARKAH-INDONESIA.png"
            alt="Ajib Darkah Indonesia"
            className={props.className || 'h-10 w-auto'}
        />
    );
}
