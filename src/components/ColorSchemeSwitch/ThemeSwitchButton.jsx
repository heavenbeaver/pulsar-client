import DarkThemeIcon from "./DarkThemeIcon";
import LightThemeIcon from "./LightThemeIcon";

const ThemeSwitchButton = ({theme, switchTheme}) => {
    return (
        <button className="switch-theme-btn" onClick={() => switchTheme(theme)}>
            {theme && theme === 'dark' ? <LightThemeIcon /> : <DarkThemeIcon />}
        </button>
    );
}
 
export default ThemeSwitchButton;