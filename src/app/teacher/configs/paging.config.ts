export const DEFAULT_PAGE_INDEX = 1;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PER_PAGE_OPTIONS = [
    {
        label: 10,
        value: 10
    },
    {
        label: 25,
        value: 25
    },
    {
        label: 50,
        value: 50
    },
    {
        label: 100,
        value: 100
    }
]

const pagingConfig = {
    default : {
        pageIndex: 1,
        pageSize: 10
    }
};

export default pagingConfig;
