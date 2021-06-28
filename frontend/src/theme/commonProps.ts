export const commonProps = {
    animation: {
        transition: {
            duration: 0.3,
        },
    },
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: {xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920},
    },
    shape: {radius: {main: 4, md: 8, round: '1000px'}},
    opacities: {
        op100: 100,
        op80: 80,
        op64: 64,
        op52: 52,
        op40: 40,
        op32: 32,
        op24: 24,
        op16: 16,
        op12: 12,
        op8: 8,
        op4: 4,
    },
    transitions: {
        easeInOut: 'all cubic-bezier(0.4, 0, 0.2, 1) 200ms',
        easeOut: 'all cubic-bezier(0.0, 0, 0.2, 1) 200ms',
        easeIn: 'all cubic-bezier(0.4, 0, 1, 1) 200ms',
        sharp: 'all cubic-bezier(0.4, 0, 0.6, 1) 200ms',
        fast: 'all cubic-bezier(0.4, 0, 0.6, 1) 100ms',
    },
    zIndex: {
        blockFullscreen: 1050,
        navBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
        top: 10,
        main: 1,
        zero: 0,
        negative: -1,
    },
    typography: {
        htmlFontSize: 16,
        fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSizeXs: 11.5,
        fontSizeS: 12,
        fontSize: 13,
        fontSizeH4: 14,
        fontSizeM: 15,
        fontSizeH3: 17,
        fontSizeLg: 18,
        fontSizeSmallXl: 22,
        fontSizeXl: 23,
        fontSizeXXl: 36,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    spacings: {zero: 0, xs4: 2, xs3: 4, xxs2: 6, xs2: 8, xs: 12, s: 16, m: 24, l: 32, xl: 64},
    shadows: {
        none: 'none',
        elevation1: '0px 2px 23px rgba(2, 2, 2, 0.1)',
        elevation2: '0px 10px 45px rgba(47, 52, 65, 0.25)',
        elevation3: '0px 1px 14px rgba(107, 118, 131, 0.2)',
        elevation4: '0px 5px 14px rgba(2, 2, 2, 0.1)',
    },
};
