


export const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar..."
                    placeholderTextColor="#999"
                />
            </View>
            <DrawerItemList {...props} />
            <View style={styles.separator} />
            <DrawerItem
                label="Sobre el Proyecto"
                icon={({ color, size }) => <Icon name="info" color={color} size={size} />}
                onPress={() => props.navigation.navigate('Sobre el Proyecto')}
            />
        </DrawerContentScrollView>
    );
}


const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#fff',
        width: 280,
    },
    drawerLabel: {
        marginLeft: -16,
    },
    searchContainer: {
        backgroundColor: '#4285f4',
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 40,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
});