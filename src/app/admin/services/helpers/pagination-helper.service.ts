import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationHelperService {
  generatePageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
