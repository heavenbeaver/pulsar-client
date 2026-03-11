const PlusIcon = ({theme}) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke={theme === 'dark' ? '#fff' : '#000'} strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></svg>
    );
}
 
export default PlusIcon;