import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSpan'
})
export class TimeSpanPipe implements PipeTransform {
    transform(value: string): string {
        // Chuyển đổi giá trị từ chuỗi sang TimeSpan
        const timeSpan = this.parseTimeSpan(value);
    
        // Định dạng giờ, phút và giây
        const hours = timeSpan.hours >= 1 ? `${timeSpan.hours}:` : '';
        const minutes = timeSpan.minutes < 10 ? `0${timeSpan.minutes}` : `${timeSpan.minutes}`;
        const seconds = timeSpan.seconds < 10 ? `0${timeSpan.seconds}` : `${timeSpan.seconds}`;
    
        return `${hours}${minutes}:${seconds}`;
      }
    
      private parseTimeSpan(value: string): { hours: number, minutes: number, seconds: number } {
        const parts = value.split(':');
        return {
          hours: parseInt(parts[0], 10),
          minutes: parseInt(parts[1], 10),
          seconds: parseInt(parts[2], 10)
        };
      }
}
