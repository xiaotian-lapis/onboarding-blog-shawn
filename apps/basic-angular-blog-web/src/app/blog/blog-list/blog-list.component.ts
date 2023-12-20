import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IBlog } from '../blog.model';
import { Observable } from 'rxjs';
import { selectAllBlogs, selectBlogsViewStatus } from '../blog.selector';
import { Store } from '@ngrx/store';
import * as BlogActions from '../blog.action';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ViewStatus } from '../../shared/constants/status.constant';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { equals, or } from '../../shared/utils/ramda-functions.util';
import { IBlogState } from '../blog.reducer';
import { MatSelectModule } from '@angular/material/select';
import { BlogSortBy, SortOrder } from '../../shared/constants/sort.constant';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    KeyValuePipe
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  protected readonly ViewStatus = ViewStatus;
  protected readonly equals = equals;
  protected readonly or = or;
  protected readonly sortBy = BlogSortBy;
  protected readonly sortOrder = SortOrder;
  protected currentSortBy: string = BlogSortBy.TITLE;
  protected currentSortOrder: string = SortOrder.ASC;
  private blogStore = inject(Store<IBlogState>);
  blogList$: Observable<IBlog[]> = this.blogStore.select(selectAllBlogs);
  viewStatus$: Observable<ViewStatus> = this.blogStore.select(
    selectBlogsViewStatus
  );

  ngOnInit(): void {
    // dispatch load action to load logs into store
    this.blogStore.dispatch(BlogActions.loadBlogs());
  }

  /**
   * Delete blog by id
   * @param blogId blog id
   */
  deleteBlog(blogId: string): void {
    this.blogStore.dispatch(
      BlogActions.removeBlog({
        id: blogId
      })
    );
  }

  /**
   * Sort blog list
   * @param field
   */
  onSortFieldChange(field: BlogSortBy) {
    this.currentSortBy = field;
    this.updateSorting();
  }

  /**
   * Sort blog list
   * @param order
   */
  onSortOrderChange(order: SortOrder) {
    this.currentSortOrder = order;
    this.updateSorting();
  }

  /**
   * Update sorting
   * @private
   */
  private updateSorting() {
    if (this.currentSortBy && this.currentSortOrder) {
      console.log('sortBlogs action triggered');
      console.log(`sort info: sortBy: ${this.currentSortBy}, sortOrder: ${this.currentSortOrder}`);
      this.blogStore.dispatch(
        BlogActions.sortBlogs({
          sortBy: this.currentSortBy,
          sortOrder: this.currentSortOrder
        }));
    }
  }
}
