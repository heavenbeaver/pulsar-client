import DarkThemeIcon from "./DarkThemeIcon";
import LightThemeIcon from "./LightThemeIcon";

const ThemeSwitchButton = ({theme, switchTheme}) => {
    return (
        <div className="switch-theme-btn" onClick={() => switchTheme(theme)}>
            {theme && theme === 'dark' ? <LightThemeIcon /> : <DarkThemeIcon />}
        </div>
    );
}
 
export default ThemeSwitchButton;