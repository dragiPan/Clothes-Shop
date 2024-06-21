import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  output,
} from '@angular/core';
import { Product } from '../../../types';
import { RatingModule } from 'primeng/rating'; //custom rating template
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api'; //popup template to ensure that the user confirms his delete action before actually deleting the object
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PricePipe } from '../../pipes/price.pipe';
import { TruncateNamePipe } from '../../pipes/truncate-name.pipe';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    RatingModule,
    FormsModule,
    ButtonModule,
    ConfirmPopupModule,
    PricePipe,
    TruncateNamePipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  constructor(private confirmationService: ConfirmationService) {}

  @ViewChild('deleteButton') deleteButton: any; //Sets the View of our desired target to our button

  @Input() product!: Product;
  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() delete: EventEmitter<Product> = new EventEmitter<Product>();

  editProduct() {
    this.edit.emit(this.product);
  }

  //making an event popup for delete function before actually deleting the product
  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement, //uses the View so that it sets the target property onto the html button itself
      message: 'Are you sure you want to delete this article?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProduct(); //deletes the product
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  }

  deleteProduct() {
    this.delete.emit(this.product);
  }
}
