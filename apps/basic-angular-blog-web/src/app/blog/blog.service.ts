import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { IBlog } from './blog.model';
import { environment } from '../../environments/environment';
import { get } from 'aws-amplify/api';

@Injectable()
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  /**
   * Get blog from backend api
   */
  getBlogs(): Observable<IBlog[]> {
    return isDevMode() ? this.getBlogsForDev() : this.getBlogsForProd();
  }

  private getBlogsForDev(): Observable<IBlog[]> {
    return this.http.get<IBlog[]>(this.apiUrl).pipe(
      map(blogs => this.processBlogs(blogs)),
    );
  }

  private getBlogsForProd(): Observable<IBlog[]> {
    return from(this.getBlogsFromAmplify()).pipe(
      // @ts-expect-error ts-migrate(2554) blogs type
      map(blogs => this.processBlogs(blogs)),
      catchError(error => {
        console.error('GET call failed: ', error);
        return throwError(error);
      })
    );
  }

  private processBlogs(blogs: IBlog[]): IBlog[] {
    return blogs.map(blog => ({
      ...blog,
      createdTime: new Date(blog.createdTime),
      updatedTime: new Date(blog.updatedTime),
    }));
  }

  private async getBlogsFromAmplify() {
    try {
      const restOperation = get({
        apiName: 'api',
        path: '/blogs'
      });
      console.log('GET call succeeded: ');
      const response = await restOperation.response;
      return response.body.json; // If json is a method, use json()
    } catch (error) {
      console.error('GET call failed: ', error);
      throw error;
    }
  }
}
