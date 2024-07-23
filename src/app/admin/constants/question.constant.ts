const questionConstant = {
    types: [
        {
            key: 1,
            value: "Nhiều lựa chọn" 
        },
        // {
        //     key: 2,
        //     value: "Nhiều đáp án" 
        // },
        // {
        //     key: 3,
        //     value: "Đúng/sai" 
        // },
        // {
        //     key: 4,
        //     value: "Điền vào chỗ trống" 
        // }
    ],
    defaultQuestionAnswerMultipleAnswers: [
        {
            charIndex: "A",
            title: "",
            order: 4,
            isCorrect: true,
            score: 1,
            content: ""
        },
        {
            charIndex: "B",
            title: "",
            order: 3,
            isCorrect: false,
            score: 1,
            content: ""
        },
        {
            charIndex: "C",
            title: "",
            order: 2,
            isCorrect: false,
            score: 1,
            content: ""
        },
        {
            charIndex: "D",
            title: "",
            order: 1,
            isCorrect: false,
            score: 1,
            content: ""
        }
    ],
    typeScores: [
        {
            title: 'Điểm mặc định',
            value: 1
        },
        {
            title: 'Điểm tuỳ chỉnh',
            value: 2
        }
    ],
    typeCkeditor: {
        questionTitle: 1,
        questionAnswerContent: 2,
        questionFeedback: 3
    },
    difficulties: [
        {
            key: 1,
            value: "Dễ" 
        },
        {
            key: 2,
            value: "Trung bình" 
        },
        {
            key: 3,
            value: "Khó" 
        },
    ]
};
    
export default questionConstant;
    