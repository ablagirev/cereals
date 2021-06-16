import {DefaultTheme} from 'styled-components';

import {colors} from './colors';
import {commonProps} from './commonProps';
import {dimensions} from './dimensions';

interface IThemeMixins {
    panel: {
        base: string;
    };
}

const createMixins = (): IThemeMixins => ({
    panel: {
        base: `
            background-color: ${colors.white};
            box-shadow: 0px 2px 23px ${colors.shadowGray};
            border-radius: ${commonProps.shape.radius.md}px;
        `,
    },
});

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface DefaultTheme {
        animation: {
            transition: {
                duration: number;
            };
        };
        dimensions: {
            input: {
                height: number;
            };
            button: {
                height: number;
            };
            dropdown: {
                width: number;
            };
            navBar: {
                height: number;
            };
            navSidebar: {
                width: number;
            };
            formGroupMarkable: {
                paddingLeft: number;
            };
            page: {
                header: {
                    height: number;
                };
                logo: {
                    wrapper: {
                        width: number;
                        height: number;
                        widthExpanded: number;
                        heightExpanded: number;
                    };
                    icon: {
                        width: number;
                        height: number;
                        widthExpanded: number;
                        heightExpanded: number;
                    };
                };
                content: {
                    padding: number;
                    paddingLeft: number;
                };
                bottomBar: {
                    height: number;
                };
            };
        };
        breakpoints: {
            keys: string[];
            values: {
                xs: number;
                sm: number;
                md: number;
                lg: number;
                xl: number;
            };
        };
        shape: {
            radius: {
                main: number;
                md: number;
                round: string;
            };
        };
        opacities: {
            op100: number;
            op80: number;
            op64: number;
            op52: number;
            op40: number;
            op32: number;
            op24: number;
            op16: number;
            op12: number;
            op8: number;
            op4: number;
        };
        transitions: {
            easeInOut: string;
            easeOut: string;
            easeIn: string;
            sharp: string;
            fast: string;
        };
        zIndex: {
            blockFullscreen: number;
            navBar: number;
            drawer: number;
            modal: number;
            snackbar: number;
            tooltip: number;
            top: number;
            main: number;
            zero: number;
            negative: number;
        };
        typography: {
            htmlFontSize: number;
            fontFamily: string;
            fontSizeXs: number;
            fontSizeS: number;
            fontSize: number;
            fontSizeH4: number;
            fontSizeM: number;
            fontSizeH3: number;
            fontSizeLg: number;
            fontSizeSmallXl: number;
            fontSizeXl: number;
            fontSizeXXl: number;
            fontWeightLight: number;
            fontWeightRegular: number;
            fontWeightMedium: number;
            fontWeightBold: number;
        };
        spacings: {
            /**
             * 0px
             */
            zero: number;
            /**
             * 2px
             */
            xs4: number;
            /**
             * 4px
             */
            xs3: number;
            /**
             * 8px
             */
            xxs2: number;
            /**
             * 10px
             */
            xs2: number;
            /**
             * 12px
             */
            xs: number;
            /**
             * 16px
             */
            s: number;
            /**
             * 24px
             */
            m: number;
            /**
             * 32px
             */
            l: number;
            /**
             * 64px
             */
            xl: number;
        };
        palette: {
            type: string;
            common: {
                colors: {
                    black: string;
                    white: string;
                    blackAlt: string;
                    blue: string;
                    dirtyBlue: string;
                    paleBlue: string;
                    green: string;
                    darkGreen: string;
                    red: string;
                    cyan: string;
                    darkRed: string;
                    retailBlue: string;
                    lightBlue: string;
                    orange: string;
                    bodyBg: string;
                    grayMain: string;
                    strokeGray: string;
                    darkGray: string;
                    lightGray: string;
                    inputGray: string;
                    shadowGray: string;
                    gray: {
                        g50: string;
                        g100: string;
                        g200: string;
                        g300: string;
                        g400: string;
                        g500: string;
                        g600: string;
                        g700: string;
                        g800: string;
                        g900: string;
                    };
                };
            };
            background: {
                paper: string;
                default: string;
                level2: string;
                level1: string;
                semiTransparent: string;
                shadowStrokeGray: string;
            };
            text: {
                primary: string;
                secondary: string;
                disabled: string;
                hint: string;
                icon: string;
                contrastText: string;
            };
            json: {
                main: string;
                error: string;
                key: string;
                string: string;
                value: string;
                boolean: string;
            };
        };
        mixins: IThemeMixins;
        shadows: {
            [key: string]: string;
        };
    }
}

export const theme: DefaultTheme = {
    ...commonProps,
    dimensions,
    mixins: createMixins(),
    palette: {
        common: {colors},
        type: 'light',
        background: {
            paper: colors.white,
            default: colors.white,
            level2: '#f5f5f5',
            level1: colors.white,
            semiTransparent: 'rgba(255, 255, 255, 0.2)',
            shadowStrokeGray: 'rgba(220, 224, 235, 0.9)',
        },
        text: {
            primary: colors.blackAlt,
            secondary: 'rgba(255, 255, 255, 0.1)',
            disabled: 'rgba(255, 255, 255, 0.2)',
            hint: 'rgba(255, 255, 255, 0.3)',
            icon: 'rgba(255, 255, 255, 0.4)',
            contrastText: colors.gray.g200,
        },
        json: {
            main: 'none',
            error: colors.black,
            key: colors.dirtyBlue,
            string: colors.darkRed,
            value: colors.darkGreen,
            boolean: colors.blue,
        },
    },
};

