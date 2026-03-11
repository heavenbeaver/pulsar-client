const Cross = ({theme}) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="" stroke={theme && theme === 'dark' ? '#fff' : '#000'} strokeLinecap="round" strokeWidth="2" d="M20 20L4 4m16 0L4 20"></path></svg>
    )
}

export default Cross