const adminBaseUrl = "/admin";

export const menuConfig = [
    {
        label: 'Menu',
        isTitle: true
    },
    {
        label: 'Trang điều khiển',
        link: adminBaseUrl + '/dashboard'
    },
    {
        label: 'Quản lý khoá học',
        link: adminBaseUrl + '/course',
        subItems: [
            {
                label: 'Thêm khoá học',
                link: adminBaseUrl + '/dashboard'
            },
            {
                label: 'Sửa khoá học',
                link: adminBaseUrl + '/dashboard'
            },
            {
                label: 'Xoá khoá học',
                link: adminBaseUrl + '/dashboard'
            },
        ]
    },
];
