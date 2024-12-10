const colors = {
    white: "#FFFFFF",
    black: "#000000",
    lightGray: "#EAEBEE",
    darkBlue: "#1A202C",
    steelBlue: "#333757",
    mediumBlue: "#2D3748",      // Kort baggrund (dark theme)
    lightBlue: "#A3BFFA",       // Accentfarve (dark theme)

    mediumGray: "#718096",      // Placeholder tekst (dark theme)
    borderGray: "#4A5568",      // Kantfarve (dark theme)
    highlightBlue: "#7F9CF5",   // Hover/aktiv farve (dark theme)
    lightBackground: "#F7FAFC", // Lys baggrund (light theme)
    cardWhite: "#FFFFFF",       // Kort baggrund (light theme)
    primaryText: "#1A202C",     // Primær tekst (light theme)
    secondaryText: "#4A5568",   // Sekundær tekst (light theme)
    accentBlue: "#4299E1",      // Accentfarve (light theme)
    borderLight: "#CBD5E0",     // Kantfarve (light theme)
    highlightLight: "#63B3ED",  // Hover/aktiv farve (light theme)
    mutedGray: "#A0AEC0",       // Placeholder tekst (light theme)
};

export const lightTheme = {
    isDark: false,
    colors: {
        text: colors.black,
        background: colors.lightGray,
        card: colors.white,
        header: colors.white,
        border: '#e0e0e0',
        primary: '#2196f3',
        secondary: '#f50057',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800'
    }
};

export const darkTheme = {
    isDark: true,
    colors: {
        text: colors.lightGray,
        background: '#1D2145',
        card: colors.steelBlue,
        header: colors.steelBlue,
        border: '#A0A2B1',
        primary: '#90caf9',
        secondary: '#f48fb1',
        success: '#81c784',
        error: '#e57373',
        warning: '#ffb74d'
    }
};