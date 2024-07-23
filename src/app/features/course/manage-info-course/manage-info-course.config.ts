import { Breadcrumb } from "src/app/core/components/breadcrumb/breadcrumb.interface";

export const breadcrumbs: Breadcrumb[] = [
    {
        label: 'Trang chủ',
        link: '/dashboard',
    },
    {
        label: 'Quản lý thông tin khoá học',
        link: '/course/info',
        isTitle: true
    }
]
