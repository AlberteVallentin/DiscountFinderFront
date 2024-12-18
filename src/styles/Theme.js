const colors = {
    neutralLight: "#f7f7f7",
    neutralDark: "#14181C",
    neutralBlue: "#2C3440",
    white: "#FFFFFF",
    black: "#000000",
    lightGray: "#E0E0E0",
    darkBlueGray: "#2F3A47",
    boxShadowLight: "0 10px 30px rgba(0, 0, 0, 0.1)",
    boxShadowDark: "0 10px 30px rgba(255, 255, 255, 0.05)",

};

const overlay = {
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.3)",
    overlayDark: "rgba(0, 0, 0, 0.7)",
};

const tintedColors = {
    neutralDark50: `color-mix(in oklab, ${colors.neutralDark} 90%, ${colors.neutralBlue})`,
    neutralLight50: `color-mix(in oklab, ${colors.neutralLight} 50%, ${colors.black} 50%)`,

};

export const borders = {
    thin: '1px solid',
    medium: '2px solid',
    thick: '3px solid'
};

export const borderRadius = {
    none: '0',
    rounded: '12px',
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
    },
};

export const darkTheme = {
    isDark: true,
    colors: {
        text: colors.neutralLight,
        background: colors.neutralDark,
        card: colors.neutralBlue,
        header: colors.neutralBlue,
        boxShadow: colors.boxShadowDark,
        border: colors.darkBlueGray,
        overlay: overlay.overlayLight,
    },
};