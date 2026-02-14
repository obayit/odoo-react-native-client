// this component is AI generated (GPT-4.1, vscode)
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";

const example_data = [
    {
        id: 1,
        name: "Desks",
        parent_id: false,
    },
    {
        id: 10,
        name: "Components",
        parent_id: 1,
    },
];

// Helper to build the breadcrumb path from example_data
function buildBreadcrumb(data, currentId) {
    const path = [];
    let node = data.find((item) => item.id === currentId);
    while (node) {
        path.unshift(node);
        node = node.parent_id ? data.find((item) => item.id === node.parent_id) : null;
    }
    return path;
}

// Helper to add alpha to hex or rgba color
function withAlpha(color, alpha) {
    // If color is already rgba, replace the alpha
    if (color.startsWith('rgba')) {
        return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
    }
    // If color is rgb, convert to rgba
    if (color.startsWith('rgb')) {
        return color.replace(/rgb\(([^,]+),([^,]+),([^,]+)\)/, `rgba($1,$2,$3,${alpha})`);
    }
    // If color is hex, convert to rgba
    let hex = color.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    return color;
}

export default function CategoryBreadcrumb({ data, currentId = 10, onPress }) {
    const theme = useTheme();
    const breadcrumb = buildBreadcrumb(data, currentId);

    // Add 'All' entry at the beginning
    const allEntry = { id: 'all', name: 'All' };
    const fullBreadcrumb = [allEntry, ...breadcrumb];

    if (!data?.length) {
        // return null;
        // DANGER: do not put any hooks under this line, hooks are not conditional
    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} horizontal>
            {fullBreadcrumb.map((item, idx) => (
                <React.Fragment key={item.id}>
                    <TouchableRipple
                        onPress={() => onPress && onPress(item)}
                        borderless
                        rippleColor={withAlpha(theme.colors.primary, 0.2)}
                    >
                        <Text style={[
                            styles.breadcrumbText,
                            idx === fullBreadcrumb.length - 1 && styles.activeText,
                        ]}>
                            {item.name}
                        </Text>
                    </TouchableRipple>
                    {idx < fullBreadcrumb.length - 1 && (
                        <Text style={styles.separator}>/</Text>
                    )}
                </React.Fragment>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 0,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    breadcrumbText: {
        color: '#007b83',
        fontSize: 16,
        paddingHorizontal: 4,
        textDecorationLine: 'underline',
    },
    activeText: {
        color: '#222',
        fontWeight: 'bold',
        textDecorationLine: 'none',
    },
    separator: {
        color: '#888',
        fontSize: 16,
        paddingHorizontal: 2,
    },
});
