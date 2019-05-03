import { Component, OnInit, Input, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import { visibility, flyInOut, expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
'[@flyInOut]': 'true',
'style': 'display: block;'
},
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  @ViewChild('cform') commentFormDirective;

  formErrors = {
      'author': '',
      'comment': '',
    };

    validationMessages = {
      'author': {
        'required':      'Author Name is required.',
        'minlength':     'Author Name must be at least 2 characters long.',
      },
      'comment': {
        'required':      'Comment is required.',
      },

    };
visibility = 'shown';
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;


 constructor(private dishService: DishService,
   private route: ActivatedRoute,
   private location: Location,
  private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
   this.createForm();
 }

 ngOnInit() {
   this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
   this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
 }

 setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
 goBack(): void {
   this.location.back();
 }
 createForm(): void {
   this.commentForm = this.fb.group({
     author: ['', [Validators.required, Validators.minLength(2)]],
     comment: ['', [Validators.required]],
     rating: 5
   });
   this.commentForm.valueChanges
   .subscribe(data => this.onValueChanged(data));

   this.onValueChanged();

 }

   onValueChanged(data?: any) {
       if (!this.commentForm) { return; }
       const form = this.commentForm;
       for (const field in this.formErrors) {
         if (this.formErrors.hasOwnProperty(field)) {
           // clear previous error message (if any)
           this.formErrors[field] = '';
           const control = form.get(field);
           if (control && control.dirty && !control.valid) {
             const messages = this.validationMessages[field];
             for (const key in control.errors) {
               if (control.errors.hasOwnProperty(key)) {
                 this.formErrors[field] += messages[key] + ' ';
               }
             }
           }
         }
       }
     }

   onSubmit() {
     var d = new Date();
     var n = d.toISOString();
     this.commentForm.value.date=n;
     this.comment = this.commentForm.value;
     console.log(this.comment);
     this.dishcopy.comments.push(this.comment);
        this.dishService.putDish(this.dishcopy)
          .subscribe(dish => {
            this.dish = dish; this.dishcopy = dish;
          },
          errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
     this.commentForm.reset({
       author: '',
       rating: 5,
       comment: ''
     });

   }

 }
