export const Colors = {
    dark: {
        background: '#0F0E17',
        surface: '#1F1B2E',
        card: '#2D2640',
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        accent: '#C4B5FD',
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        border: '#3D3550',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Number ball colors
        hot: '#EF4444',      // Red for hot numbers
        warm: '#F59E0B',     // Orange for warm numbers
        neutral: '#8B5CF6',  // Purple for neutral
        cool: '#3B82F6',     // Blue for cool numbers
        cold: '#6366F1',     // Indigo for cold numbers
    },
    light: {
        background: '#FFFFFF',
        surface: '#F9FAFB',
        card: '#F3F4F6',
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        accent: '#7C3AED',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Number ball colors
        hot: '#DC2626',
        warm: '#EA580C',
        neutral: '#7C3AED',
        cool: '#2563EB',
        cold: '#4F46E5',
    },
};

export const getColors = (theme = 'dark') => Colors[theme];

export const Gradients = {
    primary: ['#8B5CF6', '#A78BFA'],
    success: ['#10B981', '#34D399'],
    warning: ['#F59E0B', '#FBBF24'],
    error: ['#EF4444', '#F87171'],
    info: ['#3B82F6', '#60A5FA'],
    purple: ['#7C3AED', '#A78BFA', '#C4B5FD'],
    dark: ['#1F1B2E', '#2D2640'],
};
