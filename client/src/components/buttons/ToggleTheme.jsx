import { AppContext } from '../../App';
import { useContext } from 'react';
import Button from './Button';
import sun from '../../assets/images/icon-sun.svg';
import moon from '../../assets/images/icon-moon.svg';

export default function ToggleTheme() {
    const { theme, toggleTheme } = useContext(AppContext);
    return (
        <Button
            children={
                <img
                    src={theme === 'light' ? moon : sun}
                    alt='Switch theme button'
                />
            }
            onClick={toggleTheme}
        />
    );
}
