import { Breadcrumb } from "src/app/core/components/breadcrumb/breadcrumb.interface";

export const breadcrumbs: Breadcrumb[] = [
    {
        label: 'Trang chủ',
        link: '/dashboard',
    },
    {
        label: 'Quản lý bài giảng',
        link: '/course/section',
    },
    {
        label: 'Chi tiết chương',
        isTitle: true
    },
]
