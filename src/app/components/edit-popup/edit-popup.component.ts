import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../types';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
})
export class EditPopupComponent {
  constructor(private formBuilder: FormBuilder) {}

  @Input() display: boolean = false; //displaying the popup (false by default)
  @Input() header!: string; //once again the ! means it will always be provided so we don't have to initialize it
  @Input() product: Product = {
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  @Output() confirm = new EventEmitter<any>(); //emitting a new value once we've updated or deleted a product
  @Output() cancel = new EventEmitter<void>(); // If we cancel an event we return void
  @Output() displayChange = new EventEmitter<boolean>(); // two-way binding so we can properly see changes in display property for our popup

  specialCHaracterValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[^a-zA-Z0-9 () -]/g.test(control.value); //basically every character excpet numbers,letters,parenthesis amd '-'
      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  productForm = this.formBuilder.group({
    name: ['', [Validators.required, this.specialCHaracterValidator()]],
    image: [''],
    price: ['', [Validators.required]],
    rating: [0],
  }); //adding required validators for the name and price field

  ngOnChanges() {
    this.productForm.patchValue(this.product);
  } //ngOnChanges instead ngOnInit so our edit popup updates the data

  onConfirm() {
    const { name, image, price, rating } = this.productForm.value;

    this.confirm.emit({
      name: name || '',
      image: image || '',
      price: price || '',
      rating: rating || 0,
    }); //making sure the extracted values are not null
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    this.display = false; //closing the popup
    this.displayChange.emit(this.display);
  }
}
