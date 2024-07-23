import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questionType'
})
export class QuestionTypePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let result;
    
    switch(value) {
      case 1:
        result = 'Nhiều câu hỏi';
        break;
      case 2:
        result = 'Nhiều đáp án';
        break;
      default:
        result = 'Nhiều câu hỏi';
    }
    return result;
  }
}
