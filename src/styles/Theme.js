const colors = {
    neutralLight: "#f7f7f7",
    neutralDark: "#14181C",
    white: "#FFFFFF",
    black: "#000000",
    boxShadowLight: "0 10px 30px rgba(0, 0, 0, 0.1)",
    boxShadowDark: "0 10px 30px rgba(255, 255, 255, 0.05)",



    lightGray: "#EAEBEE",
    darkBlue: "#1A202C",
    darkSlate: "#2D3748",

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
        text: colors.neutralDark,
        background: colors.neutralLight,
        card: colors.white,
        header: colors.white,
        boxShadow: colors.boxShadowLight,
        border: '#e0e0e0',
    }
};

export const darkTheme = {
    isDark: true,
    colors: {
        text: colors.neutralLight,
        background: colors.neutralDark,
        card: '#2C3440',
        header: "#2C3440",
        boxShadow: colors.boxShadowDark,
        border: '#A0A2B1',
    }
};