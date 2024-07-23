import questionConstant from "../constants/question.constant";

const questionHelper = {
    getTypeQuestion: (key: number) => {
        const typesQuestion = questionConstant.types;
        const type = typesQuestion.find(type => type.key === key);
        return type ? type.value : 'Không xác định';
    },
    getDifficultyQuestion: (key: number) => {
        const typesQuestion = questionConstant.difficulties;
        const type = typesQuestion.find(type => type.key === key);
        return type ? type.value : 'Không xác định';
    }
};
    
export default questionHelper;
    