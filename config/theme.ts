import { DefaultTheme as PaperDefaultTheme, Colors } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

export const paperTheme: typeof PaperDefaultTheme = {
    ...PaperDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        background: '#fff',
        primary: Colors.teal500,
        accent: Colors.orange500,
    },
};
export const navigationContainerTheme: typeof NavigationDefaultTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        background: paperTheme.colors.background,
        primary: paperTheme.colors.primary,
        text: paperTheme.colors.primary
    },
};