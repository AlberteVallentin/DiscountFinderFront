export const colors = {
    neutralLight: "#f7f7f7",
    neutralDark: "#161618",
    darkBlue: "#1E2327",
    white: "#FFFFFF",
    black: "#000000",
    lightGray: "#E0E0E0",
    MutedSilver: "#CACACA",
    grey: "#5a5a5a",
    darkBlueGray: "#2F3A47",
    boxShadowLight: "0 10px 30px rgba(0, 0, 0, 0.1)",
    boxShadowDark: "0 10px 30px rgba(255, 255, 255, 0.05)",


};

const overlay = {
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.3)",
    overlayDark: "rgba(0, 0, 0, 0.7)",
};



export const borders = {
    thin: '1px solid',
    medium: '2px solid',
    thick: '3px solid'
};

export const borderRadius = {
    none: '0',
    rounded: '12px',
    round: '2rem',
};

export const zIndex = {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 700,
    footer: 600,
};


export const lightTheme = {
    isDark: false,
    colors: {
        text: colors.neutralDark,
        background: colors.neutralLight,
        card: colors.white,
        header: colors.white,
        boxShadow: colors.boxShadowLight,
        border: colors.lightGray,
        overlay: overlay.overlayLight,
        line: colors.lightGray,
        buttonColor: colors.darkBlue,
        buttonText: colors.neutralLight,
        searchBarIcon: colors.neutralDark,
        disabledHeart: colors.MutedSilver,

    },
    searchBar: {
        text: colors.neutralDark,
        color: colors.white,
    },
};

export const darkTheme = {
    isDark: true,
    colors: {
        text: colors.neutralLight,
        background: colors.neutralDark,
        card: colors.darkBlue,
        header: colors.darkBlue,
        boxShadow: colors.boxShadowDark,
        border: colors.darkBlueGray,
        overlay: overlay.overlayLight,
        line: colors.neutralDark,
        buttonColor: colors.lightGray,
        buttonText: colors.neutralDark,
        searchBarIcon: colors.neutralLight,
        disabledHeart: colors.grey,
    },
    searchBar: {
        text: colors.neutralLight,
        color: colors.darkBlue,
    },
};