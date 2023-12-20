import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IBlog } from './blog.model';
import { environment } from '../../environments/environment';

@Injectable()
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  /**
   * Get blog from backend api
   */
  getBlogs(): Observable<IBlog[]> {
    return this.http.get<IBlog[]>(this.apiUrl).pipe(
      map((blogs) =>
        blogs.map((blog) => ({
          ...blog,
          createdTime: new Date(blog.createdTime),
          updatedTime: new Date(blog.updatedTime),
        })),
      ),
    );
  }
}
